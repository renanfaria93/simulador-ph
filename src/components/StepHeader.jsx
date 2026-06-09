import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const STEPS = ['ETEI', 'Produto', 'Volume'];

export function StepHeader({ current, title }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-100 px-4 pt-4 pb-3">
      <div className="flex items-center gap-3 mb-3">
        {current > 1 && (
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Voltar"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
        )}
        <h1 className="text-base font-medium text-gray-900">{title}</h1>
      </div>

      <div className="flex gap-1.5">
        {STEPS.map((label, i) => {
          const step = i + 1;
          const done   = step < current;
          const active = step === current;
          return (
            <div key={label} className="flex-1">
              <div
                className={`h-1 rounded-full transition-all ${
                  done ? 'bg-emerald-500' : active ? 'bg-emerald-300' : 'bg-gray-200'
                }`}
              />
              <span className={`text-[10px] mt-1 block ${active ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
