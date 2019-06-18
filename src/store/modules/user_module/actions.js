import { UPDATE_USER_AUTH, UPDATE_USER, CLEAR_USER_AUTH, CLEAR_USER } from './types';
import { userApi } from '../../../api/users';

export const getUserInfoAction = ({ commit, state }) => {
    return userApi.userInfo(localStorage.getItem('access_token'))
        .then((response) => {
            if (response.status === 200) {
                commit(UPDATE_USER, response.data);
            }
            return response;
        })
        .catch(error => Promise.reject(error));
};

export const loginUserAction = ({ commit, dispatch }, { email, password, router }) => {
    const payload = JSON.stringify({
        email,
        password,
    });
    return userApi.login(payload)
        .then((response) => {
            if (response.status === 200) {
                commit(UPDATE_USER_AUTH, response.data);
                localStorage.setItem('access_token', response.data.access_token);
                dispatch('getUserInfoAction')
                    .then(() => {
                        router.push('/dashboard');
                    })
                    .catch(error => Promise.reject(error));
            }
            return response;
        })
        .catch(error => Promise.reject(error));
};

export const logoutUserAction = ({ commit, state }, { router }) => {
    const payload = JSON.stringify({});
    return userApi.logout(localStorage.getItem('access_token'), payload)
        .then((response) => {
            if (response.status === 204) {
                commit(CLEAR_USER_AUTH);
                commit(CLEAR_USER);
                localStorage.removeItem('access_token');
                router.push('/login');
            }
            return response;
        })
        .catch(error => Promise.reject(error));
};
