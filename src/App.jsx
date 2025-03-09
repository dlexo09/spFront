import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<h2 className="p-6">Servicios</h2>} />
        <Route path="/contacto" element={<h2 className="p-6">Contacto</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
