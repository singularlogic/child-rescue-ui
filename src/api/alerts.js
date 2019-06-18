import { api } from '../plugins/axios';

export const alertsApi = {
    getAlerts(token, params) {
        return api.get(`/web_admin/api/v1/alerts/`, { headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` }, params })
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
    createAlert(token, payload) {
        return api.post(`/web_admin/api/v1/alerts/`, payload, { headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` } })
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
    editAlert(token, alertId, payload) {
        return api.patch(`/web_admin/api/v1/alerts/${alertId}/`, payload, { headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` } })
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
    deactivateAlert(token, alertId, payload) {
        return api.post(`/web_admin/api/v1/alerts/${alertId}/deactivate/`, payload, { headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` } })
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
};
