import { api } from '../plugins/axios';

export const userApi = {
    signUp(payload) {
        return api.post('/api/v1/owners/signup/', payload, { headers: { 'Content-Type': 'application/json' } })
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
    login(payload) {
        return api.post('/web_admin/api/v1/users/login/', payload, { headers: { 'Content-Type': 'application/json' } })
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
    logout(token, payload) {
        return api.post('/web_admin/api/v1/users/logout/', payload, { headers: { authorization: `Bearer ${token}` } })
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
    userInfo(token) {
        return api.get('/web_admin/api/v1/users/me/', { headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` } })
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
};
