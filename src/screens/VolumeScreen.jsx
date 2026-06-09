import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical } from "lucide-react";
import { StepHeader } from "../components/StepHeader";
import { SliderField } from "../components/SliderField";
import { ResultCard } from "../components/ResultCard";
import { PRODUCTS } from "../utils/phCalc";

const VOL_MIN = 10;
const VOL_MAX = 5000;

export function VolumeScreen({ state, set, result }) {
  const navigate = useNavigate();
  const product = state.productId ? PRODUCTS[state.productId] : null;

  // Texto livre do campo digitável, sincronizado com o slider (state.volumeL)
  const [volumeInput, setVolumeInput] = useState(String(state.volumeL));
  useEffect(() => {
    setVolumeInput(String(state.volumeL));
  }, [state.volumeL]);

  // Enquanto digita: aplica ao vivo só se já for um valor válido dentro da faixa
  function handleVolumeInput(raw) {
    setVolumeInput(raw);
    const n = parseInt(raw, 10);
    if (!Number.isNaN(n) && n >= VOL_MIN && n <= VOL_MAX) {
      set("volumeL", n);
    }
  }

  // Ao sair do campo / Enter: limita à faixa e normaliza o texto
  function commitVolume() {
    const n = parseInt(volumeInput, 10);
    const clamped = Number.isNaN(n) ? state.volumeL : Math.min(VOL_MAX, Math.max(VOL_MIN, n));
    set("volumeL", clamped);
    setVolumeInput(String(clamped));
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <StepHeader current={3} title="Volume a drenar" />

      <div className="flex-1 px-4 py-5 overflow-y-auto">
        {product && (
          <div className="flex items-start gap-3 bg-white border border-gray-100 rounded-2xl p-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <FlaskConical size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{product.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{product.sub}</p>
              <p className="text-[11px] text-gray-400 font-mono mt-1">{product.detail}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
          <div className="text-center mb-5">
            <p className="text-[10px] text-gray-400 mb-1">Volume selecionado</p>
            <div className="flex items-baseline justify-center gap-1.5">
              <input
                type="number"
                inputMode="numeric"
                min={VOL_MIN}
                max={VOL_MAX}
                value={volumeInput}
                onChange={(e) => handleVolumeInput(e.target.value)}
                onBlur={commitVolume}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    commitVolume();
                    e.target.blur();
                  }
                }}
                className="w-36 text-center text-4xl font-medium text-gray-900 bg-transparent border-b-2 border-gray-200 focus:border-emerald-500 outline-none transition-colors"
                aria-label="Volume a drenar em litros"
              />
              <span className="text-sm text-gray-400">L</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">toque para digitar · {VOL_MIN}–{VOL_MAX} L</p>
          </div>

          <SliderField label="Volume a drenar" value={state.volumeL} min={10} max={5000} step={50} unit=" L" onChange={(v) => set("volumeL", v)} />

          <div className="flex justify-between text-xs text-gray-400 -mt-2">
            <span>
              Reator: {state.volumeM3} m³ ({state.volumeM3 * 1000} L)
            </span>
            <span>{((state.volumeL / (state.volumeM3 * 1000)) * 100).toFixed(1)}% do vol.</span>
          </div>
        </div>

        {result && <ResultCard result={result} />}

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 mt-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-medium text-gray-700">Dica operacional:</span> Prefira drenar em pequenas frações, monitorando o pH a cada ciclo. Aguarde 20–30 min entre descartes para o reator se
            estabilizar.
          </p>
        </div>
      </div>

      <div className="px-4 pb-6 pt-2 bg-gray-50">
        <button
          onClick={() => navigate("/resultado")}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white text-sm font-medium py-4 rounded-2xl active:bg-emerald-700 transition-colors"
        >
          Ver diagnóstico completo
        </button>
      </div>
    </div>
  );
}
