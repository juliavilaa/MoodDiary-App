import React, { createContext, useState } from 'react';
import { usuarioService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  const login = async (email, password) => {
    try {
      const res = await usuarioService.login(email, password);
      setUsuario(res.data);
      return true;
    } catch (error) {
      console.log('Error login:', error.message);
      return false;
    }
  };

  const register = async ({ nombre, email, password, edad }) => {
    try {
      const datos = { 
  id: Math.floor(Math.random() * 100000), nombre, email, password, edad: parseInt(edad) 
};
      console.log('Enviando:', JSON.stringify(datos));
      await usuarioService.register(datos);
      return true;
    } catch (error) {
      console.log('Error registro:', error.message);
      return false;
    }
};
  const logout = () => setUsuario(null);

  return (
    <AuthContext.Provider value={{ usuario, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};