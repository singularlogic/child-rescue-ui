import Vue from "vue";

import { secured } from "../plugins/axios";

const resource = "/feedbacks/web_admin_api";

async function withPolling(callback, interval) {
    const data = await callback();
    if (!interval) return { data };
    const observableData = Vue.observable({ data });
    const poll = () => {
        setTimeout(async () => {
            observableData.data = { ...(await callback()) };
            poll();
        }, interval);
    };
    poll();
    return observableData;
}

export default {
    all: params => secured.get(`${resource}/`, { params }),
    allInt(params) {
        return withPolling(() => secured.get(`${resource}/`, { params }), 2000);
    },
    latest: () => secured.get(`${resource}/latest/`),
    create: payload => secured.post(`${resource}/`, payload),
    edit: payload => secured.patch(`${resource}/${payload.id}/`, payload)
};
