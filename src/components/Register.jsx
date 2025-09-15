import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (userData.password !== userData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    if (userData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return false;
    }
    
    // Validar teléfono (opcional pero recomendado)
    if (userData.phone && !/^\d{10,}$/.test(userData.phone.replace(/\D/g, ''))) {
      setError('El teléfono debe tener al menos 10 dígitos');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      // Llamada a la API de registro
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
      }
      
      // Registro exitoso
      if (data.token) {
        // Auto-login después del registro
        login({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          token: data.token,
          isLoggedIn: true
        });
        
        // Guardar token
        localStorage.setItem('authToken', data.token);
        
        // Redireccionar a cuenta
        navigate('/cuenta');
      } else {
        // Si no hay auto-login
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        navigate('/login');
      }
      
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
      
      // Modo desarrollo/prueba - agregar usuario al localStorage
      if (import.meta.env.MODE === 'development') {
        try {
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          users.push({
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            passwordHash: '[HASH SIMULADO]'
          });
          localStorage.setItem('users', JSON.stringify(users));
          
          // Login simulado para pruebas
          login({
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            isLoggedIn: true
          });
          
          navigate('/cuenta');
        } catch (localError) {
          console.error('Error en modo prueba:', localError);
        }
      }
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
            Crea tu cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Regístrate para hacer compras y dar seguimiento a tus pedidos
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Nombre completo</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={userData.name}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={userData.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">Teléfono</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={userData.phone}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Teléfono"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={userData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
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
                value={userData.confirmPassword}
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
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registrando...
                </span>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4 text-sm text-gray-600">
          <p>¿Ya tienes una cuenta? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;