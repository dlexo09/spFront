import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from '../context/AuthContext';
import CartIcon from "./CartIcon";
import './Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header">
      <img src="/img/logoSiscom.png" alt="Siscoprint Logo" className="logo h-full" />
      
      <div className="header-right">
        <nav className={`nav ${isOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/about" className="nav-link">Nosotros</Link>
          <Link to="/productos" className="nav-link">Productos</Link>
          <Link to="/contacto" className="nav-link">Contacto</Link>
        </nav>
        
        {user ? (
          <div className="flex items-center">
            <Link to="/cuenta" className="nav-link flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span className="hidden md:inline">{user.name.split(' ')[0]}</span>
            </Link>
          </div>
        ) : (
          <Link to="/login" className="nav-link login-link">
            Iniciar sesión
          </Link>
        )}

        <CartIcon />
      </div>

      <button className="menu-button" onClick={toggleMenu}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
    </header>
  );
};

export default Header;