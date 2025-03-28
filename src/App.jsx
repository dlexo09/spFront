import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from './pages/About';
import Productos from "./pages/Productos";
import ProductDetail from "./pages/ProductDetail";
import ZohoChat from "./components/ZohoChat"; // Importar el componente del chat

function App() {
  return (
    <Router>
      <Header />
      <ZohoChat /> {/* Agregar el componente del chat */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/servicios" element={<h2 className="p-6">Servicios</h2>} />
        <Route path="/contacto" element={<h2 className="p-6">Contacto</h2>} />
        <Route path="/product/:sku" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default App;