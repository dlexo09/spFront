export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard interno</h1>
      <p className="mt-4 text-slate-700">
        Esta area se sirve en CSR y no esta destinada a indexacion de buscadores ni motores AEO.
      </p>
      <a className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-3 text-white" href="/cuenta/">
        Ir a cuenta
      </a>
    </main>
  )
}
