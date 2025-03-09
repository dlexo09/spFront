import { Link } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white text-blue-900 p-4 flex justify-between items-center h-20 relative">
      <img src="/src/assets/img/logoSiscom.png" alt="Siscoprint Logo" className="h-full" />
      <button className="md:hidden" onClick={toggleMenu}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
      <nav className={`h-full md:flex md:flex-row flex-col items-center ${isOpen ? "flex" : "hidden"} md:static absolute top-0 left-0 w-full bg-white bg-opacity-100 md:bg-transparent md:w-auto md:flex md:items-center z-50 shadow-md`}>
        <Link to="/" className="mx-2 py-2 px-4 text-lg hover:text-blue-700">Inicio</Link>
        <Link to="/productos" className="mx-2 py-2 px-4 text-lg hover:text-blue-700">Productos</Link>
        <Link to="/servicios" className="mx-2 py-2 px-4 text-lg hover:text-blue-700">Servicios</Link>
        <Link to="/contacto" className="mx-2 py-2 px-4 text-lg hover:text-blue-700">Contacto</Link>
      </nav>
    </header>
  );
};

export default Header;
