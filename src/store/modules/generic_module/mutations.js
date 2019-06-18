export const showSnackbarMutation = (state, data) => {
    state.isSnackbarShown = true;
    state.snackbarMessage = data.message;
    state.snackbarStatus = data.status;
};

export const hideSnackbarMutation = (state) => {
    state.isSnackbarShown = false;
    state.snackbarMessage = '';
};


export const showLoaderMutation = (state) => {
    state.loading = true;
};

export const hideLoaderMutation = (state) => {
    state.loading = false;
};

