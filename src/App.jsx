import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSimulator } from './hooks/useSimulator';
import { HomeScreen }    from './screens/HomeScreen';
import { EteiScreen }    from './screens/EteiScreen';
import { ProductScreen } from './screens/ProductScreen';
import { VolumeScreen }  from './screens/VolumeScreen';
import { ResultScreen }  from './screens/ResultScreen';

export default function App() {
  const { state, set, reset, result } = useSimulator();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex items-start justify-center">
        <div className="w-full max-w-sm min-h-screen bg-gray-50 relative overflow-hidden">
          <Routes>
            <Route path="/"          element={<HomeScreen onReset={reset} />} />
            <Route path="/step/1"    element={<EteiScreen state={state} set={set} />} />
            <Route path="/step/2"    element={<ProductScreen state={state} set={set} />} />
            <Route path="/step/3"    element={<VolumeScreen state={state} set={set} result={result} />} />
            <Route path="/resultado" element={<ResultScreen state={state} result={result} onReset={reset} />} />
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
