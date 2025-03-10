import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import ProductDetail from "./pages/ProductDetail"; // Importar el nuevo componente

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/servicios" element={<h2 className="p-6">Servicios</h2>} />
        <Route path="/contacto" element={<h2 className="p-6">Contacto</h2>} />
        <Route path="/product/:sku" element={<ProductDetail />} /> {/* Agregar la nueva ruta */}
      </Routes>
    </Router>
  );
}

export default App;