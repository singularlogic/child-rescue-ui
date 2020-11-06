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
        refreshVolunteers: false,
        refreshControl: false,
        refreshFeed: false,
        showAlerts: false,
        showFacts: false,
        showPOI: false,
        showAnalytics: false,
        showVolunteers: false,
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
        },
        setRefreshVolunteers: (state, isActive) => {
            state.refreshVolunteers = isActive;
        },
        setShowAlerts: (state, isActive) => {
            state.showAlerts = isActive;
        },
        setShowFacts: (state, isActive) => {
            state.showFacts = isActive;
        },
        setShowPOI: (state, isActive) => {
            state.showPOI = isActive;
        },
        setShowAnalytics: (state, isActive) => {
            state.showAnalytics = isActive;
        },
        setShowVolunteers: (state, isActive) => {
            state.showVolunteers = isActive;
        }
    },
    getters: {
        isLoading: state => state.loading === true,
        refreshControl: state => state.refreshControl === true,
        refreshFeed: state => state.refreshFeed === true,
        refreshFeedbacks: state => state.refreshFeedbacks === true,
        refreshVolunteers: state => state.refreshVolunteers === true,
        showAlerts: state => state.showAlerts === true,
        showFacts: state => state.showFacts === true,
        showPOI: state => state.showPOI === true,
        showAnalytics: state => state.showAnalytics === true,
        showVolunteers: state => state.showVolunteers === true
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
