<template>
    <v-app v-if="isLoaded" id="inspire">
        <v-toolbar :clipped-left="false" :scroll-threshold="1" :scroll-off-screen="false" app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer" />
            <v-toolbar-title>{{ organizationObject.name }}<span v-if="userObject.facility_name" style="font-size: 18px; color: gray;"> [{{ userObject.facility_name }}] &nbsp;&nbsp;</span></v-toolbar-title>
            <v-spacer />
            <v-toolbar-items>
                <v-menu transition="slide-y-transition" offset-y>
                    <v-btn slot="activator" icon large>
                        <v-badge color="red" overlap>
                            <v-icon>message</v-icon>
                        </v-badge>
                    </v-btn>
                </v-menu>
                <v-menu transition="slide-y-transition" offset-y>
                    <v-btn slot="activator" icon large>
                        <v-icon>notifications</v-icon>
                        <!-- <v-badge color="red" overlap>
                            <span slot="badge">2</span>
                            <v-icon>notifications</v-icon>
                        </v-badge> -->
                    </v-btn>
                    <v-list subheader dense style="min-width: 400px; max-width: 400px;">
                        <div
                            style="padding: 5px; text-align: center; font-size: large; font-weight: bold;"
                        >Notifications</div>
                        <v-list-tile @click avatar>
                            <v-list-tile-avatar>
                                <img src="../assets/logo.png" />
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-sub-title>John Snow created a new case.</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-icon small color="red">fiber_manual_record</v-icon>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                    <v-list>
                        <v-divider />
                        <v-list-tile class="text-md-center">
                            <v-list-tile-title
                                class="text-md-center"
                                style="color: #1976d2; font-weight: bold;"
                            >
                                See all
                                activity
                            </v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-menu transition="slide-y-transition" offset-y>
                    <v-btn slot="activator" flat large>
                        <span style="margin-left: 10px; margin-right: 10px; white-space: normal;">
                            <div style="fontSize: 20px" class="text-uppercase">
                                {{ userObject.first_name }} {{ userObject.last_name }}
                            </div>
                            <div v-if="userObject.role==='facility_manager'"
                                 style="color: gray; fontSize: 12px; text-align: right; margin-top: -5px;"
                                 class="text-lowercase">
                                facility manager
                            </div>
                            <div v-if="userObject.role==='case_manager'"
                                 style="color: gray; fontSize: 12px; text-align: right; margin-top: -5px;"
                                 class="text-lowercase">
                                case manager
                            </div>
                        </span>
                        <v-icon>keyboard_arrow_down</v-icon>
                    </v-btn>
                    <v-list subheader dense>
                        <v-list-tile @click="profileView">
                            <v-list-tile-title>Profile</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="logout">
                            <v-list-tile-title>Log out</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
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
                    <v-layout v-if="item.heading" :key="item.heading" row align-center>
                        <v-flex xs6>
                            <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
                        </v-flex>
                        <v-flex xs6 class="text-xs-center">
                            <a href="#" class="body-2 black--text">EDIT</a>
                        </v-flex>
                    </v-layout>
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
            <v-progress-linear
                :indeterminate="true"
                dense
                color="secondary"
                height="4"
                :active="isLoading"
                class="progress-bar"
            ></v-progress-linear>
            <slot></slot>
            <snackbar></snackbar>
        </v-content>
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import { bus } from '../main';
import { Snackbar } from '@/components';
import { UsersApi, OrganizationsApi } from '@/api';
import { CLEAR_TOKEN, SET_ROLE, SET_ORGANIZATION, SET_FACILITY } from '@/store/mutation-types';


export default {
    name: 'app',
    components: { Snackbar },
    data: () => ({
        isLoaded: false,
        userObject: null,
        organizationObject: null,
        drawer: null,
        language: null,
        drawerItems: [
            {
                isActive: true,
                isEnabled: true,
                icon: 'dashboard',
                text: 'Dashboard',
                routerLink: '/',
            },
        ],
    }),
    computed: {
        ...mapGetters(['isLoading']),
    },
    created() {
        this.loadData();
        this.initEvents();
        // this.language = localStorage.getItem('lang');
    },
    methods: {
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

            this.$store.commit(SET_ROLE, { response: userObject });
            this.$store.commit(SET_ORGANIZATION, { response: organizationObject });
            this.$store.commit(SET_FACILITY, { response: userObject });
            if (userObject.role === 'facility_manager') {
                this.drawerItems.push({
                    isActive: false,
                    isEnabled: true,
                    icon: 'folder',
                    text: 'Children Registry',
                    routerLink: '/children_registry',
                });
                this.drawerItems.push({
                    isActive: false,
                    isEnabled: true,
                    icon: 'list',
                    text: 'Manage Facility',
                    routerLink: '/manage_facility',
                });
            } else if (userObject.role === 'case_manager') {
                this.drawerItems.push({
                    isActive: false,
                    isEnabled: true,
                    icon: 'list',
                    text: 'Case Management',
                    routerLink: '/cases',
                });
                this.drawerItems.push({
                    isActive: false,
                    isEnabled: false,
                    icon: 'map',
                    text: 'Collaboration spaces',
                    routerLink: '',
                });
                this.drawerItems.push({
                    isActive: true,
                    isEnabled: true,
                    icon: 'notification_important',
                    text: 'Alerts',
                    routerLink: '/alerts',
                });
                this.drawerItems.push({
                    isActive: false,
                    isEnabled: false,
                    icon: 'assessment',
                    text: 'Analytics',
                    routerLink: '',
                });
                this.drawerItems.push({
                    isActive: false,
                    isEnabled: false,
                    icon: 'archive',
                    text: 'Archived cases',
                    routerLink: '',
                });
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
    },
};
</script>

<style lang="scss">
.progress-bar {
    margin: -2px !important;
}
</style>
