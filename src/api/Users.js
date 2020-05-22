import { plain, secured } from "../plugins/axios";

const resource = "/users/web_admin_api";

export default {
    login: payload => plain.post(`${resource}/login/`, payload),
    logout: () => secured.post(`${resource}/logout/`),

    get: () => secured.get(`${resource}/me/`),
    edit: payload => secured.put(`${resource}/me/`, payload),
    delete: () => secured.put(`${resource}/me/`),

    getUsers: params => secured.get(`${resource}/`, { params }),
    getUser: id => secured.get(`${resource}/${id}/`),
    updateUser: payload => secured.put(`${resource}/${payload.id}/`, payload),
    createUser: payload => secured.post(`${resource}/`, payload),
    changePassword: payload =>
        secured.post(`${resource}/change-password/`, payload),
    forgotPassword: payload =>
        plain.post(`${resource}/forgot-password/`, payload),
    resetPassword: payload => plain.post(`${resource}/reset-password/`, payload)
};
