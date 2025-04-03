import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importar useLocation
import './AboutContent.css'; // Importar el archivo CSS personalizado

const AboutContent = () => {
  const location = useLocation(); // Obtener la ubicación actual

  return (
    <section className="about-section-component">
      <div className="about-content-component">
        <h1 className="about-title-component">Donde la creatividad se encuentra con la tecnología</h1>
        <p className="about-text-component text-justify">
        Potenciamos la creatividad con soluciones de impresión innovadoras. Ya sea en papel, textil o etiquetas, nuestra tecnología convierte tus ideas en realidad.
        </p>
        
        {/* Mostrar el botón solo si no estás en la página /about */}
        {location.pathname !== '/about' && (
          <Link to="/about" className="about-button-component">Descubre siscoprint</Link>
        )}
         <Link to="/productos" className="about-button-component">Ver productos</Link>
      </div>
      <div className="about-image-container-component">
        <img src="/img/about.png" alt="About Us" className="about-image-component" />
      </div>
    </section>
  );
};

export default AboutContent;