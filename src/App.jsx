import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Contacto from "./pages/Contacto";
import Cotizacion from './pages/Cotizacion';
import About from './pages/About';
import Productos from "./pages/Productos";
import ProductDetail from "./pages/ProductDetail";
import ChatManager from "./components/ChatManager";
import Footer from "./components/Footer";
import RecursosClientes from "./pages/RecursosClientes";
import Cart from "./pages/Cart";
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./pages/Account";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute"; 
import OrderTester from "./components/OrderTester"; 
import CartDebugger from './components/CartDebugger';


// Importaciones existentes
import PagoExitoso from "./pages/PagoExitoso";
import PagoFallido from "./pages/PagoFallido";
import PagoPendiente from "./components/PagoPendiente"; // Cambiado a components por ahora

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <Router>
            <Header />
            <ChatManager provider="custom" />
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/servicios" element={<h2 className="p-6">Servicios</h2>} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/product/:sku" element={<ProductDetail />} />
              <Route path="/cotizacion" element={<Cotizacion />} />
              <Route path="/recursos-clientes" element={<RecursosClientes />} />
              <Route path="/cart" element={<Cart />} />

              {/* Rutas de autenticación */}
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
              <Route path="/restablecer-contrasena/:token" element={<ResetPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/test-orders" element={<OrderTester />} />

              {/* Ruta protegida de cuenta */}
              <Route
                path="/cuenta"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />

              {/* Rutas de resultados de pago */}
              <Route path="/pago-exitoso" element={<PagoExitoso />} />
              <Route path="/pago-fallido" element={<PagoFallido />} />
              <Route path="/pago-pendiente" element={<PagoPendiente />} />

              {/* Ruta 404 - No encontrado */}
              <Route path="*" element={<h1 className="text-center p-20 text-4xl">Página no encontrada</h1>} />
            </Routes>
            <Footer />
            <CartDebugger />
          </Router>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;