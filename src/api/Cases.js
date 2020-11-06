import { secured } from "../plugins/axios";

const resource = "/cases/web_admin_api";

export default {
    children: params => secured.get(`${resource}/children/`, { params }),
    getChild: childId => secured.get(`${resource}/children/${childId}/`),

    dashboard: params => secured.get(`${resource}/dashboard`, { params }),
    all: params => secured.get(`${resource}/`, { params }),
    shared_organizations: params =>
        secured.get(`${resource}/shared_organizations/`, { params }),
    shared_to_organizations: (payload, params) =>
        secured.post(`${resource}/shared_organizations/`, payload, { params }),
    anonymized: () => secured.get(`${resource}/anonymized-cases/`),
    anonymizedCase: id => secured.get(`${resource}/anonymized-case/${id}/`),

    getSimilarCases: caseId =>
        secured.get(`${resource}/${caseId}/similar_cases/`),
    getLinkedCases: caseId =>
        secured.get(`${resource}/${caseId}/linked_cases/`),
    linkCase: (caseId, payload) =>
        secured.post(`${resource}/${caseId}/linked_cases/`, payload),
    unlinkCase: (caseId, linkedCase) =>
        secured.delete(`${resource}/${caseId}/linked_cases/${linkedCase}/`),
    getActiveCases: params =>
        secured.get(`${resource}/?is_active=true`, { params }),
    getActiveVolunteers: () => secured.get(`${resource}/active_volunteers/`),
    getNumberOfPlaces: () => secured.get(`${resource}/number_of_places/`),
    create: payload => secured.post(`${resource}/`, payload),
    edit: (caseId, payload) => secured.patch(`${resource}/${caseId}/`, payload),
    get: (caseId, params) => secured.get(`${resource}/${caseId}/`, { params }),

    getFacilityCases: params =>
        secured.get(`${resource}/facility_cases/`, { params }),
    getFacilityCase: (caseId, params) =>
        secured.get(`${resource}/facility_cases/${caseId}/`, { params }),
    createFacilityCase: payload =>
        secured.post(`${resource}/facility_cases/`, payload),
    setState: (caseId, params) =>
        secured.get(`${resource}/facility_cases/${caseId}/state/`, { params }),
    reportMissing: (caseId, payload) =>
        secured.post(
            `${resource}/facility_cases/${caseId}/report_missing/`,
            payload
        ),
    close: (caseId, payload) =>
        secured.post(`${resource}/${caseId}/close_case/`, payload),
    archive: caseId => secured.get(`${resource}/${caseId}/archive_case/`),
    // updateImage: (id, payload) => secured.post(`${resource}/upload_image/`, payload),
    updateImage: (caseId, payload, headers) =>
        secured.put(`${resource}/${caseId}/`, payload, headers),

    getSocialMedia: params =>
        secured.get(`${resource}/social_media/`, { params }),
    createSocialMedia: payload =>
        secured.post(`${resource}/social_media/`, payload),
    updateSocialMedia: payload =>
        secured.patch(`${resource}/social_media/${payload.id}/`, payload),

    getVolunteers: caseId => secured.get(`${resource}/${caseId}/volunteers/`),
    addVolunteers: (caseId, payload) =>
        secured.post(`${resource}/${caseId}/volunteers/add/`, payload),
    editVolunteer: (caseId, payload) =>
        secured.put(`${resource}/${caseId}/volunteers/${payload.id}/`, payload),
    removeVolunteer: (caseId, volunteerId) =>
        secured.delete(`${resource}/${caseId}/volunteers/${volunteerId}/`),

    getFiles: caseId => secured.get(`${resource}/${caseId}/files/`),
    getFile: (caseId, fileId) =>
        secured.get(`${resource}/${caseId}/files/${fileId}/`),
    downloadImage: (caseId, fileId, headers) =>
        secured.get(
            `${resource}/${caseId}/files/${fileId}/download-image/`,
            headers
        ),
    downloadFile: (caseId, fileId, headers) =>
        secured.get(
            `${resource}/${caseId}/files/${fileId}/download-file/`,
            headers
        ),
    createFile: (caseId, payload) =>
        secured.post(`${resource}/${caseId}/files/`, payload),
    addFile: (caseId, fileId, payload, headers) =>
        secured.put(`${resource}/${caseId}/files/${fileId}/`, payload, headers),
    deleteFile: (caseId, fileId) =>
        secured.delete(`${resource}/${caseId}/files/${fileId}/`),

    getFeed: caseId => secured.get(`${resource}/${caseId}/feed/`),
    createPost: (caseId, payload) =>
        secured.post(`${resource}/${caseId}/feed/`, payload),
    uploadPostImage: (caseId, postId, payload, headers) =>
        secured.put(`${resource}/${caseId}/feed/${postId}/`, payload, headers),
    deactivateAlerts: caseId =>
        secured.post(`${resource}/${caseId}/deactivate_alerts/`)
};
