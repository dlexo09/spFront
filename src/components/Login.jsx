import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials({
      ...credentials,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Llamada a la API real
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Caso especial: usuario necesita establecer contraseña
        if (response.status === 400 && data.action === 'SET_PASSWORD') {
          setNeedsPasswordSetup(true);
          setUserId(data.userId);
          setError('');
          setIsLoading(false);
          return;
        }

        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Login exitoso
      login({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        token: data.token,
        isLoggedIn: true
      });

      // Guardar token
      if (credentials.rememberMe) {
        localStorage.setItem('authToken', data.token);
      } else {
        sessionStorage.setItem('authToken', data.token);
      }

      navigate('/cuenta');
    } catch (err) {
      console.error('Error de login:', err);
      setError(err.message || 'Credenciales incorrectas');

      // PARA PRUEBAS LOCALES (Eliminar en producción)
      if (credentials.email === 'cliente@ejemplo.com' && credentials.password === 'cliente123') {
        login({
          id: '1',
          email: credentials.email,
          name: 'Cliente Ejemplo',
          role: 'customer',
          isLoggedIn: true
        });
        navigate('/cuenta');
      }
      else if (credentials.email === 'admin@siscoprint.com' && credentials.password === 'admin123') {
        login({
          id: '2',
          email: credentials.email,
          name: 'Administrador',
          role: 'admin',
          isLoggedIn: true
        });
        navigate('/cuenta');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar establecimiento de contraseña inicial
  const handleSetPassword = async (e) => {
    e.preventDefault();

    if (credentials.password !== credentials.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (credentials.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/set-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          password: credentials.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al establecer contraseña');
      }

      // Mostrar mensaje de éxito y volver al formulario de login
      setNeedsPasswordSetup(false);
      setCredentials({
        ...credentials,
        password: '',
        confirmPassword: ''
      });
      setError('');
      alert('Contraseña establecida correctamente. Ahora puedes iniciar sesión.');

    } catch (err) {
      setError(err.message || 'Error al establecer contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <img
            className="mx-auto h-16 w-auto"
            src="/img/logoSiscom.png"
            alt="Siscoprint"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-blue-900">
            {needsPasswordSetup ? 'Crear contraseña' : 'Iniciar sesión'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {needsPasswordSetup ?
              'Este es tu primer acceso. Por favor crea una contraseña segura' :
              'Accede a tu cuenta para gestionar tus pedidos'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p>{error}</p>
          </div>
        )}

        {needsPasswordSetup ? (
          // Formulario para establecer contraseña
          <form className="mt-8 space-y-6" onSubmit={handleSetPassword}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">Nueva contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Nueva contraseña"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirmar contraseña</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={credentials.confirmPassword || ''}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirmar contraseña"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  'Establecer contraseña'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setNeedsPasswordSetup(false)}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Volver al inicio de sesión
              </button>
            </div>
          </form>
        ) : (
          // Formulario normal de login
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">Correo electrónico</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Correo electrónico"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Contraseña"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={credentials.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <Link to="/recuperar-contrasena" className="font-medium text-blue-600 hover:text-blue-500">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </div>
          </form>
        )}

        {!needsPasswordSetup && (
          <div className="text-center mt-4 text-sm text-gray-600">
            <p>¿No tienes una cuenta? <Link to="/registro" className="font-medium text-blue-600 hover:text-blue-500">Regístrate</Link></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;