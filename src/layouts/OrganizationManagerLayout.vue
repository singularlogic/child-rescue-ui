<template>
    <v-app v-if="isLoaded" id="inspire">
        <v-toolbar :clipped-left="false" flat :scroll-threshold="1" :scroll-off-screen="false" app class="toolbar" tabs>
            <v-toolbar-side-icon @click.stop="drawer = !drawer" />
            <v-toolbar-title>
                <span v-if="$route.meta.title">{{ $t($route.meta.title) }}&nbsp;&nbsp;</span>
                <v-icon color="black" v-if="isToolbarActiveFlag">forward</v-icon>
                <span v-if="isToolbarActiveFlag" :style="titleStyle"><b> {{ name || ' - ' | title }} &nbsp;&nbsp;</b></span>
            </v-toolbar-title>
            <v-spacer />
            <v-toolbar-items>
                <v-menu transition="slide-y-transition" offset-y>
                    <v-btn slot="activator" flat small>
                        <span>
                            <div style="fontSize: 20px" class="text-uppercase">
                                {{ userObject.first_name }} {{ userObject.last_name }}
                            </div>
                            <div style="color: gray; fontSize: 12px; text-align: right; margin-top: -5px;"
                                 class="text-lowercase">
                                {{ $t('layouts.organization_manager') }}
                            </div>
                        </span>
                        <v-icon>keyboard_arrow_down</v-icon>
                    </v-btn>
                    <v-list subheader dense>
                        <v-list-tile @click="profileView()">
                            <v-list-tile-title>{{ $t('layouts.profile') }}</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="logout">
                            <v-list-tile-title>{{ $t('layouts.log_out') }}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
            <template v-slot:extension v-if="$route.meta.toolbar && caseObject.status!=='archived' && caseObject.status!==null && caseObject.status!==undefined">
                <v-tabs v-model="tab" color="transparent" align-with-title class="ml-0 pl-0">
                    <v-tabs-slider color="#FBA621" />
                    <v-tab :ripple="false" :to="`/cases/${$route.params.id}/info`">{{ $t('layouts.case') }}</v-tab>
                    <v-tab :ripple="false" :to="`/cases/${$route.params.id}/additional-info`">{{ $t('layouts.additional_info') }}</v-tab>
                    <v-tab v-if="caseObject.status!=='inactive' && caseObject.organization===$store.state.organizationId" :ripple="false" :to="`/cases/${$route.params.id}/alerts`">{{ $t('layouts.alerts') }}</v-tab>
                    <v-tab v-if="caseObject.status!=='inactive' && caseObject.organization===$store.state.organizationId" :ripple="false" :to="`/cases/${$route.params.id}/feedbacks`">{{ $t('layouts.facts') }}</v-tab>
                    <v-tab v-if="caseObject.status!=='inactive' && caseObject.organization===$store.state.organizationId" :ripple="false" :to="`/cases/${$route.params.id}/volunteers`">{{ $t('layouts.volunteers') }}</v-tab>
                    <v-tab v-if="caseObject.status!=='inactive'" :ripple="false" :to="`/cases/${$route.params.id}/files`">{{ $t('layouts.files') }}</v-tab>
                    <v-tab v-if="caseObject.status!=='inactive' && caseObject.organization===$store.state.organizationId" :ripple="false" :to="`/cases/${$route.params.id}/places`">{{ $t('layouts.places') }}</v-tab>
                    <v-tab v-if="caseObject.status!=='inactive' && caseObject.organization===$store.state.organizationId" :ripple="false" :to="`/cases/${$route.params.id}/control`">{{ $t('layouts.control') }}</v-tab>
                    <v-tab v-if="caseObject.organization===$store.state.organizationId" :ripple="false" :to="`/cases/${$route.params.id}/analytics`">{{ $t('layouts.analytics') }}</v-tab>
                </v-tabs>
            </template>
        </v-toolbar>
        <v-navigation-drawer v-model="drawer" fixed app :dark="true" :floating="true" overflow>
            <v-toolbar flat class="transparent">
                <v-list class="pa-0">
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <img :src="organizationObject.logo"/>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title style="font-size: 20px;">{{ organizationObject.name | title }}</v-list-tile-title>
                            <v-list-tile-sub-title>{{ userObject.facility_name | title }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-toolbar>
            <v-list style="padding-top:0px;">
                <v-divider></v-divider>
                <template v-for="(item) in drawerItems">
                    <v-row v-if="item.heading" :key="item.heading"  align="center">
                        <v-col cols="6">
                            <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
                        </v-col>
                        <v-col cols="6" class="text-center">
                            <a href="#" class="body-2 black--text">{{ $t('layouts.edit') }}</a>
                        </v-col>
                    </v-row>
                    <v-list-group
                        v-else-if="item.children"
                        v-model="item.model"
                        :key="item.text"
                        :append-icon="item.model ? item.appendIcon : item.appendIconAlt"
                        :prepend-icon="item.icon"
                    >
                        <v-list-tile slot="activator">
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile
                            v-for="(child, i) in item.children"
                            :key="i"
                            @click="handleRouter(child)"
                            :class="{ active_drawer: child.isActive }"
                        >
                            <v-list-tile-action v-if="child.icon">
                                <v-icon></v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{ child.text }}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action v-if="child.icon">
                                <v-icon small>{{ child.icon }}</v-icon>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list-group>
                    <v-list-tile
                        v-else
                        :key="item.text"
                        @click="handleRouter(item)"
                        :class="{ active_drawer: item.isActive }"
                        :disabled="item.isEnabled === false"
                    >
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action v-if="item.tag === 'new'">
                            <v-chip color="orange" text-color="white" small>
                                <v-icon small>star</v-icon>
                                {{ item.tag }}
                            </v-chip>
                        </v-list-tile-action>
                        <v-list-tile-action v-if="item.tag === 'coming soon'">
                            <v-tooltip right>
                                <v-chip
                                    slot="activator"
                                    color="secondary"
                                    outline
                                    small
                                >{{ item.tag }}</v-chip>
                                <span>
                                    This feature will be implemented in future update.
                                    <br />Subscribe to our mailing list to stay tuned!
                                </span>
                            </v-tooltip>
                        </v-list-tile-action>
                    </v-list-tile>
                </template>
            </v-list>
            <v-toolbar @click="goToSite()" flat class="transparent clickable" style="position: absolute; bottom: 0px;">
                <v-list class="pa-0">
                    <v-divider></v-divider>
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <img src="../assets/images/default_photo.png"/>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title><span style="font-size: 20px;">{{ $t('layouts.child_rescue') }}</span></v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-toolbar>
        </v-navigation-drawer>
        <v-content>
            <v-progress-linear :indeterminate="true" dense color="secondary" height="4" :active="isLoading" class="progress-bar"></v-progress-linear>
            <slot></slot>
            <snackbar></snackbar>
        </v-content>
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import { bus } from '../main';
import { Snackbar } from '@/components';
import { UsersApi, OrganizationsApi, CasesApi } from '@/api';
import { dates, filters, fonts } from '@/utils/mixins';
import { CLEAR_TOKEN, SET_ROLE, SET_ORGANIZATION, SET_FACILITY, SET_REFRESH_CONTROL, SET_REFRESH_FEED, SET_REFRESH_FEEDBACKS, SET_REFRESH_VOLUNTEERS, SET_SHOW_ALERTS, SET_SHOW_FACTS, SET_SHOW_POI, SET_SHOW_ANALYTICS, SET_SHOW_VOLUNTEERS } from '@/store/mutation-types';


export default {
    name: 'app',
    components: { Snackbar },
    mixins: [dates, filters, fonts],
    data: () => ({
        isLoaded: false,
        caseObject: {status: ""},
        tabs: false,
        tab: null,
        userObject: null,
        organizationObject: null,
        drawer: null,
        isToolbarActiveFlag: false,
        language: null,
        name: null,
        drawerItems: [
        ],
    }),
    computed: {
        ...mapGetters(['isLoading']),
        isToolbarActive: {
            get() {
                return this.$route.meta.toolbar;
            },
        },
        titleStyle: {
            get() {
                return {
                    // 'font-size': '28px',
                    color: 'grey',
                };
            },
        },
    },
    watch: {
        isToolbarActive: {
            deep: true,
            async handler() {
                await this.invalidateToolbar();
            },
        },
    },
    created() {
        this.drawerItems.push(
            {
                isActive: true,
                isEnabled: true,
                icon: 'dashboard',
                text: this.$t('layouts.dashboard'),
                routerLink: '/',
            },
            {
                isActive: false,
                isEnabled: true,
                icon: 'business',
                text: this.$t('layouts.organization_management'),
                routerLink: '/organization',
            },
            {
                isActive: false,
                isEnabled: true,
                icon: 'store',
                text: this.$t('layouts.facility_management'),
                routerLink: '/facilities',
            },
            {
                isActive: false,
                isEnabled: true,
                icon: 'group',
                text: this.$t('layouts.user_management'),
                routerLink: '/users',
            },
            {
                isActive: false,
                isEnabled: true,
                icon: 'list',
                text: this.$t('layouts.case_management'),
                routerLink: '/cases',
            },
            {
                isActive: false,
                isEnabled: true,
                icon: 'archive',
                text: this.$t('layouts.archived_case_management'),
                routerLink: '/archived-cases',
            },
        );
        this.loadData();
        this.initEvents();
    },
    methods: {
        goToSite() {
            window.location = "https://www.childrescue.eu/";
        },
        async invalidateToolbar() {
            if (this.isToolbarActive && this.$store.state.token !== null) {
                const { data: caseObject } = await CasesApi.get(this.$route.params.id);
                this.caseObject = caseObject;
                if (caseObject.status === "archived") {
                    const { data: caseObject } = await CasesApi.anonymizedCase(this.$route.params.id);
                    this.caseObject = caseObject;
                }
                // this.titleStyle.color = this.getColor();
                this.name = `${this.caseObject.first_name} ${this.caseObject.last_name}`;
                this.isToolbarActiveFlag = true;
            } else {
                this.isToolbarActiveFlag = false;
            }
        },
        handleRouter(item) {
            if (item.isEnabled) {
                this.drawerItems.forEach((object) => {
                    object.isActive = false;
                    if (object.children) {
                        object.children.forEach((child) => {
                            child.isActive = false;
                        });
                    }
                });
                item.isActive = true;
                this.$router.push(item.routerLink);
            }
        },
        async logout() {
            this.$store.commit(SET_REFRESH_CONTROL, false);
            this.$store.commit(SET_REFRESH_FEED, false);
            this.$store.commit(SET_REFRESH_FEEDBACKS, false);
            this.$store.commit(SET_REFRESH_VOLUNTEERS, false);
            this.$store.commit(SET_SHOW_ALERTS, false);
            this.$store.commit(SET_SHOW_FACTS, false);
            this.$store.commit(SET_SHOW_POI, false);
            this.$store.commit(SET_SHOW_ANALYTICS, false);
            this.$store.commit(SET_SHOW_VOLUNTEERS, false);
            await UsersApi.logout();
            this.$store.commit(CLEAR_TOKEN);
            this.$router.push({ name: 'login' });
        },
        async loadData() {
            if (this.$store.state.token !== null) {
            const { data: userObject } = await UsersApi.get();
                this.userObject = userObject;

                const { data: organizationObject } = await OrganizationsApi.get(this.userObject.organization);
                this.organizationObject = organizationObject;
                if (this.isToolbarActive) {
                    await this.invalidateToolbar();
                }
                this.$store.commit(SET_ROLE, { response: userObject });
                this.$store.commit(SET_ORGANIZATION, { response: organizationObject });
                this.$store.commit(SET_FACILITY, { response: userObject });
            }
            this.isLoaded = true;
        },
        initEvents() {
            bus.$off('reload-layout-event');
            bus.$on('reload-layout-event', () => {
                this.loadData();
            });
        },
        profileView() {
            this.$router.push({ name: 'profile' });
        },
        getColor() {
            if (this.caseObject.status === 'closed') {
                return 'green';
            }
            if (this.caseObject.status === 'active') {
                return '#555';
            }
            if (this.caseObject.status === 'inactive' && this.caseObject.presence_status !== 'transit') {
                return '#2FD1D4';
            }
            if (this.caseObject.presence_status === 'transit') {
                return '#800080';
            }
            return 'grey';
        },
    },
};
</script>

<style lang="scss">
.progress-bar {
    margin: -2px !important;
}
.toolbar {
    border-bottom: 1px solid #ddd;
    background-color: white;
}
.clickable:hover {
    cursor: pointer;
}
</style>
