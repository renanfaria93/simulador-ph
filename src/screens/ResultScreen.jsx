import { useNavigate } from 'react-router-dom';
import { RotateCcw, ChevronLeft } from 'lucide-react';
import { ResultCard } from '../components/ResultCard';
import { PhBar } from '../components/PhBar';
import { PRODUCTS, phColor, phNature, hConcentration } from '../utils/phCalc';

export function ResultScreen({ state, result, onReset }) {
  const navigate  = useNavigate();
  const product   = state.productId ? PRODUCTS[state.productId] : null;

  function handleReset() {
    onReset();
    navigate('/');
  }

  if (!result) {
    navigate('/');
    return null;
  }

  const { phResultante, delta } = result;

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 pt-4 pb-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
          aria-label="Voltar"
        >
          <ChevronLeft size={18} className="text-gray-600" />
        </button>
        <h1 className="text-base font-medium text-gray-900">Diagnóstico</h1>
      </div>

      <div className="flex-1 px-4 py-5 overflow-y-auto">
        <ResultCard result={result} />

        <div className="bg-white rounded-2xl border border-gray-100 p-4 mt-4">
          <p className="text-xs font-medium text-gray-500 mb-3">Comparativo de pH</p>
          <PhBar phAtual={phResultante} phAlvo={state.phAlvo} />

          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { label: 'pH inicial',    value: state.phAtual.toFixed(1),    color: phColor(state.phAtual) },
              { label: 'pH resultante', value: phResultante.toFixed(1),     color: phColor(phResultante) },
              { label: 'Variação',      value: (delta >= 0 ? '+' : '') + delta.toFixed(1), color: '#6b7280' },
            ].map((m) => (
              <div key={m.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-gray-400 mb-1">{m.label}</p>
                <p className="text-lg font-medium" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 mt-4">
          <p className="text-xs font-medium text-gray-500 mb-3">Parâmetros utilizados</p>
          <div className="space-y-2">
            {[
              { label: 'Produto',          value: product?.label },
              { label: 'pH produto',       value: product?.ph.toFixed(1) },
              { label: 'Volume drenado',   value: `${state.volumeL} L` },
              { label: 'Reator',           value: `${state.volumeM3} m³` },
              { label: 'Temperatura',      value: `${state.tempC}°C` },
              { label: '[H⁺] resultante',  value: hConcentration(phResultante) },
              { label: 'Natureza',         value: phNature(phResultante) },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-500">{row.label}</span>
                <span className="text-xs font-medium text-gray-800 font-mono">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 mt-4">
          <p className="text-xs font-medium text-blue-800 mb-1">Equações aplicadas</p>
          <p className="text-xs font-mono text-blue-700">pH = −log₁₀[H⁺]</p>
          <p className="text-xs font-mono text-blue-700 mt-1">[H⁺]res = (C₁V₁ + C₂V₂) / (V₁+V₂)</p>
          <p className="text-xs font-mono text-blue-700 mt-1">pH + pOH = 14 (a 25°C)</p>
        </div>
      </div>

      <div className="px-4 pb-6 pt-2 bg-gray-50 flex gap-3">
        <button
          onClick={() => navigate('/step/3')}
          className="flex-1 py-4 rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-700 active:bg-gray-50 transition-colors"
        >
          Ajustar volume
        </button>
        <button
          onClick={handleReset}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 text-white text-sm font-medium active:bg-emerald-700 transition-colors"
        >
          <RotateCcw size={16} />
          Nova simulação
        </button>
      </div>
    </div>
  );
}
