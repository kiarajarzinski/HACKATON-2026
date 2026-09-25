import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const login = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 450));
    if (!email || !password || password.length < 4) throw new Error('Credenciales inválidas');

    const rol = email.toLowerCase().includes('productor')
      ? 'PRODUCTOR'
      : email.toLowerCase().includes('emprendedor')
        ? 'EMPRENDIMIENTO'
        : 'CONSUMIDOR';
    const data = { id: `mock-${Date.now()}`, email, rol, token: 'mock-token' };
    guardarSesion(data);
    return data;
  };

  const register = async (email, password, rol, datosPerfil) => {
    await new Promise((resolve) => setTimeout(resolve, 450));
    const data = {
      id: `mock-${Date.now()}`,
      email,
      rol: rol.toUpperCase() === 'EMPRENDEDOR' ? 'EMPRENDIMIENTO' : rol.toUpperCase(),
      token: 'mock-token',
      datosPerfil
    };
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
    <AuthContext.Provider value={{ user, login, register, logout, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};