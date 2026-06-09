import { useNavigate } from 'react-router-dom';
import { Droplets, ChevronRight } from 'lucide-react';

export function HomeScreen({ onReset }) {
  const navigate = useNavigate();

  function handleStart() {
    onReset();
    navigate('/step/1');
  }

  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
          <Droplets size={32} className="text-emerald-600" />
        </div>

        <h1 className="text-2xl font-medium text-gray-900 text-center mb-2">
          Controle de pH
        </h1>
        <p className="text-sm text-gray-500 text-center leading-relaxed mb-2">
          Simulador operacional para ETEI
        </p>
        <p className="text-xs text-gray-400 text-center leading-relaxed mb-10">
          Indústria de bebidas · CETESB
        </p>

        <button
          onClick={handleStart}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white text-sm font-medium py-4 rounded-2xl active:bg-emerald-700 transition-colors"
        >
          Iniciar simulação
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="px-6 pb-8">
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-xs text-gray-500 font-medium mb-2">O simulador responde</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            "Quantos litros de soda cáustica posso drenar sem prejudicar a ETEI?"
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { label: 'Etapa 1', desc: 'Situação da ETEI' },
            { label: 'Etapa 2', desc: 'Produto a drenar' },
            { label: 'Etapa 3', desc: 'Volume seguro' },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-[11px] font-medium text-gray-700">{s.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
