import { useReducer, useMemo } from 'react';
import { mixedPH, diagnose, PRODUCTS } from '../utils/phCalc';

const INITIAL = {
  phAtual:   7.0,   // escala completa 0–14, default neutro
  phAlvo:    7.0,   // faixa CETESB 5–9, default 7.0
  volumeM3:  290,   // default industrial real (290 m³)
  tempC:     25,    // mesofílico ideal: 30–38°C
  productId: null,
  volumeL:   500,   // default 500 L (IBC padrão)
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET': return { ...state, [action.field]: action.value };
    case 'RESET': return INITIAL;
    default: return state;
  }
}

export function useSimulator() {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  const set = (field, value) => dispatch({ type: 'SET', field, value });
  const reset = () => dispatch({ type: 'RESET' });

  const result = useMemo(() => {
    const product = state.productId ? PRODUCTS[state.productId] : null;
    if (!product) return null;

    const raw         = mixedPH(state.volumeM3, state.phAtual, state.volumeL, product.ph);
    const phResultante = Math.min(14, Math.max(0, raw));
    const inCETESB    = phResultante >= 5 && phResultante <= 9;
    const delta       = phResultante - state.phAtual;
    const diagnosis   = diagnose({ phAtual: state.phAtual, phAlvo: state.phAlvo, phResultante, product, inCETESB });

    return { phResultante, inCETESB, delta, diagnosis, product };
  }, [state]);

  return { state, set, reset, result };
}
