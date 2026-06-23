import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCatalog from "../components/ProductCatalog";
import './Productos.css'; // Importar el archivo CSS

const featuredFamilies = ["Sublimación", "DTG", "Eco-solvente", "UV"];
const valuePoints = [
  "Filtros por familia, marca y categoría",
  "Cotizacion asistida en todos los equipos (temporal)",
  "Cobertura comercial y soporte técnico en México",
];

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  
  // Leer filtros iniciales desde la URL (?familia=X&marca=Y, etc.)
  const initialFilters = {
    familia: searchParams.get('familia') || '',
    marca: searchParams.get('marca') || '',
    categoria: searchParams.get('categoria') || '',
    subcategoria: searchParams.get('subcategoria') || '',
    search: searchParams.get('search') || '',
  };

  return (
    <div className="products-page">
      <section className="products-hero">
        <div className="products-hero__bg" aria-hidden="true">
          <div className="products-hero__orb products-hero__orb--blue" />
          <div className="products-hero__orb products-hero__orb--gold" />
          <div className="products-hero__grid" />
        </div>

        <div className="products-shell products-hero__content">
          <span className="products-hero__eyebrow">Catalogo comercial</span>
          <h1 className="products-hero__title">
            Equipos y soluciones para imprimir mejor, operar con respaldo y crecer con criterio.
          </h1>
          <p className="products-hero__copy">
            Explora impresoras, tecnologias y categorias con cotizacion asistida. Usa los filtros para encontrar rapido la opcion que mejor se adapta a tu negocio.
          </p>

          <div className="products-hero__actions">
            <a href="#catalogo-productos" className="products-hero__button products-hero__button--primary">
              Explorar catalogo
            </a>
            <Link to="/contacto" className="products-hero__button products-hero__button--secondary">
              Hablar con un asesor
            </Link>
          </div>

          <div className="products-hero__chips" aria-label="Familias destacadas">
            {featuredFamilies.map((family) => (
              <a
                key={family}
                href={`/productos?familia=${encodeURIComponent(family)}`}
                className="products-hero__chip"
              >
                {family}
              </a>
            ))}
          </div>

          <div className="products-hero__points">
            {valuePoints.map((point) => (
              <span key={point} className="products-hero__point">
                <span className="products-hero__point-dot" aria-hidden="true" />
                {point}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="catalogo-productos" className="products-shell products-catalog-shell">
        <ProductCatalog initialFilters={initialFilters} />
      </section>
    </div>
  );
};

export default ProductPage;