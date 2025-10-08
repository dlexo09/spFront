import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';

// Crear el contexto
export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  // Estados para gestionar pedidos
  const [currentOrder, setCurrentOrder] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Acceder al contexto de autenticación
  const { user } = useContext(AuthContext);
  
  // Efecto para cargar pedidos del usuario cuando inicia sesión
  useEffect(() => {
    if (user) {
      fetchUserOrders();
    } else {
      setUserOrders([]);
    }
  }, [user]);
  
  // Crear un nuevo pedido
  const createOrder = async (orderData) => {
    if (!user) {
      setError('Debes iniciar sesión para crear un pedido');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          items: orderData.items || [],
          subtotal: orderData.subtotal || 0,
          tax: orderData.tax || 0,
          shipping: orderData.shipping || 0,
          discount: orderData.discount || 0,
          total: orderData.total || 0,
          notes: orderData.notes || '',
          shipping_address: {
            name: user.name,
            address: orderData.address || user.address || '',
            city: orderData.city || user.city || '',
            state: orderData.state || user.state || '',
            zip_code: orderData.zipCode || user.zipCode || '',
            phone: orderData.phone || user.phone || ''
          }
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear el pedido');
      }
      
      // Actualizar el estado con el pedido creado
      setCurrentOrder(data.order);
      setUserOrders(prev => [...prev, data.order]);
      
      console.log('Pedido creado:', data.order);
      return data.order;
    } catch (err) {
      setError('Error al crear el pedido: ' + err.message);
      console.error('Error al crear pedido:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Obtener todos los pedidos del usuario
  const fetchUserOrders = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener pedidos');
      }
      
      setUserOrders(data.orders || []);
      return data.orders;
    } catch (err) {
      setError('Error al obtener pedidos: ' + err.message);
      console.error('Error al obtener pedidos:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Obtener un pedido específico por ID
  const getOrderById = async (orderId) => {
    if (!user) {
      setError('Debes iniciar sesión para ver detalles del pedido');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener el pedido');
      }
      
      return data.order;
    } catch (err) {
      setError('Error al obtener el pedido: ' + err.message);
      console.error('Error al obtener el pedido:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Actualizar el estado de un pedido
  const updateOrderStatus = async (orderId, newStatus) => {
    if (!user) {
      setError('Debes iniciar sesión para actualizar el pedido');
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el pedido');
      }
      
      // Actualizar el estado en la aplicación
      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder({
          ...currentOrder,
          status: newStatus,
          updated_at: new Date().toISOString()
        });
      }
      
      // Actualizar la lista de pedidos del usuario
      setUserOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus, updated_at: new Date().toISOString() } 
            : order
        )
      );
      
      return { success: true, order: data.order };
    } catch (err) {
      setError('Error al actualizar el pedido: ' + err.message);
      console.error('Error al actualizar el pedido:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Procesar un pago para un pedido
  const processPayment = async (orderId, paymentData) => {
    if (!user) {
      setError('Debes iniciar sesión para procesar el pago');
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          order_id: orderId,
          payment_method: paymentData.method,
          amount: paymentData.amount,
          status: paymentData.status || 'pending',
          transaction_id: paymentData.transactionId || null,
          metadata: paymentData.metadata || {}
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al procesar el pago');
      }
      
      // Si el pago fue exitoso, actualizar el estado del pedido
      if (data.payment && data.order) {
        // Actualizar el pedido actual si corresponde
        if (currentOrder && currentOrder.id === orderId) {
          setCurrentOrder(data.order);
        }
        
        // Actualizar la lista de pedidos
        setUserOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? data.order : order
          )
        );
      }
      
      return { success: true, payment: data.payment, order: data.order };
    } catch (err) {
      setError('Error al procesar el pago: ' + err.message);
      console.error('Error al procesar el pago:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Procesar pago con transferencia bancaria (incluye subir comprobante)
  const processTransferPayment = async (orderId, comprobante, notes) => {
    if (!user) {
      setError('Debes iniciar sesión para procesar el pago');
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    if (!comprobante) {
      setError('Debes proporcionar un comprobante de pago');
      return { success: false, error: 'Comprobante no proporcionado' };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Crear un FormData para enviar el archivo
      const formData = new FormData();
      formData.append('comprobante', comprobante);
      formData.append('order_id', orderId);
      if (notes) formData.append('notes', notes);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/transferencia`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al procesar el pago');
      }
      
      // Actualizar estado del pedido si la respuesta incluye el pedido actualizado
      if (data.order) {
        if (currentOrder && currentOrder.id === orderId) {
          setCurrentOrder(data.order);
        }
        
        setUserOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? data.order : order
          )
        );
      }
      
      return { success: true, payment: data.payment, order: data.order };
    } catch (err) {
      setError('Error al procesar el pago: ' + err.message);
      console.error('Error al procesar el pago por transferencia:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Crear una preferencia de pago en MercadoPago
  const createMercadoPagoPreference = async (orderId) => {
    if (!user) {
      setError('Debes iniciar sesión para procesar el pago');
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/mercadopago/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ order_id: orderId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear preferencia de pago');
      }
      
      return { success: true, preferenceId: data.preference_id, initPoint: data.init_point };
    } catch (err) {
      setError('Error al crear preferencia de pago: ' + err.message);
      console.error('Error al crear preferencia MercadoPago:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Restablecer el pedido actual (por ejemplo, después de completar el pago)
  const resetCurrentOrder = () => {
    setCurrentOrder(null);
  };
  
  // Exportar el contexto con sus valores y funciones
  return (
    <OrderContext.Provider 
      value={{
        // Estados
        currentOrder,
        userOrders,
        isLoading,
        error,
        
        // Funciones
        createOrder,
        fetchUserOrders,
        getOrderById,
        updateOrderStatus,
        processPayment,
        processTransferPayment,
        createMercadoPagoPreference,
        resetCurrentOrder,
        
        // Setters directos (usar con precaución)
        setCurrentOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// Hook personalizado para facilitar el uso del contexto
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder debe ser usado dentro de un OrderProvider');
  }
  return context;
};