import { secured } from '../plugins/axios';

const resource = '/cases/web_admin_api';

export default {
    children: params => secured.get(`${resource}/children/`, { params }),
    getChild: childId => secured.get(`${resource}/children/${childId}/`),

    all: params => secured.get(`${resource}/`, { params }),
    getActiveCases: params => secured.get(`${resource}/?is_active=true`, { params }),
    create: payload => secured.post(`${resource}/`, payload),
    edit: (caseId, payload) => secured.patch(`${resource}/${caseId}/`, payload),
    get: (caseId, params) => secured.get(`${resource}/${caseId}/`, { params }),

    getFacilityCases: params => secured.get(`${resource}/facility_cases/`, { params }),
    getFacilityCase: (caseId, params) => secured.get(`${resource}/facility_cases/${caseId}/`, { params }),
    createFacilityCase: payload => secured.post(`${resource}/facility_cases/`, payload),
    setState: (caseId, params) => secured.get(`${resource}/facility_cases/${caseId}/state/`, { params }),
    reportMissing: caseId => secured.get(`${resource}/facility_cases/${caseId}/report_missing/`),

    close: caseId => secured.get(`${resource}/${caseId}/close_case/`),
    archive: caseId => secured.get(`${resource}/${caseId}/archive_case/`),
    // updateImage: (id, payload) => secured.post(`${resource}/upload_image/`, payload),
    updateImage: (caseId, payload, headers) => secured.put(`${resource}/${caseId}/`, payload, headers),

    getSocialMedia: params => secured.get(`${resource}/social_media/`, { params }),
    createSocialMedia: payload => secured.post(`${resource}/social_media/`, payload),
    updateSocialMedia: payload => secured.patch(`${resource}/social_media/${payload.id}/`, payload),

    getVolunteers: caseId => secured.get(`${resource}/${caseId}/volunteers/`),
    addVolunteers: (caseId, payload) => secured.post(`${resource}/${caseId}/volunteers/add/`, payload),
    editVolunteer: (caseId, payload) => secured.put(`${resource}/${caseId}/volunteers/${payload.id}/`, payload),
    removeVolunteer: (caseId, volunteerId) => secured.delete(`${resource}/${caseId}/volunteers/${volunteerId}/`),

    getFiles: caseId => secured.get(`${resource}/${caseId}/files/`),
    getFile: (caseId, fileId) => secured.get(`${resource}/${caseId}/files/${fileId}/`),
    downloadImage: (caseId, fileId, headers) => secured.get(`${resource}/${caseId}/files/${fileId}/download-image/`, headers),
    downloadFile: (caseId, fileId, headers) => secured.get(`${resource}/${caseId}/files/${fileId}/download-file/`, headers),
    createFile: (caseId, payload) => secured.post(`${resource}/${caseId}/files/`, payload),
    addFile: (caseId, fileId, payload, headers) => secured.put(`${resource}/${caseId}/files/${fileId}/`, payload, headers),
    deleteFile: (caseId, fileId) => secured.delete(`${resource}/${caseId}/files/${fileId}/`),

    getFeed: caseId => secured.get(`${resource}/${caseId}/feed/`),
    createPost: (caseId, payload) => secured.post(`${resource}/${caseId}/feed/`, payload),
    uploadPostImage: (caseId, postId, payload, headers) => secured.put(`${resource}/${caseId}/feed/${postId}/`, payload, headers),
};
