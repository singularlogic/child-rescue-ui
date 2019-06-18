import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);

// axios.defaults.baseURL = 'https://cr.app/';
// axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.baseURL = process.env.VUE_APP_BACKEND;



// if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
//     axios.defaults.baseURL = 'http://localhost:8888/';
// } else {
//     axios.defaults.baseURL = 'https://cr.com/';
// }

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';

export const api = axios.create();
//     {
//     withCredentials: true,
//     headers: {
//         // 'Accept': 'application/json',
//         // 'Content-Type': 'application/json'
//     }
// });
