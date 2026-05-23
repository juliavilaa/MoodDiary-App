import axios from 'axios';

// Cambia esta IP por la de tu computador en la red local
const BASE_URL = 'http://192.168.1.65:8080';


const api = axios.create({ baseURL: BASE_URL });

export const usuarioService = {
  login: (email, password) => api.post('/login', { email, password }),
  register: (data) => api.post('/usuarios', data),
};

export const emocionService = {
  listar: (usuarioId) => api.get(`/emociones/usuario/${usuarioId}`),
  crear: (data) => api.post('/emociones', data),
  actualizar: (id, data) => api.put(`/emociones/${id}`, data),
  eliminar: (id) => api.delete(`/emociones/${id}`),
};

export const metaService = {
  listar: (usuarioId) => api.get(`/metas/usuario/${usuarioId}`),
  crear: (data) => api.post('/metas', data),
  actualizar: (id, data) => api.put(`/metas/${id}`, data),
  eliminar: (id) => api.delete(`/metas/${id}`),
};