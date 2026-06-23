import { Link } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from '../context/AuthContext';
import CartIcon from "./CartIcon";
import { gsap, ScrollTrigger, allowsMotion } from '../lib/gsap';
import './Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!allowsMotion() || !headerRef.current) {
      return undefined;
    }

    const header = headerRef.current;
    const ctx = gsap.context(() => {
      gsap.from('[data-header-item]', {
        y: -18,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.06,
        delay: 0.15,
      });

      const compactTween = gsap.to(header, {
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)',
        backdropFilter: 'blur(18px)',
        borderColor: 'rgba(14, 116, 144, 0.12)',
        duration: 0.3,
        ease: 'power2.out',
        paused: true,
      });

      ScrollTrigger.create({
        start: 36,
        end: 'max',
        onUpdate: (self) => {
          header.classList.toggle('is-scrolled', self.scroll() > 36);

          if (self.scroll() > 36) {
            compactTween.play();
          } else {
            compactTween.reverse();
          }
        },
      });
    }, header);

    return () => ctx.revert();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header ref={headerRef} className="header">
      <Link to="/" data-header-item>
        <img src="/img/logoSiscoprint.png" alt="Siscoprint Logo" className="logo h-full" />
      </Link>
      
      <div className="header-right">
        <nav className={`nav ${isOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link" data-header-item>Inicio</Link>
          <Link to="/about" className="nav-link" data-header-item>Nosotros</Link>
          <Link to="/productos" className="nav-link" data-header-item>Productos</Link>
          <Link to="/consumibles" className="nav-link" data-header-item>Consumibles</Link>
          <Link to="/contacto" className="nav-link" data-header-item>Contacto</Link>
        </nav>
        
        {user ? (
          <div className="flex items-center gap-2" data-header-item>
            <Link to="/cuenta" className="nav-link flex items-center" title="Mi cuenta">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span className="hidden md:inline">{user.name ? user.name.split(' ')[0] : 'Cuenta'}</span>
            </Link>
          </div>
        ) : (
          <Link to="/login" className="nav-link login-link" data-header-item>
            Iniciar sesión
          </Link>
        )}

        <div data-header-item>
          <CartIcon />
        </div>
      </div>

      <button className="menu-button" onClick={toggleMenu} data-header-item>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
    </header>
  );
};

export default Header;