import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Contacto from "./pages/Contacto";
import Cotizacion from './pages/Cotizacion';
import About from './pages/About';
import Productos from "./pages/Productos";
import ProductDetail from "./pages/ProductDetail";
import ZohoChat from "./components/ZohoChat";
import Footer from "./components/Footer";
import RecursosClientes from "./pages/RecursosClientes";
import Cart from "./pages/Cart"; // Agregar esta línea

// ✅ Importar las páginas de resultado de pago
import PagoExitoso from "./pages/PagoExitoso";
import PagoFallido from "./pages/PagoFallido";
import PagoPendiente from "./pages/PagoPendiente";

import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <ZohoChat />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/servicios" element={<h2 className="p-6">Servicios</h2>} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/product/:sku" element={<ProductDetail />} />
          <Route path="/cotizacion" element={<Cotizacion />} />
          <Route path="/recursos-clientes" element={<RecursosClientes />} />
          <Route path="/cart" element={<Cart />} />

          {/* ✅ Agregar rutas para páginas de resultado de pago */}
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/pago-fallido" element={<PagoFallido />} />
          <Route path="/pago-pendiente" element={<PagoPendiente />} />

        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;