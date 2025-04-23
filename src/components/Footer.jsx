import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faLinkedin, faYoutube } from "@fortawesome/free-brands-svg-icons";
import "./Footer.css"; // Archivo CSS para estilos personalizados

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Información de contacto */}
                <div className="footer-section">
                    <h3 className="footer-title">Contáctanos</h3>
                    <p>Teléfono: (81) 8040-7221</p>
                    <p>Correo: ventas@siscoprint.com</p>
                    <p>Dirección: Mirto #2623, Col. Moderna, Monterrey, N.L.</p>
                </div>

                {/* Enlaces rápidos
                <div className="footer-section">
                    <h3 className="footer-title">Enlaces rápidos</h3>
                    <ul className="footer-links">
                        <li><a href="/productos">Productos</a></li>
                        <li><a href="/contacto">Contacto</a></li>
                        <li><a href="/nosotros">Nosotros</a></li>
                        <li><a href="/faq">Preguntas frecuentes</a></li>
                    </ul>
                </div> */}

                {/* Imagen pequeña */}
                <div className="footer-section">
                    <h3 className="footer-title">Nuestra Marca</h3>
                    <img
                        src="/img/logoSiscom.png" // Cambia esta ruta según la ubicación de tu imagen
                        alt="Logo Siscoprint"
                        className="footer-image"
                    />
                </div>

                {/* Redes sociales */}
                <div className="footer-section">
                    <h3 className="footer-title">Síguenos</h3>
                    <div className="footer-socials">
                        <a href="https://www.facebook.com/siscoprint" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                        {/* <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faTwitter} />
                        </a> */}
                        <a href="https://www.instagram.com/siscoprint/" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="https://www.youtube.com/@siscoprint9949" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faYoutube} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="footer-bottom">
                <p>&copy; 2025 Siscoprint. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;