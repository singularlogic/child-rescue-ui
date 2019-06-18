import Vue from 'vue';
import Vuex from 'vuex';
// import VuexPersist from 'vuex-persist';
import user_module from './modules/user_module/index';
import generic_module from './modules/generic_module/index';
import case_module from './modules/case_module/index';
import alert_module from './modules/alert_module/index';
import feedback_module from './modules/feedback_module/index';
// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';
// const vuexPersist = new VuexPersist({
//     key: 'my-app',
//     storage: localStorage,
// });

export default new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        generic_module,
        user_module,
        case_module,
        alert_module,
        feedback_module,
    },
    strict: debug,
    // plugins: debug ? [createLogger()] : []
    // plugins: [vuexPersist.plugin],
});
