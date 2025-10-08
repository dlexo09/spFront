import React, { useEffect, useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';

const OrderTester = () => {
  const { 
    createOrder, 
    fetchUserOrders, 
    userOrders, 
    isLoading, 
    error, 
    currentOrder,
    processTransferPayment,
    createMercadoPagoPreference
  } = useOrder();
  
  // Usar cartItems directamente para mantener consistencia con Cart.jsx
  const { cartItems, calculateTotal } = useCart();
  const [testFile, setTestFile] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [testOperation, setTestOperation] = useState('');
  
  useEffect(() => {
    // Cargar pedidos al montar el componente
    fetchUserOrders();
  }, [fetchUserOrders]);
  
  // Prueba 1: Crear un pedido con los productos del carrito
  const testCreateOrder = async () => {
    setTestOperation('createOrder');
    setTestResult(null);
    
    try {
      // Verificar si hay productos en el carrito
      if (!cartItems || cartItems.length === 0) {
        setTestResult({ error: "El carrito está vacío. Agrega productos primero." });
        return;
      }
      
      const totals = calculateTotal();
      
      const orderData = {
        items: cartItems,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        notes: "Pedido de prueba desde OrderTester"
      };
      
      const result = await createOrder(orderData);
      setTestResult(result);
    } catch (err) {
      setTestResult({ error: err.message });
    }
  };
  
  // Prueba 2: Cargar pedidos del usuario
  const testFetchOrders = async () => {
    setTestOperation('fetchOrders');
    setTestResult(null);
    await fetchUserOrders();
    setTestResult(userOrders);
  };
  
  // Prueba 3: Simular pago por transferencia
  const testTransferPayment = async () => {
    setTestOperation('transferPayment');
    setTestResult(null);
    
    if (!currentOrder) {
      setTestResult({ error: "Debes crear un pedido primero" });
      return;
    }
    
    if (!testFile) {
      setTestResult({ error: "Selecciona un archivo de prueba" });
      return;
    }
    
    const result = await processTransferPayment(
      currentOrder.id,
      testFile,
      "Comprobante de prueba"
    );
    
    setTestResult(result);
  };
  
  // Prueba 4: Crear preferencia MercadoPago
  const testMercadoPago = async () => {
    setTestOperation('mercadoPago');
    setTestResult(null);
    
    if (!currentOrder) {
      setTestResult({ error: "Debes crear un pedido primero" });
      return;
    }
    
    const result = await createMercadoPagoPreference(currentOrder.id);
    setTestResult(result);
  };
  
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setTestFile(e.target.files[0]);
    }
  };
  
  // Comprobación segura para el carrito
  const hasItemsInCart = cartItems && cartItems.length > 0;
  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Prueba de OrderContext</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      
      {!hasItemsInCart && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 mb-4 rounded">
          <p><strong>Aviso:</strong> El carrito está vacío. Agrega productos al carrito para poder crear un pedido.</p>
          <a 
            href="/productos" 
            className="inline-block mt-2 bg-blue-600 text-white py-1 px-3 rounded text-sm"
          >
            Ir a productos
          </a>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 border rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Operaciones de prueba</h3>
          <div className="space-y-3">
            <button 
              onClick={testCreateOrder}
              disabled={isLoading || !hasItemsInCart}
              className={`w-full py-2 px-4 rounded ${
                isLoading || !hasItemsInCart ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Crear pedido con productos del carrito
            </button>
            
            <button 
              onClick={testFetchOrders}
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded ${
                isLoading ? 'bg-gray-300 text-gray-500' : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              Cargar mis pedidos
            </button>
            
            <div className="border-t pt-3">
              <p className="mb-2 font-medium">Pruebas de pago:</p>
              
              <input 
                type="file" 
                onChange={handleFileChange}
                className="mb-3 block w-full text-sm text-gray-500 file:mr-4 file:py-2 
                file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              
              <button 
                onClick={testTransferPayment}
                disabled={isLoading || !currentOrder}
                className={`w-full py-2 px-4 rounded mb-2 ${
                  isLoading || !currentOrder ? 'bg-gray-300 text-gray-500' : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
              >
                Simular pago por transferencia
              </button>
              
              <button 
                onClick={testMercadoPago}
                disabled={isLoading || !currentOrder}
                className={`w-full py-2 px-4 rounded ${
                  isLoading || !currentOrder ? 'bg-gray-300 text-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Generar link de MercadoPago
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4 border rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Resultado de prueba</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : testResult ? (
            <div className="overflow-auto max-h-80">
              <pre className="bg-gray-100 p-4 rounded text-xs">
                {JSON.stringify(testResult, null, 2)}
              </pre>
              
              {testOperation === 'mercadoPago' && testResult.success && (
                <div className="mt-4">
                  <a 
                    href={testResult.initPoint}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="bg-blue-600 text-white py-2 px-4 rounded block text-center"
                  >
                    Ir a pagar con MercadoPago
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-10">
              Ejecuta una operación para ver los resultados
            </div>
          )}
        </div>
      </div>
      
      <div className="border rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Mis pedidos ({userOrders.length})</h3>
        
        {userOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userOrders.map(order => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(order.date || order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ${order.total ? order.total.toLocaleString('es-MX') : '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${order.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                        ${order.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                        ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                        ${!order.status ? 'bg-gray-100 text-gray-800' : ''}
                      `}>
                        {order.status || 'desconocido'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No tienes pedidos todavía
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderTester;