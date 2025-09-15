import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true); // Asumimos que el token es válido inicialmente
  const { token: routeToken } = useParams(); // Token de la ruta
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener el token, ya sea de la ruta o de los parámetros de consulta
  const getToken = () => {
    if (routeToken) return routeToken;
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('token');
  };
  
  const token = getToken();

  useEffect(() => {
    // Si no hay token, mostrar error
    if (!token) {
      setTokenValid(false);
      setError('No se proporcionó un token de restablecimiento');
      return;
    }

    // Verificar validez del token al cargar el componente
    const verifyToken = async () => {
      try {
        console.log('Verificando token:', token);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-reset-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          setTokenValid(false);
          setError(data.message || 'El enlace de recuperación no es válido o ha expirado');
        }
      } catch (err) {
        console.error('Error al verificar token:', err);
        setTokenValid(false);
        setError('Error al verificar el token');
        
        // En desarrollo, continuamos como si el token fuera válido
        if (import.meta.env.MODE === 'development') {
          setTokenValid(true);
          setError('');
        }
      }
    };

    verifyToken();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (passwords.password !== passwords.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (passwords.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Enviando solicitud de restablecimiento con token:', token);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: passwords.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al restablecer la contraseña');
      }

      setSuccess(true);
      
      // Redirigir al login después de unos segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Error al restablecer contraseña:', err);
      setError(err.message || 'Ha ocurrido un error');
      
      // En desarrollo, simular éxito para pruebas
      if (import.meta.env.MODE === 'development') {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <img src="/img/logoSiscom.png" alt="Logo" className="h-16 mx-auto" />
            <h2 className="text-2xl font-bold mt-4 text-red-600">Enlace no válido</h2>
          </div>
          
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
          
          <div className="text-center">
            <Link to="/recuperar-contrasena" className="text-blue-600 hover:text-blue-500">
              Solicitar un nuevo enlace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <img src="/img/logoSiscom.png" alt="Logo" className="h-16 mx-auto" />
          <h2 className="text-2xl font-bold mt-4">Restablecer contraseña</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
            <p>{error}</p>
          </div>
        )}

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
            <p className="font-bold">¡Contraseña restablecida!</p>
            <p className="mt-2">Tu contraseña ha sido actualizada correctamente. Serás redirigido a la página de inicio de sesión.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Nueva contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={passwords.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-medium ${
                  isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? 'Procesando...' : 'Cambiar contraseña'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;