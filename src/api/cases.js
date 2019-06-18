import { api } from '../plugins/axios';

export const casesApi = {
    getCases(token, params) {
        return api.get(`/web_admin/api/v1/cases/`, { headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` }, params })
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
    createCase(token, payload) {
        return api.post(`/web_admin/api/v1/cases/`, payload, { headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` } })
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
    editCase(token, caseId, payload) {
        return api.patch(`/web_admin/api/v1/cases/${caseId}/`, payload, { headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` } })
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
    closeCase(token, caseId) {
        return api.get(`/web_admin/api/v1/cases/${caseId}/close_case/`, { headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` } })
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
    uploadImage(token, payload) {
        return api.post(`/web_admin/api/v1/cases/upload_image/`, payload, { headers: { 'Content-Type': 'multipart/form-data', authorization: `Bearer ${token}` } })
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
    getCase(token, params, caseId) {
        return api.get(`/web_admin/api/v1/cases/${caseId}/`, { headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` }, params })
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
};
