export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold text-slate-900">Catalogo de productos</h1>
      <p className="mt-4 text-slate-700">
        Este listado sirve como punto de entrada indexable. Cada detalle se renderiza en SSR en
        /productos/:slug para buscadores y motores AEO.
      </p>
      <ul className="mt-8 list-disc pl-6 text-slate-700">
        <li>
          Ejemplo de detalle SSR: <a className="text-blue-700 underline" href="/productos/1">/productos/1</a>
        </li>
        <li>
          Ejemplo por SKU SSR: <a className="text-blue-700 underline" href="/productos/demo-sku">/productos/demo-sku</a>
        </li>
      </ul>
    </main>
  )
}
