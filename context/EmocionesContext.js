import React, { createContext, useState, useContext } from 'react';
import { CATALOGO_EMOCIONES } from '../data/emociones';

export const EmocionesContext = createContext();

export const EmocionesProvider = ({ children }) => {
  const [registros, setRegistros] = useState([
    {
      id: '1',
      descripcion: 'Tengo miedo de ir a la fiesta sola',
      emocion: 'Triste',
      color: '#9268b8',
      icono: 'sad-outline',
      textColor: '#fff',
      fecha: 'Hoy',
    },
    {
      id: '2',
      descripcion: 'Estoy feliz porque aprobé mi examen',
      emocion: 'Feliz',
      color: '#F0A0B0',
      icono: 'happy-outline',
      textColor: '#fff',
      fecha: 'Hoy',
    },
    {
      id: '3',
      descripcion: 'Estoy enojada porque se comieron mi pan',
      emocion: 'Enojado',
      color: '#E8857A',
      icono: 'thunderstorm-outline',
      textColor: '#fff',
      fecha: 'Ayer',
    },
    {
      id: '4',
      descripcion: 'Estoy ansiosa por el proyecto de ntd',
      emocion: 'Ansioso',
      color: '#A8D8B0',
      icono: 'alert-circle-outline',
      textColor: '#3a7a45',
      fecha: 'Ayer',
    },
    {
      id: '5',
      descripcion: 'Estoy triste porque perdí inglés',
      emocion: 'Triste',
      color: '#9268b8',
      icono: 'sad-outline',
      textColor: '#fff',
      fecha: 'Ayer',
    },
  ]);

  // Agregar nueva emoción
  const agregarEmocion = ({ descripcion, tipoEmocion }) => {
    const catalogo = CATALOGO_EMOCIONES.find(e => e.nombre === tipoEmocion);
    if (!catalogo) return false;

    const nueva = {
      id: Date.now().toString(),
      descripcion,
      emocion: catalogo.nombre,
      color: catalogo.color,
      icono: catalogo.icono,
      textColor: catalogo.textColor,
      fecha: 'Hoy',
    };

    setRegistros(prev => [nueva, ...prev]);
    return true;
  };

  // Eliminar emoción por id
  const eliminarEmocion = (id) => {
    setRegistros(prev => prev.filter(r => r.id !== id));
  };

  // Editar descripción de una emoción
  const editarEmocion = (id, nuevaDescripcion) => {
    setRegistros(prev =>
      prev.map(r => r.id === id ? { ...r, descripcion: nuevaDescripcion } : r)
    );
  };

  return (
    <EmocionesContext.Provider value={{ registros, agregarEmocion, eliminarEmocion, editarEmocion }}>
      {children}
    </EmocionesContext.Provider>
  );
};