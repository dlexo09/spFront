import { useData } from 'vike-react/useData'

function formatCurrency(value) {
  if (!Number.isFinite(Number(value))) return null
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(value))
}

export default function Page() {
  const { product, slug, missingConfig } = useData()

  if (missingConfig) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900">Configuracion pendiente</h1>
        <p className="mt-4 text-slate-700">
          Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para habilitar el SSR de productos.
        </p>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900">Producto no encontrado</h1>
        <p className="mt-4 text-slate-700">No hay resultados para: {slug}</p>
      </main>
    )
  }

  const price = formatCurrency(product.precio_oferta || product.precio)

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm uppercase tracking-wide text-slate-500">SKU: {product.sku || 'N/A'}</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-900">{product.nombre}</h1>
      {!!product.marca && <p className="mt-2 text-slate-700">Marca: {product.marca}</p>}
      {!!product.pn && <p className="text-slate-700">PN: {product.pn}</p>}
      {price && <p className="mt-5 text-3xl font-semibold text-emerald-700">{price}</p>}
      <article className="prose mt-8 max-w-none text-slate-800">
        {product.descripcionLarga || product.descripcionCorta || 'Sin descripcion disponible.'}
      </article>
      <a className="mt-10 inline-block rounded-lg bg-slate-900 px-5 py-3 font-medium text-white" href="/contacto/">
        Solicitar informacion
      </a>
    </main>
  )
}
