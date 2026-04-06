import React, { createContext, useState, useContext } from 'react';
import * as orderService from '../services/orderService';

// Crear el contexto
export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Crear una orden nueva en Supabase
  const createOrder = async ({ customer, items, totals, notes, userId }) => {
    setIsLoading(true);
    setError(null);
    try {
      const order = await orderService.createOrder({ customer, items, totals, notes, userId });
      setCurrentOrder(order);
      return order;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar orden por folio
  const getOrderByFolio = async (folio) => {
    setIsLoading(true);
    setError(null);
    try {
      const order = await orderService.getOrderByFolio(folio);
      return order;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar orden por ID
  const getOrderById = async (orderId) => {
    setIsLoading(true);
    setError(null);
    try {
      const order = await orderService.getOrderById(orderId);
      return order;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener órdenes por email
  const getOrdersByEmail = async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      return await orderService.getOrdersByEmail(email);
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Subir comprobante de pago
  const uploadReceipt = async (orderId, file, notes) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await orderService.uploadReceipt(orderId, file, notes);
      const updatedOrder = await orderService.getOrderById(orderId);
      setCurrentOrder(updatedOrder);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Seleccionar método de pago
  const setPaymentMethod = async (orderId, method) => {
    setIsLoading(true);
    setError(null);
    try {
      const order = await orderService.setPaymentMethod(orderId, method);
      setCurrentOrder(order);
      return order;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetCurrentOrder = () => {
    setCurrentOrder(null);
    setError(null);
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        isLoading,
        error,
        createOrder,
        getOrderByFolio,
        getOrderById,
        getOrdersByEmail,
        uploadReceipt,
        setPaymentMethod,
        resetCurrentOrder,
        setCurrentOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder debe ser usado dentro de un OrderProvider');
  }
  return context;
};