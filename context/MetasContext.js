import React, { createContext, useState } from 'react';
import { COLORES_METAS } from '../data/metas';

export const MetasContext = createContext();

export const MetasProvider = ({ children }) => {
  const [metas, setMetas] = useState([
    { id: '1', nombre: 'Reducir ansiedad',      completada: false, color: '#9268b8' },
    { id: '2', nombre: 'Subir ánimo',            completada: true,  color: '#F0A0B0' },
    { id: '3', nombre: 'Aumentar alegría',       completada: true,  color: '#E8857A' },
    { id: '4', nombre: 'Pensamientos positivos', completada: false, color: '#9268b8' },
  ]);

  // Progreso general: % de metas completadas
  const progreso = metas.length === 0
    ? 0
    : Math.round((metas.filter(m => m.completada).length / metas.length) * 100);

  const agregarMeta = (nombre) => {
    if (!nombre.trim()) return false;
    const color = COLORES_METAS[metas.length % COLORES_METAS.length];
    setMetas(prev => [...prev, {
      id: Date.now().toString(),
      nombre: nombre.trim(),
      completada: false,
      color,
    }]);
    return true;
  };

  const eliminarMeta = (id) => {
    setMetas(prev => prev.filter(m => m.id !== id));
  };

  const editarMeta = (id, nuevoNombre) => {
    if (!nuevoNombre.trim()) return false;
    setMetas(prev =>
      prev.map(m => m.id === id ? { ...m, nombre: nuevoNombre.trim() } : m)
    );
    return true;
  };

  const toggleCompletar = (id) => {
    setMetas(prev =>
      prev.map(m => m.id === id ? { ...m, completada: !m.completada } : m)
    );
  };

  return (
    <MetasContext.Provider value={{ metas, progreso, agregarMeta, eliminarMeta, editarMeta, toggleCompletar }}>
      {children}
    </MetasContext.Provider>
  );
};