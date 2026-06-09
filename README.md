# 💧 Simulador de pH — Controle Operacional de ETEI

Simulador operacional voltado para a **Estação de Tratamento de Efluentes Industriais (ETEI)**
de uma indústria de bebidas. A ferramenta ajuda o operador a responder, antes de abrir a válvula,
uma pergunta crítica do dia a dia:

> **"Quantos litros desse produto posso drenar no reator sem prejudicar o tratamento e sem violar a CETESB?"**

O descarte incorreto de efluentes ácidos ou alcalinos pode **matar as bactérias do reator
anaeróbico** e levar a **multas ambientais** por jogar fora da faixa de pH exigida pelo órgão
regulador (CETESB: pH **5,0 – 9,0**). O simulador permite testar o cenário com segurança antes
de agir no mundo real.

---

## 🎯 O que o simulador faz

A partir das condições atuais da ETEI e do produto que se deseja descartar, o app calcula o
**pH resultante da mistura** e emite um **diagnóstico operacional** com um destes resultados:

- ✅ **Descarte correto** — produto certo, volume seguro e pH dentro do alvo.
- ⚠️ **Ajuste fino necessário** — produto correto, mas o volume precisa de calibragem.
- ⛔ **Perigo no reator / violação CETESB** — produto errado ou volume excessivo.

### Como o cálculo funciona

O coração do simulador (`src/utils/phCalc.js`) não usa uma curva de titulação simplificada.
Ele faz um **balanço de carga real** entre o efluente do reator e o produto descartado:

1. Soma o excesso líquido de íons H⁺ / OH⁻ das duas soluções.
2. Aplica a **capacidade tampão** do reator (saturação suave, simulando a alcalinidade real
   do efluente — sem platôs nem degraus artificiais).
3. Converte o excesso em concentração de H⁺ usando o balanço de carga + a constante de
   autoionização da água (Kw = 10⁻¹⁴ a 25 °C).
4. Calcula o pH final: pH = −log₁₀[H⁺].

Incluir Kw é o que torna o modelo fisicamente correto mesmo em concentrações muito baixas,
próximas da neutralização.

---

## 🧪 Fluxo de uso (3 etapas)

| Etapa | Tela | O que o operador informa |
|-------|------|--------------------------|
| **1** | Situação da ETEI | pH atual, pH alvo, volume e temperatura do reator |
| **2** | Produto a drenar | Soda cáustica, ácido, CIP ácido ou CIP cáustico |
| **3** | Volume seguro    | Quantos litros pretende descartar |
| **→**  | Resultado        | pH resultante + diagnóstico CETESB |

### Produtos modelados

| Produto | Composição | pH nominal | Efeito |
|---------|-----------|-----------|--------|
| Soda cáustica | NaOH concentrado | 13,0 | sobe o pH |
| Ácido | HCl / H₂SO₄ | 1,0 | desce o pH |
| CIP ácido | Efluente HNO₃ / H₃PO₄ diluído | 2,5 | desce o pH |
| CIP cáustico | Efluente NaOH de lavagem | 11,5 | sobe o pH |

O simulador também alerta sobre a **temperatura do reator**, já que as bactérias
metanogênicas operam melhor na faixa mesofílica (30–38 °C).

---

## 🛠️ Tecnologias

- [React 19](https://react.dev/) (Create React App)
- [React Router 7](https://reactrouter.com/) — navegação entre etapas
- [Tailwind CSS 3](https://tailwindcss.com/) — estilização (layout mobile-first)
- [lucide-react](https://lucide.dev/) — ícones

---

## 🚀 Como iniciar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) 16+ e npm instalados.

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/renanfaria93/simulador-ph.git
cd simulador-ph

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm start
```

O app abre automaticamente em [http://localhost:3000](http://localhost:3000). A página recarrega
sozinha a cada alteração no código.

---

## 📜 Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Roda o app em modo desenvolvimento (`localhost:3000`). |
| `npm test`  | Executa os testes em modo interativo (watch). |
| `npm run build` | Gera o build de produção otimizado na pasta `build/`. |
| `npm run eject` | Expõe as configurações do CRA (**operação sem volta**). |

---

## 📁 Estrutura do projeto

```
src/
├── App.jsx                # Rotas e layout principal
├── hooks/
│   └── useSimulator.js    # Estado global do simulador (useReducer + cálculo memoizado)
├── utils/
│   └── phCalc.js          # Modelo de pH, produtos e diagnóstico CETESB
├── screens/               # Telas do fluxo (Home, ETEI, Produto, Volume, Resultado)
└── components/            # Componentes reutilizáveis (PhBar, SliderField, cards...)
```

---

## ⚠️ Aviso

Este é um **simulador educacional / operacional de apoio**. Os valores são modelados para
fins de treinamento e decisão rápida — não substituem medição laboratorial nem o julgamento
técnico do responsável pela ETEI.
