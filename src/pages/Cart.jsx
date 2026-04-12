import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const itemsWithPrice = cartItems.filter(item => item.price && item.price > 0);
  const itemsWithoutPrice = cartItems.filter(item => !item.price || item.price <= 0);
  const totalUnits = getTotalItems();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f8f6ef_0%,#ffffff_34%,#ffffff_100%)] pt-[132px] pb-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center">
          <span className="inline-flex rounded-full border border-sky-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-[0_14px_32px_rgba(15,23,42,0.06)]">
            Carrito
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.03em] text-slate-900 md:text-5xl">
            Tu carrito esta vacio
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            Cuando agregues productos para compra o cotizacion apareceran aqui. Puedes volver al catalogo y seguir explorando soluciones para tu negocio.
          </p>
          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/productos"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-7 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors duration-300 hover:bg-strong-blue"
            >
              Ver productos
            </Link>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-700 shadow-[0_14px_30px_rgba(15,23,42,0.05)] transition-colors duration-300 hover:border-sky-200 hover:text-sky-700"
            >
              Hablar con un asesor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8f6ef_0%,#ffffff_28%,#ffffff_100%)] pt-[128px] pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <section className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/70 px-6 py-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-sm md:px-10 md:py-10">
          <div className="absolute -left-10 top-0 h-44 w-44 rounded-full bg-sky-200/35 blur-3xl" aria-hidden="true" />
          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-amber-200/35 blur-3xl" aria-hidden="true" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-sky-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-[0_14px_32px_rgba(15,23,42,0.06)]">
                Resumen de compra
              </span>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-slate-900 md:text-5xl">
                Tu carrito, listo para compra o cotizacion.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                Revisa cantidades, continua al pago en productos disponibles o envia los equipos sin precio a cotizacion con acompanamiento comercial.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
              <div className="rounded-[24px] border border-slate-100 bg-white/88 p-4 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Unidades</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{totalUnits}</p>
              </div>
              <div className="rounded-[24px] border border-emerald-100 bg-emerald-50/80 p-4 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">Compra directa</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-700">{itemsWithPrice.reduce((total, item) => total + item.quantity, 0)}</p>
              </div>
              <div className="rounded-[24px] border border-amber-100 bg-amber-50/85 p-4 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600">Cotizacion</p>
                <p className="mt-2 text-3xl font-semibold text-amber-700">{itemsWithoutPrice.reduce((total, item) => total + item.quantity, 0)}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">Productos agregados</h2>
              <Link to="/productos" className="text-sm font-semibold text-sky-700 transition-colors hover:text-strong-blue">
                Seguir explorando
              </Link>
            </div>

            <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.sku} className="rounded-[28px] border border-slate-100 bg-white p-4 shadow-[0_18px_44px_rgba(15,23,42,0.06)] md:p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 rounded-2xl border border-slate-100 bg-[linear-gradient(180deg,#f8fbff_0%,#eef3f8_100%)] p-2 object-contain"
                    onError={(e) => (e.target.src = '/img/noDisponible.jpg')}
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${item.price > 0 ? 'border border-emerald-100 bg-emerald-50 text-emerald-700' : 'border border-amber-100 bg-amber-50 text-amber-700'}`}>
                        {item.price > 0 ? 'Compra directa' : 'Cotizacion'}
                      </span>
                      {item.categoria ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          {item.categoria}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mt-3 text-lg font-semibold text-slate-900 md:text-xl">{item.name}</h3>
                    <p className="mt-1 text-sm font-mono uppercase tracking-[0.16em] text-slate-400">SKU: {item.sku}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.marca}</p>
                    
                    {item.price > 0 ? (
                      <p className="mt-3 text-2xl font-bold text-emerald-600">
                        ${item.price.toLocaleString('es-MX')}
                      </p>
                    ) : (
                      <p className="mt-3 text-sm font-semibold text-amber-600">Este producto se enviara por cotizacion.</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start rounded-full border border-slate-200 bg-slate-50 p-1 md:self-center">
                    <button
                      onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold text-slate-600 transition-colors hover:bg-white"
                    >
                      -
                    </button>
                    <span className="min-w-[44px] text-center text-base font-semibold text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold text-slate-600 transition-colors hover:bg-white"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.sku)}
                    className="inline-flex items-center justify-center self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:border-red-100 hover:text-red-600 md:self-center"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:sticky lg:top-[118px]">
            <h2 className="text-2xl font-semibold text-slate-900">Resumen del carrito</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Divide automaticamente los productos listos para pago y los que requieren cotizacion.
            </p>
          
            {itemsWithPrice.length > 0 && (
              <div className="mt-6 rounded-[24px] border border-emerald-100 bg-emerald-50/70 p-5">
                <h3 className="text-lg font-bold text-emerald-700">Para compra</h3>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Productos:</span>
                  <span>{itemsWithPrice.reduce((total, item) => total + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900">
                  <span>Total:</span>
                  <span>${getTotalPrice().toLocaleString('es-MX')}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="mt-4 w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Proceder al pago
              </button>
            </div>
          )}

            {itemsWithoutPrice.length > 0 && (
              <div className="mt-4 rounded-[24px] border border-amber-100 bg-amber-50/75 p-5">
                <h3 className="text-lg font-bold text-amber-700">Para cotizacion</h3>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Productos:</span>
                  <span>{itemsWithoutPrice.reduce((total, item) => total + item.quantity, 0)}</span>
                </div>
              </div>
              
              <Link
                to="/cotizacion"
                className="mt-4 block w-full rounded-2xl bg-amber-500 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-amber-600"
              >
                Solicitar cotización
              </Link>
            </div>
          )}

            <button 
              onClick={() => clearCart()}
              className="mt-5 w-full rounded-2xl border border-slate-200 bg-slate-100 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;