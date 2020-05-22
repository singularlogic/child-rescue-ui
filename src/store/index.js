import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import {
    UserStore,
    FacilityStore,
    CaseStore,
    AlertStore,
    FeedbackStore
} from "./modules";

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    key: "child_rescue",
    reducer: state => ({
        token: state.token,
        signedIn: state.signedIn,
        role: state.role,
        organizationId: state.organizationId,
        facilityId: state.facilityId
    })
});

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        token: null,
        signedIn: false,
        refreshFeedbacks: false,
        refreshControl: false,
        refreshFeed: false,
        snackbarMessage: "",
        snackbarColor: "",
        loading: false,
        role: "",
        organizationId: "",
        facilityId: ""
    },
    mutations: {
        clearToken: state => {
            state.signedIn = false;
            state.token = null;
            state.role = null;
            state.organizationId = null;
        },
        setToken: (state, { loginResponse }) => {
            state.token = loginResponse.access_token;
            state.signedIn = true;
        },
        setRole: (state, { response }) => {
            state.role = response.role;
        },
        setOrganization: (state, { response }) => {
            state.organizationId = response.id;
        },
        setFacility: (state, { response }) => {
            state.facilityId = response.facility;
        },
        setSnackbarStatus: (state, status) => {
            state.snackbarMessage = status.message;
            state.snackbarColor = status.color;
        },
        setLoading: (state, isActive) => {
            state.loading = isActive;
        },
        setRefreshControl: (state, isActive) => {
            state.refreshControl = isActive;
        },
        setRefreshFeed: (state, isActive) => {
            state.refreshFeed = isActive;
        },
        setRefreshFeedbacks: (state, isActive) => {
            state.refreshFeedbacks = isActive;
        }
    },
    getters: {
        isLoading: state => state.loading === true,
        refreshControl: state => state.refreshControl === true,
        refreshFeed: state => state.refreshFeed === true,
        refreshFeedbacks: state => state.refreshFeedbacks === true
    },
    actions: {},
    modules: {
        UserStore,
        FacilityStore,
        CaseStore,
        AlertStore,
        FeedbackStore
    },
    plugins: [vuexLocal.plugin]
});

export default store;
