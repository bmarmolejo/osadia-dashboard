import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inventory from './pages/Inventory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inventory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
