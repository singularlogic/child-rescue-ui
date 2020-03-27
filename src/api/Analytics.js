import { secured } from '../plugins/axios';

const resource = '/analytics/web_admin_api';

export default {
    feedbackCount: params => secured.get(`${resource}/feedbacks/count/`, { params }),
    alertCount: params => secured.get(`${resource}/alerts/count/`, { params }),
    alertAreaCovered: params => secured.get(`${resource}/alerts/area-covered/`, { params }),
};
