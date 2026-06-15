export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold text-slate-900">Quienes Somos</h1>
      <p className="mt-4 text-slate-700">
        Siscoprint integra equipos, insumos y acompanamiento tecnico para empresas de impresion y produccion visual.
      </p>
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">Especializacion</h2>
          <p className="mt-2 text-sm text-slate-700">Plotters, UV, gran formato y consumibles.</p>
        </article>
        <article className="rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">Cobertura</h2>
          <p className="mt-2 text-sm text-slate-700">Atencion nacional para clientes B2B y retail tecnico.</p>
        </article>
        <article className="rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">Servicio</h2>
          <p className="mt-2 text-sm text-slate-700">Acompanamiento comercial y tecnico durante todo el ciclo.</p>
        </article>
      </section>
    </main>
  )
}
