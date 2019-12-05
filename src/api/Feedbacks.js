import { secured } from '../plugins/axios';

const resource = '/feedbacks/web_admin_api';

export default {
    all: params => secured.get(`${resource}/`, { params }),
    latest: () => secured.get(`${resource}/latest/`),
    create: payload => secured.post(`${resource}/`, payload),
    edit: payload => secured.patch(`${resource}/${payload.id}/`, payload),
};
