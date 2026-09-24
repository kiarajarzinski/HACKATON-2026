import { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar sesión si existe un token
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    const id = localStorage.getItem('id');
    
    if (token && rol && id) {
      setUser({ token, rol, id });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    guardarSesion(data);
    return data;
  };

  const register = async (email, password, rol, datosPerfil) => {
    const { data } = await api.post('/auth/register', { email, password, rol, datosPerfil });
    guardarSesion(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('id');
    setUser(null);
  };

  const guardarSesion = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('rol', data.rol);
    localStorage.setItem('id', data.id);
    setUser({ token: data.token, rol: data.rol, id: data.id });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};