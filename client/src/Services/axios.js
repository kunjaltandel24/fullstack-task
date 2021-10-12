import axios from 'axios';
import { logOutUser } from '../Stores';
axios.defaults.baseURL = '/api/';

axios.interceptors.request.use((config) => {
    // Do something before request is sent
    config.headers =  {token: localStorage.getItem('token') || ''};
    return config;
}, (error) => {
    // Do something with request error
    return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    // Do something with response error
    const { response: { status, data: { message } } } = error;
    if (status === 401) {
        localStorage.removeItem('token');
        logOutUser();
        window.location = '/';
    }
    return Promise.reject(error);
});

export default axios;