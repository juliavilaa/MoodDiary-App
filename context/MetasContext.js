import React, { createContext, useState, useEffect, useContext } from 'react';
import { metaService } from '../services/api';
import { AuthContext } from './AuthContext';
import { COLORES_METAS } from '../data/metas';

export const MetasContext = createContext();

export const MetasProvider = ({ children }) => {
  const { usuario } = useContext(AuthContext);
  const [metas, setMetas] = useState([]);

  useEffect(() => {
    if (usuario?.id) cargarMetas();
  }, [usuario]);

  const cargarMetas = async () => {
    try {
      const res = await metaService.listar(usuario.id);
      const mapeadas = res.data.map((m, i) => ({
        id: String(m.id),
        nombre: m.nombre,
        completada: m.completada,
        color: COLORES_METAS[i % COLORES_METAS.length],
      }));
      setMetas(mapeadas);
    } catch (err) {
      console.error('Error metas:', err.message);
      setMetas([]);
    }
  };

  const progreso = metas.length === 0
    ? 0
    : Math.round((metas.filter(m => m.completada).length / metas.length) * 100);

  const agregarMeta = async (nombre) => {
    if (!nombre.trim()) return false;
    try {
      await metaService.crear({
        id: Math.floor(Math.random() * 100000),
        usuarioId: usuario.id,
        nombre: nombre.trim(),
        completada: false,
      });
      await cargarMetas();
      return true;
    } catch (err) {
      console.error('Error agregar meta:', err.message);
      return false;
    }
  };

  const eliminarMeta = async (id) => {
    try {
      await metaService.eliminar(id);
      setMetas(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const editarMeta = async (id, nuevoNombre) => {
    if (!nuevoNombre.trim()) return false;
    try {
      const meta = metas.find(m => m.id === id);
      await metaService.actualizar(id, {
        ...meta,
        nombre: nuevoNombre.trim(),
        usuarioId: usuario.id,
      });
      setMetas(prev =>
        prev.map(m => m.id === id ? { ...m, nombre: nuevoNombre.trim() } : m)
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const toggleCompletar = async (id) => {
    try {
      const meta = metas.find(m => m.id === id);
      await metaService.actualizar(id, {
        ...meta,
        completada: !meta.completada,
        usuarioId: usuario.id,
      });
      setMetas(prev =>
        prev.map(m => m.id === id ? { ...m, completada: !m.completada } : m)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MetasContext.Provider value={{ metas, progreso, agregarMeta, eliminarMeta, editarMeta, toggleCompletar }}>
      {children}
    </MetasContext.Provider>
  );
};