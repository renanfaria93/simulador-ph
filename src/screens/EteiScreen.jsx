import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { StepHeader } from '../components/StepHeader';
import { SliderField } from '../components/SliderField';
import { PhBar } from '../components/PhBar';
import { phNature, phColor } from '../utils/phCalc';

function TempAlert({ tempC }) {
  if (tempC < 20)
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-2">
        <p className="text-xs text-blue-800 leading-relaxed">
          <span className="font-medium">⚠ Temperatura baixa ({tempC}°C):</span> Bactérias
          metanogênicas operam abaixo do ótimo. Faixa ideal: 30–38°C.
        </p>
      </div>
    );
  if (tempC > 42)
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-3 mt-2">
        <p className="text-xs text-red-800 leading-relaxed">
          <span className="font-medium">⚠ Temperatura crítica ({tempC}°C):</span> Acima de 45°C
          o sistema biológico colapsa. Verifique o controle térmico do reator.
        </p>
      </div>
    );
  if (tempC >= 30 && tempC <= 38)
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mt-2">
        <p className="text-xs text-emerald-800 leading-relaxed">
          <span className="font-medium">✓ Temperatura ideal ({tempC}°C):</span> Faixa mesofílica
          ótima para bactérias anaeróbicas.
        </p>
      </div>
    );
  return null;
}

export function EteiScreen({ state, set }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <StepHeader current={1} title="Situação da ETEI" />

      <div className="flex-1 px-4 py-5 overflow-y-auto">
        <div className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
          <PhBar phAtual={state.phAtual} phAlvo={state.phAlvo} />

          <div className="flex gap-2 mt-4">
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-gray-400 mb-1">pH atual</p>
              <p className="text-2xl font-medium" style={{ color: phColor(state.phAtual) }}>
                {state.phAtual.toFixed(1)}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">{phNature(state.phAtual)}</p>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-gray-400 mb-1">pH alvo</p>
              <p className="text-2xl font-medium text-emerald-600">
                {state.phAlvo.toFixed(1)}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Faixa CETESB</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <SliderField
            label="pH atual da ETEI"
            value={state.phAtual}
            min={0}
            max={14}
            step={0.1}
            formatValue={(v) => v.toFixed(1)}
            onChange={(v) => set('phAtual', v)}
          />
          <SliderField
            label="pH alvo (faixa CETESB)"
            value={state.phAlvo}
            min={5}
            max={9}
            step={0.1}
            formatValue={(v) => v.toFixed(1)}
            onChange={(v) => set('phAlvo', v)}
          />
          <SliderField
            label="Volume do reator"
            value={state.volumeM3}
            min={5}
            max={500}
            step={5}
            unit=" m³"
            onChange={(v) => set('volumeM3', v)}
          />
          <SliderField
            label="Temperatura do reator"
            value={state.tempC}
            min={15}
            max={45}
            step={1}
            unit="°C"
            onChange={(v) => set('tempC', v)}
          />
          <TempAlert tempC={state.tempC} />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mt-4">
          <p className="text-xs text-amber-800 leading-relaxed">
            <span className="font-medium">Faixa ideal do reator anaeróbico:</span> pH 6,5 – 7,5.
            Fora dessa faixa, a atividade bacteriana é reduzida ou cessa.
          </p>
        </div>
      </div>

      <div className="px-4 pb-6 pt-2 bg-gray-50">
        <button
          onClick={() => navigate('/step/2')}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white text-sm font-medium py-4 rounded-2xl active:bg-emerald-700 transition-colors"
        >
          Próximo — Selecionar produto
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
