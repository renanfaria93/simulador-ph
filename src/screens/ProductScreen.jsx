import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { StepHeader } from '../components/StepHeader';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../utils/phCalc';

export function ProductScreen({ state, set }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <StepHeader current={2} title="Produto a drenar" />

      <div className="flex-1 px-4 py-5 overflow-y-auto">
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Selecione o produto que deseja descartar na ETEI. O simulador vai calcular
          se o descarte é seguro para o reator anaeróbico.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {Object.values(PRODUCTS).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              selected={state.productId === product.id}
              onClick={() => set('productId', product.id)}
            />
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 mt-5">
          <p className="text-xs font-medium text-blue-800 mb-1">Como o cálculo funciona</p>
          <p className="text-xs text-blue-700 leading-relaxed font-mono">
            [H⁺]res = (C₁V₁ + C₂V₂) / (V₁+V₂)
          </p>
          <p className="text-xs text-blue-600 mt-1 leading-relaxed">
            Mistura de volumes com base na concentração iônica de cada líquido.
          </p>
        </div>
      </div>

      <div className="px-4 pb-6 pt-2 bg-gray-50">
        <button
          onClick={() => navigate('/step/3')}
          disabled={!state.productId}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white text-sm font-medium py-4 rounded-2xl active:bg-emerald-700 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          Próximo — Definir volume
          <ChevronRight size={18} />
        </button>
        {!state.productId && (
          <p className="text-xs text-gray-400 text-center mt-2">Selecione um produto para continuar</p>
        )}
      </div>
    </div>
  );
}
