<template>
    <v-app v-if="isLoaded" id="inspire">
        <v-toolbar :clipped-left="false" flat :scroll-threshold="1" :scroll-off-screen="false" app class="toolbar" tabs>
            <v-toolbar-side-icon @click.stop="drawer = !drawer" />
            <v-toolbar-title>
                {{ organizationObject.name | title }}
                <span v-if="userObject.facility_name" style="font-size: 18px; color: gray;"> [{{ userObject.facility_name | title }}]</span>
                <span v-if="isToolbarActiveFlag" :style="titleStyle"> {{ name || ' - ' | title }} &nbsp;&nbsp;</span>
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
                                Case Manager
                            </div>
                        </span>
                        <v-icon>keyboard_arrow_down</v-icon>
                    </v-btn>
                    <v-list subheader dense>
                        <v-list-tile @click="profileView()">
                            <v-list-tile-title>Profile</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="logout">
                            <v-list-tile-title>Log out</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
            <template v-slot:extension v-if="$route.meta.toolbar">
                <v-tabs v-model="tab" color="transparent" align-with-title class="ml-0 pl-0">
                    <v-tabs-slider color="#FBA621" />
                    <v-tab :ripple="false" :to="`/cases/${$route.params.id}/info`">Case</v-tab>
                    <v-tab :ripple="false" :to="`/cases/${$route.params.id}/additional-info`">Additional info</v-tab>
                    <v-tab v-if="caseObject.status!=='inactive'" :ripple="false" :to="`/cases/${$route.params.id}/alerts`">Alerts</v-tab>
                    <v-tab v-if="caseObject.status!=='inactive'" :ripple="false" :to="`/cases/${$route.params.id}/feedbacks`">Facts</v-tab>
                    <v-tab v-if="caseObject.status!=='inactive'" :ripple="false" :to="`/cases/${$route.params.id}/volunteers`">Volunteers</v-tab>
                    <v-tab v-if="caseObject.status!=='inactive'" :ripple="false" :to="`/cases/${$route.params.id}/files`">Files</v-tab>
                    <v-tab v-if="caseObject.status!=='inactive'" :ripple="false" :to="`/cases/${$route.params.id}/places`">Places</v-tab>
                    <v-tab v-if="caseObject.status!=='inactive'" :ripple="false" :to="`/cases/${$route.params.id}/control`">Control</v-tab>
                    <v-tab v-if="caseObject.status!=='inactive'" :ripple="false" :to="`/cases/${$route.params.id}/analytics`">Analytics</v-tab>
                </v-tabs>
            </template>
        </v-toolbar>
        <v-navigation-drawer v-model="drawer" fixed app :dark="true" :floating="true" overflow>
            <v-toolbar flat class="transparent">
                <v-list class="pa-0">
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <img src="../assets/images/default_photo.png"/>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title><span style="font-size: 20px;">Child Rescue</span></v-list-tile-title>
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
                            <a href="#" class="body-2 black--text">EDIT</a>
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
import { CLEAR_TOKEN, SET_ROLE, SET_ORGANIZATION, SET_FACILITY } from '@/store/mutation-types';

export default {
    name: 'app',
    components: { Snackbar },
    mixins: [dates, filters, fonts],
    data: () => ({
        isLoaded: false,
        caseObject: null,
        tabs: false,
        tab: null,
        userObject: null,
        organizationObject: null,
        drawer: null,
        isToolbarActiveFlag: false,
        language: null,
        name: null,
        drawerItems: [
            {
                isActive: true,
                isEnabled: true,
                icon: 'dashboard',
                text: 'Dashboard',
                routerLink: '/',
            },
            {
                isActive: false,
                isEnabled: true,
                icon: 'list',
                text: 'Case Management',
                routerLink: '/cases',
            }, {
                isActive: false,
                isEnabled: false,
                icon: 'archive',
                text: 'Archived cases',
                routerLink: '',
            },
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
                    'font-size': '18px',
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
        this.loadData();
        this.initEvents();
    },
    methods: {
        async invalidateToolbar() {
            if (this.isToolbarActive) {
                const { data: caseObject } = await CasesApi.get(this.$route.params.id);
                this.caseObject = caseObject;
                this.titleStyle.color = this.getColor();
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
            await UsersApi.logout();
            this.$store.commit(CLEAR_TOKEN);
            this.$router.push({ name: 'login' });
        },
        async loadData() {
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
</style>
