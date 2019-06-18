import { alertsApi } from '../../../api/alerts';
import { UPDATE_ALERT, UPDATE_ALERTS } from './types';

export const getAlertsAction = ({ commit, state, dispatch }, { caseId }) => {
    const params = { caseId: caseId };
    return alertsApi.getAlerts(localStorage.getItem('access_token'), params)
        .then((response) => {
            if (response.status === 200) {
                commit(UPDATE_ALERTS, response.data);
            }
            return response;
        })
        .catch(error => Promise.reject(error));
};


export const createAlertAction = ({ commit, state, dispatch }, { alertObject }) => {
    // alertObject.start = alertObject.start + ' ' + alertObject.start_time;
    // delete alertObject.start_time;
    //
    // alertObject.end = alertObject.end + ' ' + alertObject.end_time;
    // delete alertObject.end_time;

    return alertsApi.createAlert(localStorage.getItem('access_token'), alertObject)
        .then((response) => {
            if (response.status === 200) {
                commit(UPDATE_ALERT, response.data);
            }
            return response;
        })
        .catch(error => Promise.reject(error));
};

export const updateAlertAction = ({ commit, state, dispatch }, { alertObject }) => {

    // alertObject.start = alertObject.start + ' ' + alertObject.start_time;
    // delete alertObject.start_time;
    //
    // alertObject.end = alertObject.end + ' ' + alertObject.end_time;
    // delete alertObject.end_time;

    return alertsApi.editAlert(localStorage.getItem('access_token'), alertObject.id, alertObject)
        .then((response) => {
            if (response.status === 200) {
                commit(UPDATE_ALERT, response.data);
            }
            return response;
        })
        .catch(error => Promise.reject(error));
};

export const deactivateAlertAction = ({ commit, state, dispatch }, { alertObject }) => {

    // alertObject.start = alertObject.start + ' ' + alertObject.start_time;
    // delete alertObject.start_time;
    //
    // alertObject.end = alertObject.end + ' ' + alertObject.end_time;
    // delete alertObject.end_time;

    return alertsApi.deactivateAlert(localStorage.getItem('access_token'), alertObject.id, alertObject)
        .then((response) => {
            if (response.status === 200) {
                commit(UPDATE_ALERT, response.data);
            }
            return response;
        })
        .catch(error => Promise.reject(error));
};
