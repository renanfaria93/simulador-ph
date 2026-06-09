export function SliderField({ label, value, min, max, step, unit, onChange, formatValue }) {
  const display = formatValue ? formatValue(value) : `${value}${unit ?? ''}`;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-sm font-medium text-gray-900">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step ?? 1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
        aria-label={label}
      />
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-400">{min}{unit ?? ''}</span>
        <span className="text-[10px] text-gray-400">{max}{unit ?? ''}</span>
      </div>
    </div>
  );
}
