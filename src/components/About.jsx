import React from 'react';
import { Link } from 'react-router-dom';
import './About.css'; // Importar el archivo CSS personalizado

const About = () => {
  return (
    <section className="about-section">
      <div className="about-content">
        <h1 className="about-title">Impresión que inspira</h1>
        <p className="about-text">
          En Siscoprint, transformamos tus ideas en realidad con equipos de impresión de vanguardia. Desde gran formato hasta soluciones especializadas, estamos aquí para impulsar tu creatividad y negocio.
        </p>
        <Link to="/about" className="about-button">Saber más</Link>
      </div>
      <div className="about-image-container">
        <img src="/img/about.png" alt="About Us" className="about-image" />
      </div>
    </section>
  );
};

export default About;