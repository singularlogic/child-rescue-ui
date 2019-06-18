import '@babel/polyfill';
import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';

import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import { i18n } from './plugins/i18n';
import Rx from 'rxjs/Rx';
import VueRx from 'vue-rx';

Vue.use(VueRx, Rx);


export const bus = new Vue();
// import googlePlacesService from 'google-places-autocomplete-service';

Vue.config.productionTip = false;

Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyDetsjT3ifagYvxnjgF2zYtYAS-2Ni_zxQ',
        libraries: 'places', // necessary for places input
        // callback: initService(),
    },

});

import VImageInput from 'vuetify-image-input';

Vue.component(VImageInput.name, VImageInput);
// Vue.use(VueNativeSock, 'ws://localhost:8881/service-messenger/v1/ws/', {
//     store: store,
//     format: 'json',
//     reconnection: true, // (Boolean) whether to reconnect automatically (false)
//     reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
//     reconnectionDelay: 3000, // (Number) how long to initially wait before attempting a new (1000)
// });

new Vue({
    i18n,
    router,
    store,
    render: h => h(App),
}).$mount('#app');
