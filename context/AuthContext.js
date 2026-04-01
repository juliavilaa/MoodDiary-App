import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [usuario, setUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([
    { email: "admin@test.com", password: "1234", nombre: "Admin", edad: "30" }
  ]);

  const login = (email, password) => {
    const encontrado = usuarios.find(
      (u) => u.email === email && u.password === password
    );
    if (encontrado) {
       setUsuario({ email: encontrado.email, nombre: encontrado.nombre, edad: encontrado.edad });
      return true;
    }
    return false;
  };

  const register = ({ nombre, email, password, edad }) => {
    const yaExiste = usuarios.find((u) => u.email === email);
    if (yaExiste) {
      return false;
    }
    const nuevoUsuario = { nombre, email, password, edad };
    setUsuarios((prev) => [...prev, nuevoUsuario]);
    return true;
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};