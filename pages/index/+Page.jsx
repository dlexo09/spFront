export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold text-slate-900">Siscoprint</h1>
      <p className="mt-4 text-lg text-slate-700">
        Soluciones de impresion, corte y tecnologia para negocios en Mexico.
      </p>
      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <a className="rounded-xl border border-slate-200 p-5 hover:border-slate-400" href="/productos/">
          Ver catalogo de productos
        </a>
        <a className="rounded-xl border border-slate-200 p-5 hover:border-slate-400" href="/contacto/">
          Contactar a ventas
        </a>
      </section>
    </main>
  )
}
