import axios from 'axios';
import store from '@/store';
import { SET_LOADING, SET_SNACKBAR_STATUS } from '@/store/mutation-types';


const baseURL = process.env.VUE_APP_BACKEND;

const plain = axios.create({
    baseURL: `${baseURL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

const secured = axios.create({
    baseURL: `${baseURL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

secured.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${store.state.token}`;
    store.commit(SET_LOADING, true);
    return config;
}, (error) => {
    store.commit(SET_LOADING, false);
    return Promise.reject(error);
});

secured.interceptors.response.use((response) => {
    store.commit(SET_LOADING, false);
    return response;
}, (error) => {
    store.commit(SET_SNACKBAR_STATUS, { message: error.response.data, color: 'error' });
    store.commit(SET_LOADING, false);
    return Promise.reject(error);
});

export { plain, secured };
