import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
    en: {
        message: {
            hello: 'hello world'
        }
    },
    fr: {
        message: {
            hello: 'Bonjour monde'
        }
    }
};

export const i18n = new VueI18n({
    locale: 'fr', // set locale
    fallbackLocale: 'en',
    messages // set locale messages
});
