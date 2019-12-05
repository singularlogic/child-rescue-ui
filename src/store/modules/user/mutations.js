export const updateUserAuth = (state, data) => {
    state.user.auth = data;
};

export const clearUserAuth = (state) => {
    state.user.auth = {
        access_token: '',
        expires_in: '',
        refresh_token: '',
        scope: '',
        token_type: '',
    };
};

export const updateUser = (state, data) => {
    // state.user.id = data.id;
    // state.user.first_name = data.first_name;
    // state.user.last_name = data.last_name;
    // state.user.email = data.email;
    // state.user.is_end_user = data.is_end_user;
    // state.user.profile_image = data.profile_image;
    state.user = data;
};

export const clearUser = (state) => {
    state.user = {};
    state.user.id = '';
    state.user.first_name = '';
    state.user.last_name = '';
    state.user.email = '';
    state.user.is_end_user = '';
    state.user.profile_image = '';
};
