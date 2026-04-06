// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const AuthContext = createContext();

// Mapear sesión de Supabase a objeto user consistente
function mapUser(session) {
  if (!session?.user) return null;
  const u = session.user;
  return {
    id: u.id,
    email: u.email,
    name: u.user_metadata?.name || '',
    phone: u.user_metadata?.phone || '',
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Cargar sesión existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(mapUser(session));
      setLoading(false);
    });

    // 2. Escuchar cambios de auth (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(mapUser(session));
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ─── Sign In ──────────────────────────────────────────────────
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // ─── Sign Up ──────────────────────────────────────────────────
  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: metadata.name || '',
          phone: metadata.phone || '',
        },
      },
    });
    if (error) throw error;
    return data;
  };

  // ─── Sign Out ─────────────────────────────────────────────────
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // ─── Update Profile ──────────────────────────────────────────
  const updateProfile = async (metadata) => {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata,
    });
    if (error) throw error;
    setUser(mapUser({ user: data.user }));
    return data;
  };

  // ─── Reset Password Request ───────────────────────────────────
  const resetPassword = async (email) => {
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw error;
  };

  // ─── Update Password (after reset link) ───────────────────────
  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        resetPassword,
        updatePassword,
        // Aliases para compatibilidad con código existente
        login: () => console.warn('Use signIn instead of login'),
        logout: signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};