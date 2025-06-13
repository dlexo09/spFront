import React, { useState } from "react";

const PASSWORD = "siscoprint2025"; // Cambia esto por la contraseña que quieras

const RecursosClientes = () => {
  const [input, setInput] = useState("");
  const [autorizado, setAutorizado] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === PASSWORD) {
      setAutorizado(true);
      setError("");
    } else {
      setError("Contraseña incorrecta.");
    }
  };

  if (!autorizado) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Recursos para clientes</h2>
          <input
            type="password"
            placeholder="Contraseña"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Acceder
          </button>
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </form>
      </div>
    );
  }

  // Contenido protegido con video local
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Recursos para clientes</h1>
      <p className="mb-4">Bienvenido. Aquí tienes acceso a tus recursos exclusivos.</p>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">DP2 Dispensing</h2>
        <video
          width="560"
          height="315"
          controls
          src="/video/DP2 Dispensing.mp4"
        >
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
      {/* Puedes agregar más recursos aquí */}
    </div>
  );
};

export default RecursosClientes;