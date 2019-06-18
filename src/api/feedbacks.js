import { api } from '../plugins/axios';

export const feedbacksApi = {
    getFeedbacks(token, params) {
        return api.get(`/web_admin/api/v1/feedbacks/`, { headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` }, params })
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
    createFeedback(token, payload) {
        return api.post(`/web_admin/api/v1/feedbacks/`, payload, { headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` } })
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
    editFeedback(token, feedbackId, payload) {
        return api.patch(`/web_admin/api/v1/feedbacks/${feedbackId}/`, payload, { headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` } })
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
    // uploadImage(token, payload) {
    //     return api.post(`/web_admin/api/v1/cases/upload_image/`, payload, { headers: { 'Content-Type': 'multipart/form-data', authorization: `Bearer ${token}` } })
    //         .then(response => Promise.resolve(response))
    //         .catch(error => Promise.reject(error));
    // },
    // getCase(token, params, caseId) {
    //     return api.get(`/web_admin/api/v1/cases/${caseId}/`, { headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` }, params })
    //         .then(response => Promise.resolve(response))
    //         .catch(error => Promise.reject(error));
    // },
};
