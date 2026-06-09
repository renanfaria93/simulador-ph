import { PH_COLORS, phColor } from '../utils/phCalc';

const TICKS = [0, 2, 4, 6, 7, 8, 10, 12, 14];

export function PhBar({ phAtual, phAlvo }) {
  const pct = (ph) => `${((ph / 14) * 100).toFixed(2)}%`;

  return (
    <div className="w-full">
      <div
        className="w-full h-6 rounded-xl flex overflow-hidden border border-gray-200"
        role="img"
        aria-label={`Escala de pH — atual: ${phAtual?.toFixed(1)}, alvo: ${phAlvo?.toFixed(1)}`}
      >
        {PH_COLORS.map((color, i) => (
          <div key={i} style={{ background: color, flex: 1 }} />
        ))}
      </div>

      <div className="relative h-7 mt-0.5">
        {phAtual !== undefined && (
          <div
            className="absolute flex flex-col items-center transition-all duration-300"
            style={{ left: pct(phAtual), transform: 'translateX(-50%)' }}
          >
            <div
              className="w-0.5 h-3 rounded"
              style={{ background: phColor(phAtual) }}
            />
            <span
              className="text-[11px] font-medium px-1.5 py-0 rounded whitespace-nowrap"
              style={{
                background: phColor(phAtual) + '22',
                color: phColor(phAtual),
              }}
            >
              {phAtual.toFixed(1)}
            </span>
          </div>
        )}

        {phAlvo !== undefined && (
          <div
            className="absolute flex flex-col items-center transition-all duration-300"
            style={{ left: pct(phAlvo), transform: 'translateX(-50%)' }}
          >
            <div className="w-0.5 h-3 rounded bg-emerald-600" />
            <span className="text-[11px] font-medium px-1.5 py-0 rounded bg-emerald-50 text-emerald-800 whitespace-nowrap">
              alvo
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between px-0.5">
        {TICKS.map((t) => (
          <span key={t} className="text-[10px] text-gray-400">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
