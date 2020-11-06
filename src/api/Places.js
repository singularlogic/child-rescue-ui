import { secured } from "../plugins/axios";

const resource = "/places/web_admin_api";

export default {
    all: params => secured.get(`${resource}/`, { params }),
    events: params => secured.get(`${resource}/events/`, { params }),
    create: payload => secured.post(`${resource}/`, payload),
    get: id => secured.get(`${resource}/${id}/`),
    convert: id => secured.post(`${resource}/convert/${id}/`),
    update: payload => secured.patch(`${resource}/${payload.id}/`, payload),
    delete: id => secured.delete(`${resource}/${id}/`)
};
