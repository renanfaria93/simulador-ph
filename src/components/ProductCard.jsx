import clsx from 'clsx';

export function ProductCard({ product, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left p-4 rounded-xl border transition-all active:scale-95',
        selected
          ? 'border-emerald-500 bg-emerald-50'
          : 'border-gray-200 bg-white'
      )}
      aria-pressed={selected}
    >
      <div className={clsx('text-sm font-medium', selected ? 'text-emerald-800' : 'text-gray-900')}>
        {product.label}
      </div>
      <div className={clsx('text-xs mt-0.5', selected ? 'text-emerald-600' : 'text-gray-500')}>
        {product.sub}
      </div>
      <div className={clsx('text-xs mt-1.5 font-mono', selected ? 'text-emerald-700' : 'text-gray-400')}>
        pH fixo: {product.ph.toFixed(1)}
      </div>
    </button>
  );
}
