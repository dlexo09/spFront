import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Account = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pedidos');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    // Redireccionar si no hay usuario
    if (!user) {
      navigate('/login');
      return;
    }

    // Cargar datos del perfil
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || ''
      });
    }

    // Cargar órdenes
    const loadOrders = async () => {
      try {
        // Aquí iría una llamada a la API para cargar las órdenes del usuario
        // Por ahora simulamos cargando desde localStorage
        const localOrders = JSON.parse(localStorage.getItem('localOrders') || '[]');

        // Filtrar solo las órdenes del usuario actual
        const userOrders = localOrders.filter(order =>
          order.customerData.email === user.email
        );

        setOrders(userOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar órdenes:', error);
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    // Aquí iría la llamada a la API para actualizar el perfil
    // Por ahora solo actualizamos el localStorage

    const updatedUser = {
      ...user,
      name: profileData.name,
      phone: profileData.phone,
      address: profileData.address,
      city: profileData.city,
      state: profileData.state,
      zipCode: profileData.zipCode
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Actualizar el contexto
    const { login } = useContext(AuthContext);
    login(updatedUser);

    alert('Perfil actualizado correctamente');
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatOrderStatus = (status) => {
    const statusMap = {
      'completed': 'Completado',
      'pending_payment': 'Pendiente de pago',
      'processing': 'En proceso',
      'cancelled': 'Cancelado'
    };

    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  // Función para continuar con el pago de un pedido
  const handleContinuePayment = (orderId) => {
    navigate(`/pagar-pedido/${orderId}`);
  };

  // Función para cancelar un pedido
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cancelar el pedido');
      }

      // Actualizar la lista de pedidos
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      );

      setOrders(updatedOrders);

      // Si el modal estaba abierto, actualizarlo también
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: 'cancelled' });
      }

      alert('Pedido cancelado con éxito');
    } catch (error) {
      console.error('Error al cancelar el pedido:', error);
      alert('Error al cancelar el pedido');
    } finally {
      setLoading(false);
    }
  };

  // Modificar el OrderDetailsModal para incluir botones de acción
  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* ... código existente ... */}

          {/* Botones de acción según el estado */}
          <div className="mt-6 flex justify-between">
            <div>
              {selectedOrder.status === 'pending_payment' && (
                <>
                  <button
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
                  >
                    Cancelar pedido
                  </button>
                  <button
                    onClick={() => {
                      closeOrderModal();
                      handleContinuePayment(selectedOrder.id);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Pagar ahora
                  </button>
                </>
              )}
            </div>
            <button
              onClick={closeOrderModal}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!user) {
    return null; // Si no hay usuario, no renderizar nada (navegará a login)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">Mi cuenta</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Tabs de navegación */}
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('pedidos')}
              className={`px-4 py-4 text-sm font-medium ${activeTab === 'pedidos'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Mis pedidos
            </button>
            <button
              onClick={() => setActiveTab('perfil')}
              className={`px-4 py-4 text-sm font-medium ${activeTab === 'perfil'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Mi perfil
            </button>
          </nav>
        </div>

        {/* Contenido de las tabs */}
        <div className="p-6">
          {/* Pestaña de Pedidos */}
          {activeTab === 'pedidos' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Mis pedidos</h2>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pedido
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id.slice(-8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${order.total.toLocaleString('es-MX')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                              {formatOrderStatus(order.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => handleViewOrderDetails(order)}
                            >
                              Ver detalles
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tienes pedidos todavía</p>
                  <button
                    onClick={() => navigate('/productos')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Explorar productos
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Pestaña de Perfil */}
          {activeTab === 'perfil' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Mi información personal</h2>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-3 py-2 border bg-gray-100 rounded-md"
                    />
                    <p className="text-xs text-gray-500 mt-1">El correo no puede ser cambiado</p>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-medium mt-6 mb-2">Dirección de envío predeterminada</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={profileData.city}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={profileData.state}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Código postal
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      id="zipCode"
                      value={profileData.zipCode}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Guardar cambios
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles de pedido */}
      {showOrderModal && <OrderDetailsModal />}
    </div>
  );
};

export default Account;