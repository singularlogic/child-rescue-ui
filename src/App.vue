<template>
    <component :is="layout">
        <router-view :layout.sync="layout" />
    </component>
</template>

<script>
import { AppLayout, EmptyLayout, OrganizationManagerLayout, NetworkManagerLayout, CaseManagerLayout, CoordinatorLayout, FacilityManagerLayout } from '@/layouts';

export default {
    name: 'App',
    components: { AppLayout, OrganizationManagerLayout, NetworkManagerLayout, EmptyLayout, CaseManagerLayout, CoordinatorLayout, FacilityManagerLayout },
    computed: {
        layout() {
            switch (this.$route.name) {
            case 'error404':
            case 'error500':
            case 'login':
            case 'forget_password':
            case 'reset_password':
            case null: // To avoid displaying dashboard temporarily before loading the correct route
                return EmptyLayout;
            default:
                switch (this.$store.state.role) {
                case 'organization_manager':
                    return OrganizationManagerLayout;
                case 'coordinator':
                    return CoordinatorLayout;
                case 'network_manager':
                    return NetworkManagerLayout;
                case 'case_manager':
                    return CaseManagerLayout;
                case 'facility_manager':
                    return FacilityManagerLayout;
                case null:
                    return EmptyLayout;
                default:
                    return EmptyLayout;
                }
            }
        },
    },
    created() {
        if (!localStorage.getItem('lang')) {
            localStorage.setItem('lang', 'en');
        }
        this.$i18n.locale = localStorage.getItem('lang');
    },
};
</script>

<style>
.disable-events {
  pointer-events: none
}
</style>
