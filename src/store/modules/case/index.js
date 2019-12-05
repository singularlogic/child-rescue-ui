import state from './state';
import * as getters from './getters';
import * as actions from './actions';
import * as mutations from './mutations';

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
