import axios from './axios';

export const listCars = (params) => axios.get('/inventory', { params });

export const getCar = (id) => axios.get(`/inventory/${id}`);

export const postCar = (payload) => axios.post('/inventory', payload);

export const updateCar = (id, payload) => axios.put(`/inventory/${id}`, payload);
