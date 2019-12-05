import { secured } from '../plugins/axios';

const resource = '/organizations/web_admin_api';

export default {
    get: id => secured.get(`${resource}/${id}/`),
    edit: payload => secured.patch(`${resource}/${payload.id}/`, payload),
    updateImage: (id, payload, headers) => secured.put(`${resource}/${id}/`, payload, headers),

    getUsers: organizationId => secured.get(`${resource}/${organizationId}/users/`),
    getUser: (organizationId, params) => secured.get(`${resource}/${organizationId}/user/`, { params }),
    updateUser: (organizationId, payload, params) => secured.put(`${resource}/${organizationId}/user/`, payload, { params }),
    createUser: payload => secured.post(`${resource}/users-create/`, payload),

    getFacilities: id => secured.get(`${resource}/${id}/facilities/`),

    // addChild: id => secured.post(`${resource}/add_child_in_facility/${id}/`),
    // latest: () => secured.get(`${resource}/latest/`),
    // create: payload => secured.post(`${resource}/`, payload),
    // edit: payload => secured.patch(`${resource}/${payload.id}/`, payload),
    // deactivate: id => secured.post(`${resource}/${id}/deactivate/`),
};
