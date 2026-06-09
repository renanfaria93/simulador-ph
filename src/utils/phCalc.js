export const PH_COLORS = [
  '#c0392b', '#c0392b', '#e74c3c', '#e67e22', '#f39c12',
  '#f1c40f', '#2ecc71', '#27ae60', '#1abc9c', '#16a085',
  '#2980b9', '#2471a3', '#1a5276', '#154360', '#0d2137',
];

export function phColor(ph) {
  const i = Math.min(14, Math.max(0, Math.round(ph)));
  return PH_COLORS[i];
}

export function phNature(ph) {
  if (ph < 6.9) return 'Ácido';
  if (ph > 7.1) return 'Alcalino';
  return 'Neutro';
}

/**
 * Capacidade tampão do reator, em mols equivalentes (escala da saturação suave).
 *
 * Simula a alcalinidade/tamponamento do efluente: perto da neutralização o
 * excesso ácido/básico é suprimido de forma contínua (≈ excesso²/BUFFER_MOLS),
 * suavizando a curva sem criar platô nem degrau.
 *
 * Ajuste:
 *  • Maior  → reator mais "duro" (transição mais larga e suave perto do alvo).
 *  • ~1000  → tamponamento forte/realista; a curva fica bem achatada na faixa
 *             do slider (≤5000 L de ácido/base mexem pouco no pH).
 *  • 0      → modelo ideal sem tampão (curva de titulação "nervosa").
 */
export const BUFFER_MOLS = 30;

/**
 * Calcula o pH resultante da mistura de dois volumes usando balanço de carga real.
 *
 * Algoritmo:
 *  1. Soma o excesso líquido de H⁺ (positivo) ou OH⁻ (negativo) das duas soluções
 *  2. Aplica a capacidade tampão (BUFFER_MOLS) com saturação suave
 *  3. Converte o excesso em [H⁺] pelo balanço de carga + Kw, que inclui a
 *     autoionização da água: [H⁺] = (C + √(C² + 4·Kw)) / 2
 *  4. pH = −log₁₀[H⁺]
 *
 * Incluir Kw é essencial: sem isso, excessos abaixo de 10⁻⁷ mol/L produzem
 * pH invertido (mais ácido → pH maior). Kw = 1e-14 a 25°C.
 */
export function mixedPH(reactorM3, phEtei, volumeL, phProduct) {
  const Kw       = 1e-14;
  const reactorL = reactorM3 * 1000;
  const Vtotal   = reactorL + volumeL;

  // Excesso líquido de H⁺ (mols) de uma solução: positivo = ácido, negativo = básico.
  // Cada pH contribui com [H⁺]=10^-pH e [OH⁻]=Kw/[H⁺]; o líquido é (H⁺ − OH⁻)·volume.
  const ionExcess = (ph, vol) => (Math.pow(10, -ph) - Kw / Math.pow(10, -ph)) * vol;

  const excess = ionExcess(phEtei, reactorL) + ionExcess(phProduct, volumeL);

  // Capacidade tampão (saturação suave): excessos pequenos são fortemente
  // suprimidos (≈ excesso²/BUFFER perto de zero), grandes passam quase
  // intactos — sem platô nem degrau. Mantém o sinal do excesso.
  const effectiveExcess =
    excess * Math.abs(excess) / (Math.abs(excess) + BUFFER_MOLS);

  // Concentração líquida (com sinal) → [H⁺] pelo balanço de carga + Kw.
  const cNet     = effectiveExcess / Vtotal;
  const hConc    = (cNet + Math.sqrt(cNet * cNet + 4 * Kw)) / 2;
  const phResult = -Math.log10(hConc);

  return Math.min(14, Math.max(0, phResult));
}

export function hConcentration(ph) {
  const exp   = -ph;
  const e     = Math.floor(exp);
  const base  = Math.pow(10, exp - e);   // mantissa sempre em [1, 10) — alinhada com o expoente floor(exp)
  const sups  = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  const sup   = String(e).split('').map(c => sups[c] ?? c).join('');
  return `${base.toFixed(1)}×10${sup} mol/L`;
}

export const PRODUCTS = {
  soda: {
    id:     'soda',
    label:  'Soda cáustica',
    sub:    'NaOH — sobe o pH',
    detail: 'Correção de emergência. pH fixo: 13.0 → [H⁺] = 10⁻¹³ mol/L',
    ph:     13.0,   // NaOH concentrado — valor nominal fixo
    effect: 'alcalino',
  },
  acido: {
    id:     'acido',
    label:  'Ácido',
    sub:    'HCl / H₂SO₄ — desce o pH',
    detail: 'Correção de choque alcalino. pH fixo: 1.0 → [H⁺] = 10⁻¹ mol/L',
    ph:     1.0,    // ácido forte concentrado — valor nominal fixo
    effect: 'acido',
  },
  cipAcido: {
    id:     'cipAcido',
    label:  'CIP ácido',
    sub:    'Efluente de limpeza ácida',
    detail: 'Resíduo diluído de HNO₃/H₃PO₄. pH fixo: 2.5 → [H⁺] = 10⁻²·⁵ mol/L',
    ph:     2.5,    // ácido nítrico / fosfórico diluído — valor nominal fixo
    effect: 'acido',
  },
  cipCaustico: {
    id:     'cipCaustico',
    label:  'CIP cáustico',
    sub:    'Efluente de limpeza alcalina',
    detail: 'Resíduo diluído de NaOH de lavagem. pH fixo: 11.5 → [H⁺] = 10⁻¹¹·⁵ mol/L',
    ph:     11.5,   // NaOH diluído — valor nominal fixo
    effect: 'alcalino',
  },
};

export function diagnose({ phAtual, phAlvo, phResultante, product, inCETESB }) {
  const needsAlkali = phAtual < phAlvo;
  const needsAcid   = phAtual > phAlvo;
  const correct =
    (needsAlkali && product.effect === 'alcalino') ||
    (needsAcid   && product.effect === 'acido')    ||
    (phAtual === phAlvo);

  if (!correct) {
    return {
      status:  'danger',
      title:   'Descarte incorreto — perigo no reator anaeróbico',
      message: product.effect === 'alcalino'
        ? `A ETEI já está alcalina (pH ${phAtual.toFixed(1)}). Adicionar produto alcalinizante vai matar as bactérias anaeróbicas. Use um produto acidificante.`
        : `A ETEI já está ácida (pH ${phAtual.toFixed(1)}). Adicionar produto ácido vai inibir as bactérias metanogênicas. Use soda cáustica.`,
    };
  }

  if (!inCETESB) {
    return {
      status:  'danger',
      title:   'Volume excessivo — violação CETESB',
      message: `Produto correto, mas volume excessivo. pH resultante (${phResultante.toFixed(1)}) fora da faixa 5,0–9,0 exigida pela CETESB. Reduza o volume gradualmente.`,
    };
  }

  const inAlvo = Math.abs(phResultante - phAlvo) <= 0.3;
  if (!inAlvo) {
    return {
      status:  'warning',
      title:   'Produto correto — ajuste fino necessário',
      message: `O pH vai de ${phAtual.toFixed(1)} → ${phResultante.toFixed(1)}. Alvo: ${phAlvo.toFixed(1)}. Aumente o volume aos poucos e monitore a cada ciclo.`,
    };
  }

  return {
    status:  'success',
    title:   'Descarte correto — pH dentro do alvo',
    message: `pH resultante ${phResultante.toFixed(1)}, dentro da faixa CETESB (5,0–9,0) e próximo ao alvo de ${phAlvo.toFixed(1)}. Monitore por 30 min antes do próximo descarte.`,
  };
}
