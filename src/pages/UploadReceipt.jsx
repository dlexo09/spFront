import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_SIZE_MB = 10;

const UploadReceipt = () => {
  const { orderId } = useParams();
  const { getOrderById, uploadReceipt, isLoading } = useOrder();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) return;
      const data = await getOrderById(orderId);
      if (data) {
        setOrder(data);
      } else {
        setError('No se encontró la orden.');
      }
      setLoadingOrder(false);
    };
    loadOrder();
  }, [orderId]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError('Formato no válido. Usa JPG, PNG, WEBP o PDF.');
      return;
    }

    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`El archivo no debe exceder ${MAX_SIZE_MB} MB.`);
      return;
    }

    setError('');
    setFile(selected);

    if (selected.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Selecciona un archivo primero.');
      return;
    }

    const result = await uploadReceipt(orderId, file, notes);
    if (result) {
      setSuccess(true);
    }
  };

  if (loadingOrder) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-strong-blue border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Cargando orden...</p>
      </div>
    );
  }

  if (!order && !loadingOrder) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{error || 'Orden no encontrada'}</p>
        <Link to="/" className="text-strong-blue hover:underline">Volver al inicio</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">¡Comprobante enviado!</h2>
        <p className="text-gray-600 mb-6">Estamos verificando tu pago. Te notificaremos a <strong>{order.customer_email}</strong> cuando sea confirmado.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate(`/orden/${order.folio}`)} className="bg-strong-blue hover:bg-blue-800 text-white px-6 py-3 rounded-md font-medium transition-colors">
            Ver mi pedido
          </button>
          <Link to="/productos" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium transition-colors">
            Seguir comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <button onClick={() => navigate(`/orden/${order.folio}`)} className="text-strong-blue hover:underline text-sm mb-4 inline-block">
        ← Volver al pedido
      </button>

      <h1 className="text-2xl font-bold mb-2">Subir comprobante de pago</h1>
      <p className="text-gray-600 mb-6">
        Folio: <span className="font-mono font-bold text-strong-blue">{order.folio}</span> · Total: <span className="font-bold">${order.total?.toLocaleString('es-MX')} MXN</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drop zone */}
        <div className="relative">
          <label
            htmlFor="receipt-file"
            className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-strong-blue hover:bg-blue-50'
            }`}
          >
            {!file ? (
              <>
                <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="font-medium text-gray-700">Arrastra tu comprobante aquí o haz clic para seleccionar</p>
                <p className="text-sm text-gray-500 mt-1">JPG, PNG, WEBP o PDF · máximo {MAX_SIZE_MB} MB</p>
              </>
            ) : (
              <div className="space-y-2">
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-md" />
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium text-green-700">{file.name}</span>
                  </div>
                )}
                <p className="text-sm text-green-600 font-medium">Archivo seleccionado: {file.name}</p>
                <p className="text-xs text-gray-500">Haz clic para cambiar</p>
              </div>
            )}
          </label>
          <input
            id="receipt-file"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={handleFileChange}
            className="sr-only"
          />
        </div>

        {/* Notas */}
        <div>
          <label htmlFor="receipt-notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notas adicionales (opcional)
          </label>
          <textarea
            id="receipt-notes"
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Transferencia realizada el día 15 a las 3pm"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!file || isLoading}
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
            !file || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-strong-blue hover:bg-blue-800'
          }`}
        >
          {isLoading ? 'Subiendo comprobante...' : 'Enviar comprobante'}
        </button>
      </form>
    </div>
  );
};

export default UploadReceipt;
