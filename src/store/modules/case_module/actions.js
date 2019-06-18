import {
    UPDATE_CASES,
    UPDATE_CASE,
} from "./types";
import { casesApi } from "../../../api/cases";


export const getCasesAction = ({ commit, state, dispatch }) => {
    const params = {};
    return casesApi.getCases(localStorage.getItem('access_token'), params)
        .then((response) => {
            if (response.status === 200) {
                commit(UPDATE_CASES, response.data);
            }
            return response;
        })
        .catch(error => Promise.reject(error));
};


export const getActiveCasesAction = ({ commit, state, dispatch }) => {
    const params = { is_active: true };
    return casesApi.getCases(localStorage.getItem('access_token'), params)
        .then((response) => {
            if (response.status === 200) {
                commit(UPDATE_CASES, response.data);
            }
            return response;
        })
        .catch(error => Promise.reject(error));
};

export const createCaseAction = ({ commit, state, dispatch }, { caseObject }) => {
    if (caseObject.demographic_data.date_of_birth) {
        caseObject.demographic_data.date_of_birth = caseObject.demographic_data.date_of_birth + ' 00:00';
    }
    if (caseObject.demographic_data.arrival_at_facility_date) {
        caseObject.demographic_data.arrival_at_facility_date = caseObject.demographic_data.arrival_at_facility_date + ' 00:00';
    }

    return casesApi.createCase(localStorage.getItem('access_token'), caseObject)
        .then((response) => {
            if (response.status === 200) {
                commit(UPDATE_CASES, response.data);
            }
            return response;
        })
        .catch(error => Promise.reject(error));
};


export const updateCaseAction = ({ commit, state, dispatch }, { caseObject }) => {
    delete caseObject.demographic_data.id;
    delete caseObject.demographic_data.case;

    if (caseObject.demographic_data.date_of_birth !== undefined && caseObject.demographic_data.date_of_birth !== null) {
        caseObject.demographic_data.date_of_birth = caseObject.demographic_data.date_of_birth + ' 00:00';
    }
    if (caseObject.demographic_data.arrival_at_facility_date) {
        caseObject.demographic_data.arrival_at_facility_date = caseObject.demographic_data.arrival_at_facility_date + ' 00:00';
    }

    delete caseObject.medical_data.id;
    delete caseObject.medical_data.case;

    delete caseObject.psychological_data.id;
    delete caseObject.psychological_data.case;

    delete caseObject.physical_data.id;
    delete caseObject.physical_data.case;

    delete caseObject.personal_data.id;
    delete caseObject.personal_data.case;

    delete caseObject.social_media_data.id;
    delete caseObject.social_media_data.case;

    return casesApi.editCase(localStorage.getItem('access_token'), caseObject.id, caseObject)
        .then((response) => {
            if (response.status === 200) {
                commit(UPDATE_CASES, response.data);
            }
            return response;
        })
        .catch(error => Promise.reject(error));
};

export const uploadImageAction = ({ commit, state, dispatch }, { data }) => {
    return casesApi.uploadImage(localStorage.getItem('access_token'), data)
        .then((response) => {
            if (response.status === 200 || response.status === 201) {
                // commit(UPDATE_CASES, response.data);
            }
            return response;
        })
        .catch(error => Promise.reject(error));
};

export const getCaseAction = ({ commit, state, dispatch }, { caseId }) => {
    const params = {};
    return casesApi.getCase(localStorage.getItem('access_token'), params, caseId)
        .then((response) => {
            if (response.status === 200) {
                commit(UPDATE_CASE, response.data);
            }
            return response;
        })
        .catch(error => Promise.reject(error));
};


export const closeCaseAction = ({ commit, state, dispatch }, { caseId }) => {
    // const params = {};
    return casesApi.closeCase(localStorage.getItem('access_token'), caseId)
        .then((response) => {
            if (response.status === 200) {
                commit(UPDATE_CASES, response.data);
            }
            return response;
        })
        .catch(error => Promise.reject(error));
};

