import '@babel/polyfill';
import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';

import './plugins/vuetify';
import Rx from 'rxjs/Rx';
import VueRx from 'vue-rx';
import VImageInput from 'vuetify-image-input';
import App from './App.vue';
import router from './router';
import store from './store';
import { i18n } from './plugins/i18n';

Vue.use(VueRx, Rx);

export const bus = new Vue();

Vue.config.productionTip = false;

Vue.prototype.$caseManagerAndAbove = ['organization_manager', 'coordinator', 'case_manager'];
Vue.prototype.$networkManagerAndAbove = ['organization_manager', 'coordinator', 'network_manager'];

Vue.use(VueGoogleMaps, {
    load: {
        // key: 'AIzaSyDetsjT3ifagYvxnjgF2zYtYAS-2Ni_zxQ', // suite
        key: 'AIzaSyAg9utw_PA8gyI8fLXS5E6SqrO31lw4cxE', // mine-try
        libraries: 'places', // necessary for places input
        // callback: initService(),
    },
});

Vue.component(VImageInput.name, VImageInput);

new Vue({
    i18n,
    router,
    store,
    render: h => h(App),
}).$mount('#app');
