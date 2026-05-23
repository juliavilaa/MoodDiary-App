import React, { createContext, useState, useEffect, useContext } from 'react';
import { emocionService } from '../services/api';
import { AuthContext } from './AuthContext';
import { CATALOGO_EMOCIONES } from '../data/emociones';

export const EmocionesContext = createContext();

export const EmocionesProvider = ({ children }) => {
  const { usuario } = useContext(AuthContext);
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    if (usuario?.id) cargarEmociones();
  }, [usuario]);

  const cargarEmociones = async () => {
    try {
      const res = await emocionService.listar(usuario.id);
      const mapeadas = res.data.map(e => {
        const cat = CATALOGO_EMOCIONES.find(c => c.nombre === e.tipo) || CATALOGO_EMOCIONES[0];
        return {
          id: String(e.id), descripcion: e.descripcion, emocion: e.tipo,
          color: cat.color, icono: cat.icono, textColor: cat.textColor, fecha: e.fecha
        };
      });
      setRegistros(mapeadas);
    } catch (err) {
      console.error('Error emociones:', err.message);
      setRegistros([]);
    }
  };

  const agregarEmocion = async ({ descripcion, tipoEmocion }) => {
    const cat = CATALOGO_EMOCIONES.find(e => e.nombre === tipoEmocion);
    if (!cat) return false;
    try {
      await emocionService.crear({
        id: Math.floor(Math.random() * 100000),
        usuarioId: usuario.id,
        tipo: tipoEmocion, descripcion,
        fecha: new Date().toLocaleDateString('es-CO')
      });
      await cargarEmociones();
      return true;
    } catch (err) {
      console.error('Error agregar emocion:', err.message);
      return false;
    }
  };

  const eliminarEmocion = async (id) => {
    try {
      await emocionService.eliminar(id);
      setRegistros(prev => prev.filter(r => r.id !== id));
    } catch (err) { console.error(err); }
  };

  const editarEmocion = async (id, nuevaDescripcion) => {
    try {
      const registro = registros.find(r => r.id === id);
      await emocionService.actualizar(id, { ...registro, descripcion: nuevaDescripcion });
      setRegistros(prev => prev.map(r => r.id === id ? { ...r, descripcion: nuevaDescripcion } : r));
    } catch (err) { console.error(err); }
  };

  return (
    <EmocionesContext.Provider value={{ registros, agregarEmocion, eliminarEmocion, editarEmocion }}>
      {children}
    </EmocionesContext.Provider>
  );
};