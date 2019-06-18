<template>
    <div v-if="isLoaded">
        <v-toolbar :clipped-left=false :scroll-threshold="1" :scroll-off-screen="false" app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"/>
            <v-toolbar-title>Child Rescue</v-toolbar-title>
            <v-spacer/>
            <v-menu transition="slide-y-transition" offset-y>
                <v-btn slot="activator" icon large>
                    <v-badge color="red" overlap>
                        <v-icon>message</v-icon>
                    </v-badge>
                </v-btn>
            </v-menu>
            <v-menu transition="slide-y-transition" offset-y>
                <v-btn slot="activator" icon large>
                    <v-badge color="red" overlap>
                        <span slot="badge">2</span>
                        <v-icon>notifications</v-icon>
                    </v-badge>
                </v-btn>
                <v-list subheader dense style="min-width: 400px; max-width: 400px;">
                    <div style="padding: 5px; text-align: center; font-size: large; font-weight: bold;">Notifications
                    </div>
                    <v-list-tile @click="" avatar>
                        <v-list-tile-avatar>
                            <img src="../assets/logo.png">
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-sub-title>
                                John Snow created a new case.
                            </v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-icon small color="red">fiber_manual_record</v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
                <v-list>
                    <v-divider/>
                    <v-list-tile class="text-md-center" @click="">
                        <v-list-tile-title class="text-md-center" style="color: #1976d2; font-weight: bold;">See all
                            activity
                        </v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
            <v-menu transition="slide-y-transition" offset-y>
                <v-btn slot="activator" flat large>
                    <div style="margin-left: 10px; margin-right: 10px;">{{ getUser.first_name }} {{ getUser.last_name
                        }}
                    </div>
                    <v-icon>keyboard_arrow_down</v-icon>
                </v-btn>
                <v-list subheader dense>
                    <v-subheader>General</v-subheader>
                    <v-list-tile @click="logout">
                        <v-list-tile-title>Profile</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="logout">
                        <v-list-tile-title>Log out</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-toolbar>
        <v-navigation-drawer v-model="drawer" fixed app :dark="true" :floating="true" overflow>
            <div class="drawer_header">
                <div class="drawer_header_logo_layer"></div>
            </div>
            <v-list>
                <template v-for="(item, index) in drawerItems">
                    <v-layout v-if="item.heading" :key="item.heading" row align-center>
                        <v-flex xs6>
                            <v-subheader v-if="item.heading">
                                {{ item.heading }}
                            </v-subheader>
                        </v-flex>
                        <v-flex xs6 class="text-xs-center">
                            <a href="#" class="body-2 black--text">EDIT</a>
                        </v-flex>
                    </v-layout>
                    <v-list-group v-else-if="item.children" v-model="item.model" :key="item.text"
                                  :append-icon="item.model ? item.appendIcon : item.appendIconAlt"
                                  :prepend-icon="item.icon">
                        <v-list-tile slot="activator">
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ item.text }}
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile v-for="(child, i) in item.children" :key="i" @click="handleRouter(child)"
                                     :class="{ active_drawer: child.isActive }">
                            <v-list-tile-action v-if="child.icon">
                                <v-icon></v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ child.text }}
                                </v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action v-if="child.icon">
                                <v-icon small>{{ child.icon }}</v-icon>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list-group>
                    <v-list-tile v-else :key="item.text" @click="handleRouter(item)"
                                 :class="{ active_drawer: item.isActive }">
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                {{ item.text }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action v-if="item.tag === 'new'">
                            <v-chip color="orange" text-color="white" small>
                                <v-icon small>star</v-icon>
                                {{ item.tag }}
                            </v-chip>
                        </v-list-tile-action>
                        <v-list-tile-action v-if="item.tag === 'coming soon'">
                            <v-tooltip right>
                                <v-chip slot="activator" color="secondary" outline small>
                                    {{ item.tag }}
                                </v-chip>
                                <span>This feature will be implemented in future update.<br>Subscribe to our mailing list to stay tuned!</span>
                            </v-tooltip>
                        </v-list-tile-action>
                    </v-list-tile>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-content>
            <v-progress-linear :indeterminate="true" color="secondary" height="3"
                               :active="getLoader"></v-progress-linear>
            <v-layout justify-center align-center>
                <v-flex xs12 sm12 md12 lg12 xl12>
                    <router-view/>
                </v-flex>
            </v-layout>
        </v-content>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    name: 'Main',
    components: {},
    data: () => ({
        drawer: null,
        isLoaded: true,
        drawerItems: [
            {
                isActive: true,
                icon: 'dashboard',
                text: 'Dashboard',
                routerLink: '/dashboard'
            },
            {
                isActive: false,
                icon: 'assessment',
                text: 'Analytics',
                routerLink: ''
            },
            {
                isActive: false,
                icon: 'list',
                text: 'Cases Management',
                routerLink: '/cases'
            },
            {
                isActive: false,
                icon: 'map',
                text: 'Collaboration spaces',
                routerLink: ''
            },
            {
                isActive: false,
                icon: 'notification_important',
                text: 'Alerts',
                routerLink: '/alerts'
            },
            {
                isActive: false,
                icon: 'archive',
                text: 'Archived cases',
                routerLink: ''
            },
        ],
    }),
    created() {
        this.loadData();
        this.$i18n.locale = 'en';
    },
    computed: {
        ...mapGetters('generic_module', {
            getIsSnackbarShown: 'getIsSnackbarShown',
            getSnackbarMessage: 'getSnackbarMessage',
            getLoader: 'getLoader',
        }),
        ...mapGetters('user_module', {
            getUser: 'getUser',
        }),
    },
    methods: {
        ...mapActions('user_module', {
            logoutUserAction: 'logoutUserAction',
            getUserInfoAction: 'getUserInfoAction',
        }),
        logout() {
            this.logoutUserAction({ router: this.$router });
        },
        handleRouter(item) {
            this.drawerItems.forEach(function (object, index) {
                object.isActive = false;
                if (object.children) {
                    object.children.forEach(function (child, index) {
                        child.isActive = false;
                    });
                }
            });
            item.isActive = true;
            this.$router.push(item.routerLink);
        },
        loadData() {
            this.getUserInfoAction()
                .then((response) => {

                })
                .catch((error) => {
                    this.hideLoaderMutation();
                    if (error.response) {
                    }
                    this.showSnackbarMutation({
                        message: 'Network error',
                        status: 'error'
                    });
                    setTimeout(() => {
                        this.hideSnackbarMutation();
                    }, 3000);
                });
        },
    },
};
</script>

<style scoped>

    .v-progress-linear {
        margin: 0 !important;
        position: fixed;
        z-index: 100;
    }

    .drawer_header {
        background-color: #505761;
        width: 100%;
        height: 65px;
    }

    .drawer_header_logo_layer {
        margin: 0;
        position: relative;
        top: calc(50% - 50px);
        left: calc(50% - 100px);
        width: 200px;
        height: 100px;
        background-image: url("../assets/header_icon.png");
        background-repeat: no-repeat;
        background-position: center center;
    }

    .tag-round {
        float: right;
        background-color: red;
        color: white;
        padding-left: 5px;
        padding-right: 5px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: bold;
    }

    .active_drawer {
        border-left: 2px solid #F4B350;
    }
</style>
