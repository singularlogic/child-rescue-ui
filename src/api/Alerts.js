import { secured } from "../plugins/axios";

const resource = "/metrics";

export default {
    getUserMetrics: params =>
        secured.get(`${resource}/user-metrics/`, { params }),
    getCommunityMetrics: params =>
        secured.get(`${resource}/community-metrics/`, { params }),
    getPerformanceMetrics: params =>
        secured.get(`${resource}/user-performance/`, { params }),
    getPeerComparisonMetrics: params =>
        secured.get(`${resource}/peer-comparison/`, { params }),
    getHistoryMetrics: params =>
        secured.get(`${resource}/user-history/`, { params }),
    getDevicePerformanceMetrics: params =>
        secured.get(`${resource}/device-history/`, { params })
};
