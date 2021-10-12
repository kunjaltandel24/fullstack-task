import axios from './axios';

export const login = (payload) => axios.post(`/auth/login`, payload);
