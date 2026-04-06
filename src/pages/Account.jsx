import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getOrdersByEmail } from '../services/orderService';

const Account = () => {
  const { user, signOut, updateProfile, updatePassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pedidos');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordData, setPasswordData] = useState({ password: '', confirmPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setProfileData({
      name: user.name || '',
      phone: user.phone || '',
    });

    const loadOrders = async () => {
      try {
        const data = await getOrdersByEmail(user.email);
        setOrders(data);
      } catch (error) {
        console.error('Error al cargar órdenes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg('');

    if (passwordData.password !== passwordData.confirmPassword) {
      setPasswordMsg('error:Las contraseñas no coinciden');
      return;
    }
    if (passwordData.password.length < 6) {
      setPasswordMsg('error:La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setPasswordSaving(true);
    try {
      await updatePassword(passwordData.password);
      setPasswordMsg('ok:Contraseña actualizada correctamente');
      setPasswordData({ password: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMsg('error:' + (err.message || 'Error al cambiar la contraseña'));
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg('');

    try {
      await updateProfile({
        name: profileData.name,
        phone: profileData.phone,
      });
      setProfileMsg('Perfil actualizado correctamente');
    } catch (err) {
      setProfileMsg('Error al actualizar perfil: ' + err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'payment_verified': return 'bg-green-100 text-green-800';
      case 'payment_uploaded': return 'bg-blue-100 text-blue-800';
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatOrderStatus = (status) => {
    const statusMap = {
      'completed': 'Completado',
      'pending_payment': 'Pendiente de pago',
      'payment_uploaded': 'Comprobante enviado',
      'payment_verified': 'Pago verificado',
      'processing': 'En proceso',
      'shipped': 'Enviado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-blue-900">Pedido {selectedOrder.folio}</h3>
                <p className="text-sm text-gray-500">{formatDate(selectedOrder.created_at)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(selectedOrder.status)}`}>
                {formatOrderStatus(selectedOrder.status)}
              </span>
            </div>

            {/* Productos */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Productos</h4>
              <div className="space-y-2">
                {selectedOrder.order_items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-500">x{item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toLocaleString('es-MX')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totales */}
            <div className="border-t mt-4 pt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${Number(selectedOrder.subtotal).toLocaleString('es-MX')}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA</span>
                <span>${Number(selectedOrder.tax).toLocaleString('es-MX')}</span>
              </div>
              {Number(selectedOrder.shipping_cost) > 0 && (
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>${Number(selectedOrder.shipping_cost).toLocaleString('es-MX')}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Total</span>
                <span>${Number(selectedOrder.total).toLocaleString('es-MX')}</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-6 flex justify-between">
              <div className="flex gap-2">
                {selectedOrder.status === 'pending_payment' && (
                  <Link
                    to={`/subir-comprobante/${selectedOrder.id}`}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    onClick={() => setShowOrderModal(false)}
                  >
                    Subir comprobante
                  </Link>
                )}
                <Link
                  to={`/orden/${selectedOrder.folio}`}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                  onClick={() => setShowOrderModal(false)}
                >
                  Ver orden completa
                </Link>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">Mi cuenta</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Tabs */}
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

        <div className="p-6">
          {/* Pedidos */}
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700">
                            <Link to={`/orden/${order.folio}`} className="hover:underline">
                              {order.folio}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${Number(order.total).toLocaleString('es-MX')}
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

          {/* Perfil */}
          {activeTab === 'perfil' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Mi información personal</h2>

              {profileMsg && (
                <div className={`mb-4 px-4 py-3 rounded-md text-sm ${profileMsg.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                  {profileMsg}
                </div>
              )}

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
                      id="email"
                      value={user.email}
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

                <div className="flex justify-between items-center pt-6">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {profileSaving ? 'Guardando...' : 'Guardar cambios'}
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

              {/* Cambiar contraseña */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">Cambiar contraseña</h3>

                {passwordMsg && (
                  <div className={`mb-4 px-4 py-3 rounded-md text-sm ${
                    passwordMsg.startsWith('error:')
                      ? 'bg-red-50 text-red-700'
                      : 'bg-green-50 text-green-700'
                  }`}>
                    {passwordMsg.replace(/^(ok|error):/, '')}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={passwordData.password}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      minLength={6}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      minLength={6}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {passwordSaving ? 'Guardando...' : 'Cambiar contraseña'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {showOrderModal && <OrderDetailsModal />}
    </div>
  );
};

export default Account;