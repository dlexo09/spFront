export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold text-slate-900">Contacto</h1>
      <p className="mt-4 text-slate-700">
        Te ayudamos a elegir equipos, consumibles y flujo de produccion para tu negocio.
      </p>
      <ul className="mt-6 list-disc pl-6 text-slate-700">
        <li>Asesoria comercial</li>
        <li>Soporte preventa y postventa</li>
        <li>Cotizaciones personalizadas</li>
      </ul>
      <a className="mt-8 inline-block rounded-lg bg-slate-900 px-5 py-3 font-medium text-white" href="/cotizacion/">
        Solicitar cotizacion
      </a>
    </main>
  )
}
