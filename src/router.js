import Vue from 'vue';
import Router from 'vue-router';
import Main from './views/Main.vue';
import Dashboard from './views/Dashboard.vue';
import Case from './views/cases/Case.vue';
import Cases from './views/cases/Cases.vue';
import CaseEdit from './views/cases/CaseEdit.vue';
import Alerts from './views/Alerts.vue';
import Login from './views/authentication/Login.vue';
import CasesMain from './views/cases/CasesMain';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'main',
            component: Main,
            // props: true,
            meta: { title: 'Main' },
            redirect: { name: 'dashboard' },
            beforeEnter: (to, from, next) => {
                if (localStorage.getItem('access_token')) {
                    // store.dispatch('someAction').then(res => next() )
                    next();
                } else {
                    next({ name: 'login' });
                }
            },
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: Dashboard,
                    meta: { title: 'Dashboard' },
                },
                {
                    path: 'cases',
                    name: 'cases_main',
                    component: CasesMain,
                    children: [
                        {
                            path: '/',
                            name: 'cases',
                            component: Cases,
                            meta: { title: 'Cases' },
                        },
                        {
                            path: ':id',
                            name: 'case',
                            props: true,
                            component: Case,
                            meta: { title: 'Case' },
                        },
                        {
                            path: ':id/edit',
                            name: 'case_edit',
                            props: true,
                            component: CaseEdit,
                            meta: { title: 'CaseEdit' },
                        },
                        {
                            path: 'new',
                            name: 'case_new',
                            component: CaseEdit,
                            meta: { title: 'CaseEdit' },
                        },
                    ]
                },
                {
                    path: 'alerts',
                    name: 'alerts',
                    component: Alerts,
                    meta: { title: 'Alerts' },
                },
                // {
                //     path: 'case/:id',
                //     name: 'case',
                //     props: true,
                //     component: Case,
                //     meta: { title: 'Case' },
                // },
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: { title: 'Login' },
            beforeEnter: (to, from, next) => {
                // if (JSON.parse(localStorage.getItem('auth')) && JSON.parse(localStorage.getItem('auth')).access_token) {
                if (localStorage.getItem('access_token')) {
                    next({ name: 'main' });
                } else {
                    next();
                }
            },
        },
    ],
});
