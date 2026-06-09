import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import clsx from 'clsx';

const CONFIG = {
  success: {
    icon:        CheckCircle,
    iconClass:   'text-emerald-500',
    borderClass: 'border-emerald-400',
    bgClass:     'bg-emerald-50',
    labelClass:  'text-emerald-700',
    label:       'OK',
  },
  warning: {
    icon:        AlertTriangle,
    iconClass:   'text-amber-500',
    borderClass: 'border-amber-400',
    bgClass:     'bg-amber-50',
    labelClass:  'text-amber-700',
    label:       'Ajuste',
  },
  danger: {
    icon:        XCircle,
    iconClass:   'text-red-500',
    borderClass: 'border-red-400',
    bgClass:     'bg-red-50',
    labelClass:  'text-red-700',
    label:       'Risco',
  },
};

export function ResultCard({ result }) {
  if (!result) return null;
  const { phResultante, delta, diagnosis } = result;
  const cfg = CONFIG[diagnosis.status];
  const Icon = cfg.icon;

  return (
    <div className={clsx('rounded-2xl border p-4', cfg.borderClass, cfg.bgClass)}>
      <div className="flex gap-3 items-start mb-4">
        <Icon size={22} className={clsx('flex-shrink-0 mt-0.5', cfg.iconClass)} />
        <div>
          <p className="text-sm font-medium text-gray-900 leading-snug">{diagnosis.title}</p>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">{diagnosis.message}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
          <p className="text-[10px] text-gray-400 mb-1">pH resultante</p>
          <p className="text-xl font-medium text-gray-900">{phResultante.toFixed(1)}</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
          <p className="text-[10px] text-gray-400 mb-1">Variação</p>
          <p className="text-xl font-medium text-gray-900">
            {delta >= 0 ? '+' : ''}{delta.toFixed(1)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
          <p className="text-[10px] text-gray-400 mb-1">CETESB</p>
          <p className={clsx('text-xl font-medium', cfg.labelClass)}>{cfg.label}</p>
        </div>
      </div>
    </div>
  );
}
