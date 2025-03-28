import { Link } from "react-router-dom";
import { useState } from "react";
import './Header.css'; // Importar el archivo CSS personalizado

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header">
      <img src="/img/logoSiscom.png" alt="Siscoprint Logo" className="logo h-full" />
      <button className="menu-button" onClick={toggleMenu}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
      <nav className={`nav ${isOpen ? "open" : ""}`}>
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/about" className="nav-link">Nosotros</Link>
        <Link to="/productos" className="nav-link">Productos</Link>
        {/* <Link to="/servicios" className="nav-link">Servicios</Link> */}
        <Link to="/contacto" className="nav-link">Contacto</Link>
      </nav>
    </header>
  );
};

export default Header;