import { secured } from '../plugins/axios';

const resource = '/facilities/web_admin_api';

export default {
    all: () => secured.get(`${resource}/`),
    get: id => secured.get(`${resource}/${id}/`),
    create: payload => secured.post(`${resource}/`, payload),
    update: payload => secured.patch(`${resource}/${payload.id}/`, payload),

    addChild: (id, params) => secured.get(`${resource}/add_child_in_facility/${id}/`, { params }),
    // latest: () => secured.get(`${resource}/latest/`),
    // create: payload => secured.post(`${resource}/`, payload),
    // edit: payload => secured.patch(`${resource}/${payload.id}/`, payload),
    // deactivate: id => secured.post(`${resource}/${id}/deactivate/`),
};
