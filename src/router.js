import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import i18n from '@/plugins/i18n';

Vue.use(Router);

// route level code-splitting
// this generates a separate chunk (about.[hash].js) for this route
// which is lazy-loaded when the route is visited.
function load(component) {
    return () => import(/* webpackPrefetch: 1, webpackChunkName: "[request]" */ `@/views/${component}.vue`);
}

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior: (to, from, savedPosition) => {
        if (savedPosition) {
            return savedPosition;
        }
        if (to.hash) {
            return { selector: to.hash };
        }
        return { x: 0, y: 0 };
    },
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: load('Dashboard'),
            meta: { title: 'main.drawer.dashboard' },
        },
        {
            path: '/organization',
            name: 'organization',
            component: load('organization_manager/Organization'),
            meta: { title: 'Organization' },
        },
        {
            path: '/profile',
            name: 'profile',
            component: load('Profile'),
            meta: { title: 'Profile' },
        },
        {
            path: '/users',
            // name: 'users_main',
            component: load('organization_manager/users/UsersMain'),
            children: [
                {
                    path: '/',
                    name: 'users',
                    component: load('organization_manager/users/Users'),
                    meta: { title: 'Users' },
                },
                {
                    path: 'new',
                    name: 'user_new',
                    props: true,
                    component: load('organization_manager/users/UserEdit'),
                    meta: { title: 'New User' },
                },
                {
                    path: ':id',
                    name: 'user',
                    props: true,
                    component: load('organization_manager/users/User'),
                    meta: { title: 'User' },
                },
                {
                    path: ':id/edit',
                    name: 'user_edit',
                    props: true,
                    component: load('organization_manager/users/UserEdit'),
                    meta: { title: 'User Edit' },
                },
            ],
        },
        {
            path: '/facilities',
            // name: 'facilities_main',
            component: load('organization_manager/facilities/FacilitiesMain'),
            children: [
                {
                    path: '/',
                    name: 'facilities',
                    component: load('organization_manager/facilities/Facilities'),
                    meta: { title: 'Facilities' },
                },
                {
                    path: 'new',
                    name: 'facility_new',
                    props: true,
                    component: load('organization_manager/facilities/FacilityEdit'),
                    meta: { title: 'New Facility' },
                },
                {
                    path: ':id',
                    name: 'facility',
                    props: true,
                    component: load('organization_manager/facilities/Facility'),
                    meta: { title: 'Facility' },
                },
                {
                    path: ':id/edit',
                    name: 'facility_edit',
                    props: true,
                    component: load('organization_manager/facilities/FacilityEdit'),
                    meta: { title: 'Facility Edit' },
                },
            ],
        },
        {
            path: '/cases',
            // name: 'cases_main',
            component: load('cases/CasesMain'),
            children: [
                {
                    path: '/',
                    name: 'cases',
                    component: load('cases/Cases'),
                    meta: { title: 'Cases' },
                },
                {
                    path: 'new',
                    name: 'case_new',
                    props: true,
                    component: load('cases/CaseEdit'),
                    meta: { title: 'CaseNew' },
                },
                {
                    path: ':id',
                    name: 'case',
                    props: true,
                    component: load('cases/Case'),
                    meta: { title: 'Case' },
                    redirect: { name: 'info' },
                    children: [
                        {
                            path: 'info',
                            name: 'info',
                            component: load('cases/tabs/CaseInfo'),
                            meta: { title: 'Case Info', toolbar: true },
                            props: true,
                        },
                        {
                            path: 'feedbacks',
                            name: 'feedbacks',
                            component: load('cases/tabs/CaseFeedbacks'),
                            meta: { title: 'Case Feedbacks', toolbar: true },
                            props: true,
                        },
                        {
                            path: 'alerts',
                            name: 'alerts',
                            component: load('cases/tabs/CaseAlerts'),
                            meta: { title: 'Case Alerts', toolbar: true },
                            props: true,
                        },
                        {
                            path: 'additional-info',
                            name: 'additional-info',
                            component: load('cases/tabs/CaseAdditionalInfo'),
                            meta: { title: 'Case additional Info', toolbar: true },
                            props: true,
                        },
                        {
                            path: 'volunteers',
                            name: 'volunteers',
                            component: load('cases/tabs/CaseVolunteers'),
                            meta: { title: 'Case Volunteers', toolbar: true },
                            props: true,
                        },
                        {
                            path: 'files',
                            name: 'files',
                            component: load('cases/tabs/CaseFiles'),
                            meta: { title: 'Case Files', toolbar: true },
                            props: true,
                        },
                        {
                            path: 'places',
                            name: 'places',
                            component: load('cases/tabs/CasePlaces'),
                            meta: { title: 'Case Places', toolbar: true },
                            props: true,
                        },
                        {
                            path: 'control',
                            name: 'control',
                            component: load('cases/tabs/CaseControl'),
                            meta: { title: 'CaseControl', toolbar: true },
                            props: true,
                        },
                        {
                            path: 'analytics',
                            name: 'analytics',
                            component: load('cases/tabs/Analytics'),
                            meta: { title: 'Analytics', toolbar: true },
                            props: true,
                        },
                    ],
                },
                {
                    path: ':id/edit',
                    name: 'case_edit',
                    props: true,
                    component: load('cases/CaseEdit'),
                    meta: { title: 'CaseEdit' },
                },
            ],
        },
        {
            path: '/manage_facility',
            // name: 'manage_facility_main',
            component: load('manage_facility/CasesMain'),
            children: [
                {
                    path: '/',
                    name: 'manage_facility',
                    component: load('manage_facility/Cases'),
                    meta: { title: 'Manage Facility' },
                },
                {
                    path: ':id',
                    name: 'manage_facility_child',
                    props: true,
                    component: load('manage_facility/Case'),
                    meta: { title: 'Manage Facility Case' },
                    redirect: { name: 'facility-info' },
                    children: [
                        {
                            path: 'info',
                            name: 'facility-info',
                            component: load('manage_facility/tabs/CaseInfo'),
                            meta: { title: 'Case Info' },
                            props: true,
                        },
                        {
                            path: 'feedbacks',
                            name: 'facility-feedbacks',
                            component: load('manage_facility/tabs/CaseFeedbacks'),
                            meta: { title: 'Case Feedbacks' },
                            props: true,
                        },
                        {
                            path: 'alerts',
                            name: 'facility-alerts',
                            component: load('manage_facility/tabs/CaseAlerts'),
                            meta: { title: 'Case Alerts' },
                            props: true,
                        },
                        {
                            path: 'additional-info',
                            name: 'facility-additional-info',
                            component: load('manage_facility/tabs/CaseAdditionalInfo'),
                            meta: { title: 'Case additional Info' },
                            props: true,
                        },
                    ],
                },
                {
                    path: ':id/edit',
                    name: 'manage_facility_child_edit',
                    props: true,
                    component: load('manage_facility/CaseEdit'),
                    meta: { title: 'Manage Facility CaseEdit' },
                },
                {
                    path: 'add',
                    name: 'manage_facility_add',
                    props: true,
                    component: load('manage_facility/CaseEdit'),
                    meta: { title: 'Manage Facility CaseNew' },
                },
            ],
        },
        {
            path: '/children_registry',
            // name: 'children_registry_main',
            component: load('children_registry/CasesMain'),
            children: [
                {
                    path: '/',
                    name: 'children_registry',
                    component: load('children_registry/Cases'),
                    meta: { title: 'Children Registry' },
                },
            ],
        },
        {
            path: '/all-alerts',
            name: 'allAlerts', // These where: "alerts"
            component: load('Alerts'),
            meta: { title: 'Alerts' },
        },
        {
            path: '/login',
            name: 'login',
            component: load('authentication/Login'),
            meta: {
                title: 'main.drawer.login',
                requiresAuth: false,
            },
        },
        {
            path: '/500',
            name: 'error500',
            component: load('Error500'),
            meta: {
                title: '500',
                requiresAuth: false,
            },
        },
        {
            path: '*',
            name: 'error404',
            component: load('Error404'),
            meta: {
                title: '404',
                requiresAuth: false,
            },
        },
    ],
});

// Adjust window title, based on route title
router.beforeEach((to, from, next) => {
    // 1. Redirect login/register routes to "/" if user is already logged in
    if (store.state.signedIn && to.name === 'login') {
        return next('/');
    }

    // 2. If route doesn't require authentication, or user is signed-in, allow access
    if (to.meta.requiresAuth === false || store.state.signedIn) {
        // If document is in place (false only for SSR), ådjust tab title based on meta.title
        if (document) {
            // const title = to.meta.title || to.name;
            // document.title = `${i18n.t(title)} - Child Rescue`;
            document.title = 'Child Rescue';
        }

        return next();
    }

    // 3. For all other cases, redirect to the Login page
    return next('/login');
});

export default router;
