import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faLinkedin, faYoutube } from "@fortawesome/free-brands-svg-icons";
import "./Footer.css"; // Archivo CSS para estilos personalizados

const Footer = () => {
    return (
    <footer className="footer footer-with-bg">
            <div className="footer-container text-white">
                {/* Left: Logo + tagline */}
                <div className="flex-1 min-w-[250px] mb-5 footer-left">
                    <img
                        src="/img/logoSiscom.png"
                        alt="Logo Siscoprint"
                        className="w-[200px] mt-0 rounded-md"
                    />
                    <p className="mt-3 text-base">Potenciamos la creatividad<br/>con soluciones de impresión innovadoras</p>
                </div>

                {/* Center: Contacto */}
                                <div className="footer-section footer-center">
                                        <h3 className="text-xl mb-4">CONTACTO</h3>
                                        <ul className="footer-links text-base">
                                            <li>Mirto #2623, Col. Moderna, Monterrey, N.L.</li>
                                            <li>ventas@siscoprint.com</li>
                                            <li>Teléfono: (81) 8040-7221</li>
                                        </ul>
                                </div>

                {/* Right: Socials */}
                <div className="footer-section footer-right">
                    <h3 className="text-xl mb-4">SÍGUENOS</h3>
                    <div className="flex items-center footer-socials">
                        <a href="https://www.facebook.com/siscoprint" target="_blank" rel="noopener noreferrer" className="mr-4 text-2xl hover:text-[#ffcc00]">
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                        <a href="https://www.instagram.com/siscoprint/" target="_blank" rel="noopener noreferrer" className="mr-4 text-2xl hover:text-[#ffcc00]">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="https://www.youtube.com/@siscoprint9949" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-[#ffcc00]">
                            <FontAwesomeIcon icon={faYoutube} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Separator line matching image */}
            <div className="footer-separator" aria-hidden="true" />

            {/* Copyright */}
            <div className="mt-6 footer-bottom uppercase text-center text-white font-light text-xs">
                <p>&copy; 2025 Siscoprint. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;