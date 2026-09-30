import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getItems = () => api.get('/items').then(res => res.data);
export const getItem = (id) => api.get(`/items/${id}`).then(res => res.data);
export const deleteItem = (id) => api.delete(`/items/${id}`).then(res => res.data);
export const ingestItem = (data) => api.post('/ingest', data).then(res => res.data);
export const queryAi = (data) => api.post('/query', data).then(res => res.data);
