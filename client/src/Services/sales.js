import axios from './axios';

export const listTransactions = (params) => axios.get('/sales', { params });

export const getTransaction = (id) => axios.get(`/sales/${id}`);

export const addSale = (payload) => axios.post('/sales/add-sale', payload);

