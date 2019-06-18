<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="loaded" style="padding: 10px;">
        <v-breadcrumbs :items="linkItems">
            <template v-slot:divider>
                <v-icon>chevron_right</v-icon>
            </template>
        </v-breadcrumbs>
        <v-layout wrap>
            <v-flex xs12 sm12 md6 lg6 xl6>
                <v-layout>
                    <v-flex xs12 sm6 md4 lg4 xl4>
                        <v-select :items="sortItems" label="Sort by:" style="padding: 10px;"></v-select>
                    </v-flex>
                    <v-flex xs12 sm6 md4 lg4 xl4>
                        <v-select :items="sortItems" label="Filter by:" style="padding: 10px;"></v-select>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6 xl6>
                <v-layout align-center row fill-height reverse>
                    <v-flex xs12 sm12 md5 lg4 xl4>
                        <v-btn dark color="#F4B350" @click="loadCaseManagement">
                            <v-icon dark>add</v-icon>
                            Create case
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12 sm12 md12 lg12 xl12>
                <v-card v-if="getCases.length >= 1 " flat tile style="margin: 10px 15px 0px 15px;">
                    <v-card-title><h3>Cases ({{ getCases.length }})</h3></v-card-title>
                    <v-layout row wrap>
                        <v-flex xs12 sm6 md3 lg3 xl2 v-for="item in getCases" @click="loadCase(item)">
                            <v-card class="clickable_card" tile style="padding: 5px; margin: 5px 15px 15px 15px;">
                                <v-img :src="getImagePath(item.profile_photo)" height="165px" class="tile_background">
                                    <v-container fill-height fluid pa-2>
                                        <v-layout justify-space-between class="tile_background_tags">
                                            <v-flex v-if="item.amber_alert" class="tile_background_tag_left"><span
                                                style="background-color: red; padding: 5px; border-radius: 2px;">Amber alert</span>
                                            </v-flex>
                                            <v-flex v-if="item.status === 'closed'"
                                                    class="tile_background_tag_right"><span
                                                style="background-color: green; padding: 5px; border-radius: 2px;">{{ item.status }}</span>
                                            </v-flex>
                                            <v-flex v-if="item.status === 'active'"
                                                    class="tile_background_tag_right"><span
                                                style="background-color: #C3C3C3; padding: 5px; border-radius: 2px;">{{ item.status }}</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-img>
                                <div
                                    style="text-align: left; font-size: medium; font-weight: bold; margin-top: 10px;">
                                    {{ item.first_name }} {{ item.last_name }}
                                </div>
                                <div style="text-align: left; color: #C0C0C0;">Missing from: <b>{{
                                    item.disappearance_date | formatDateTimeMinutes }} </b>
                                </div>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-card>
                <v-jumbotron v-if="getCases.length < 1" :gradient=true dark src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg">
                    <v-container fill-height>
                        <v-layout align-center>
                            <v-flex>
                                <h3 class="display-3">No missing childs today!!</h3>
                                <span class="subheading">Lorem ipsum dolor sit amet, pri veniam forensibus id. Vis maluisset molestiae id, ad semper lobortis cum. At impetus detraxit incorrupte usu, repudiare assueverit ex eum, ne nam essent vocent admodum.</span>
                                <v-divider class="my-3"></v-divider>
                                <div class="title mb-3">Check out our newest features!</div>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-jumbotron>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { dates } from '@/utils/mixins';


export default {
    mixins: [dates],
    data() {
        return {
            loaded: false,
            baseUrl: process.env.VUE_APP_BACKEND,
            linkItems: [
                {
                    text: 'Home',
                    disabled: false,
                    href: '/dashboard',
                },
                {
                    text: 'Cases',
                    disabled: true,
                    href: '/cases',
                },
            ],
            sortItems: [
                {
                    text: 'Name',
                    value: 'name'
                },
                {
                    text: 'Date of disappearance',
                    value: 'disappearance_date'
                },
                {
                    text: 'Recently updated',
                    value: 'last_update'
                },
            ]
        };
    },
    mounted() {
        this.loadCases();
    },
    computed: {
        ...mapGetters('case_module', {
            getCases: 'getCases',
        }),
    },
    methods: {
        ...mapMutations('generic_module', {
            showSnackbarMutation: 'showSnackbarMutation',
            hideSnackbarMutation: 'hideSnackbarMutation',
            showLoaderMutation: 'showLoaderMutation',
            hideLoaderMutation: 'hideLoaderMutation',
        }),
        ...mapActions('case_module', {
            getCasesAction: 'getCasesAction',
        }),
        loadCase(caseObject) {
            this.$router.push({
                name: 'case',
                params: { id: caseObject.id }
            });
        },
        getImagePath(path) {
            if (path === null) {
                return require('../../assets/logo.png');
            }

            if (this.baseUrl && this.baseUrl.length > 1) {
                return this.baseUrl + path;
            } else {
                return path;
            }
        },
        loadCaseManagement() {
            this.$router.push({ name: 'case_new' });
        },
        loadCases() {
            this.showLoaderMutation();
            this.getCasesAction()
                .then((response) => {
                    this.hideLoaderMutation();
                    if (response.status === 200) {
                        this.loaded = true;
                    } else {
                        this.showSnackbarMutation({ message: `Something went wrong: ${response.status}`, status: 'error' });
                    }
                    setTimeout(() => {
                        this.hideSnackbarMutation();
                    }, 3000);
                })
                .catch((error) => {
                    this.loaded = false;
                    this.hideLoaderMutation();
                    if (error.response) {
                        this.showSnackbarMutation({ message: error.response, status: 'error' });
                    } else {
                        this.showSnackbarMutation({ message: "Network error", status: 'error' });
                    }
                    setTimeout(() => {
                        this.hideSnackbarMutation();
                    }, 3000);
                });
        },
    }
};
</script>

<style scoped>
    .tile_background {
        height: 165px;
        background-color: #C3C3C3;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    .tile_background_tags {
        position: relative;
        top: calc(100% - 30px);
        padding: 5px;
    }

    .tile_background_tag_left {
        color: #ffffff;
        font-weight: bold;
        text-align: left;
    }

    .tile_background_tag_right {
        color: #ffffff;
        font-weight: bold;
        text-align: right;
    }

    .clickable_card:hover .tile_background {
        transform: scale(1.02);
    }

    .clickable_card:hover {
        cursor: pointer;
    }
</style>
