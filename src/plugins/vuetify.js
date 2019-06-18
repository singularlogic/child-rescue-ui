import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';

// import el from 'vuetify/es5/locale/gr'


Vue.use(Vuetify, {
    iconfont: 'md',
    theme: {
        primary: '#F4B350',
        secondary: '#7e10ed',
        // accent: '#8c9eff',
        // error: '#b71c1c'
    },
    // lang: {
    //     locales: { el, },
    //     current: 'el'
    //   }
});
