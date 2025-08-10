import React, { useState } from 'react';

const ShippingCalculator = ({ cartItems, onShippingCostCalculated }) => {
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateShipping = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/shipping-cost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zipCode,
          items: cartItems.map(item => ({
            sku: item.sku,
            quantity: item.quantity,
            weight: item.weight || 1, // Peso en kg
            dimensions: item.dimensions || { length: 10, width: 10, height: 10 } // cm
          }))
        })
      });

      const data = await response.json();
      onShippingCostCalculated(data.cost);
    } catch (error) {
      console.error('Error calculando envío:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-bold mb-3">Calcular costo de envío</h3>
      <div className="flex space-x-2">
        <input
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="Código postal"
          className="flex-1 px-3 py-2 border rounded"
          pattern="[0-9]{5}"
        />
        <button
          onClick={calculateShipping}
          disabled={loading || zipCode.length !== 5}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Calculando...' : 'Calcular'}
        </button>
      </div>
    </div>
  );
};

export default ShippingCalculator;