import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getConsumibles } from '../services/productosService';
import AddToCartButton from '../components/AddToCartButton';
import { withConsumablesDisplayPrice } from '../utils/priceUtils';
import './Consumibles.css';

const Consumibles = () => {
  const [consumibles, setConsumibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [tiposDisponibles, setTiposDisponibles] = useState([]);

  const BASE_IMG = "https://www.siscoprint.com/img/consumibles/";
  const LIMITE = 12;

  // Cargar tipos únicos para filtro
  useEffect(() => {
    const cargarTipos = async () => {
      try {
        const response = await fetch('https://www.siscoprint.com/api/consumibles-tipos.php');
        const tipos = await response.json();
        setTiposDisponibles(tipos || []);
      } catch (error) {
        console.error('Error cargando tipos:', error);
        // Si falla, usamos valores predeterminados
        setTiposDisponibles(['Tinta', 'Papel', 'Kit', 'Repuesto']);
      }
    };
    cargarTipos();
  }, []);

  // Cargar consumibles según filtros y página
  useEffect(() => {
    const cargarConsumibles = async () => {
      setLoading(true);
      try {
        const data = await getConsumibles({
          page,
          limit: LIMITE,
          tipo: filtroTipo,
          search: busqueda
        });
        setConsumibles(data.consumibles || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (error) {
        console.error('Error cargando consumibles:', error);
        setConsumibles([]);
      } finally {
        setLoading(false);
      }
    };

    cargarConsumibles();
  }, [page, filtroTipo, busqueda]);

  // Reset a página 1 cuando cambia filtro o búsqueda
  const handleFiltroTipo = (tipo) => {
    setFiltroTipo(tipo);
    setPage(1);
  };

  const handleBusqueda = (valor) => {
    setBusqueda(valor);
    setPage(1);
  };

  return (
    <div className="consumables-page">
      <section className="consumables-hero">
        <div className="consumables-hero__bg" aria-hidden="true">
          <div className="consumables-hero__orb consumables-hero__orb--blue" />
          <div className="consumables-hero__orb consumables-hero__orb--gold" />
          <div className="consumables-hero__grid" />
        </div>
        <div className="consumables-shell consumables-hero__content">
          <span className="consumables-hero__eyebrow">Linea comercial</span>
          <h1 className="consumables-hero__title">Consumibles y accesorios</h1>
          <p className="consumables-hero__copy">Tintas, papeles, kits y repuestos para tu equipo de impresión.</p>
        </div>
      </section>

      <section className="consumables-shell consumables-catalog-shell">
        <div className="consumables-panel">
          <div className="consumables-panel__top">
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={busqueda}
              onChange={(e) => handleBusqueda(e.target.value)}
              className="consumables-search"
            />
            <span className="consumables-count">{loading ? 'Cargando...' : `${consumibles.length} resultados en esta página`}</span>
          </div>

          <div>
            <h3 className="consumables-panel__label">Tipo de consumible</h3>
            <div className="consumables-chips">
              <button
                onClick={() => handleFiltroTipo('')}
                className={`consumables-chip ${filtroTipo === '' ? 'is-active' : ''}`}
              >
                Todos
              </button>
              {tiposDisponibles.map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => handleFiltroTipo(tipo)}
                  className={`consumables-chip ${filtroTipo === tipo ? 'is-active' : ''}`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="consumables-loader-wrap">
            <div className="consumables-loader" />
          </div>
        ) : consumibles.length === 0 ? (
          <div className="consumables-empty">
            <p>No se encontraron consumibles con los filtros aplicados.</p>
          </div>
        ) : (
          <>
            <div className="consumables-grid">
              {consumibles.map((consumible) => (
                <div
                  key={consumible.sku}
                  className="consumables-card"
                >
                  {(() => {
                    const hasPrice = Number(consumible.precio) > 0;
                    const canBuyOnline = String(consumible.disponible).toUpperCase() === 'TRUE';

                    return (
                      <>
                  <div className="consumables-card__image-wrap">
                    {consumible.imagen ? (
                      <img
                        src={`${BASE_IMG}${consumible.imagen}`}
                        alt={consumible.nombre}
                        className="consumables-card__image"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/img/noDisponible.jpg"; }}
                      />
                    ) : (
                      <div className="consumables-card__image consumables-card__image--placeholder" aria-hidden="true" />
                    )}
                  </div>

                  <span className="consumables-card__badge">
                    {consumible.tipo}
                  </span>

                  <p className="consumables-card__title">
                    {consumible.nombre}
                  </p>

                  <p className="consumables-card__sku">SKU: {consumible.sku}</p>

                  {hasPrice ? (
                    <div className="consumables-card__price-wrap">
                      <p className="consumables-card__price">
                        ${withConsumablesDisplayPrice(Number(consumible.precio)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  ) : (
                    <div className="consumables-card__price-wrap">
                      <p className="consumables-card__ask">Precio a consultar</p>
                    </div>
                  )}

                  {canBuyOnline && hasPrice && (
                    <AddToCartButton
                      product={{
                        sku: consumible.sku,
                        name: consumible.nombre,
                        precio: Number(consumible.precio),
                        image: consumible.imagen ? `${BASE_IMG}${consumible.imagen}` : "/img/noDisponible.jpg",
                        description: consumible.descripcion || consumible.nombre,
                        marca: 'Consumible',
                        categoria: consumible.tipo,
                        disponible: 'TRUE'
                      }}
                      className="w-full text-xs py-1.5 mt-1"
                    />
                  )}
                  {!canBuyOnline && hasPrice && (
                    <Link
                      to={`/cotizacion?sku=${consumible.sku}&nombre=${encodeURIComponent(consumible.nombre)}&imagen=${encodeURIComponent(consumible.imagen ? `${BASE_IMG}${consumible.imagen}` : '/img/noDisponible.jpg')}`}
                      className="w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100"
                    >
                      Solicitar cotizacion
                    </Link>
                  )}
                      </>
                    );
                  })()}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="consumables-pagination">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="consumables-pagination__btn"
                >
                  Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`consumables-pagination__btn ${page === p ? 'is-active' : ''}`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="consumables-pagination__btn"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Consumibles;
