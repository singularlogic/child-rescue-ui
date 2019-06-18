<template>
    <div v-if="isLoaded">
        <h1>{{ count }}</h1>
        <v-layout>
            <v-flex xs12 sm12 md12 lg12 xl12 class="intro">
                <h2 style="margin-top: 20px; margin-left: 20px; color: #FFFFFF;">DASHBOARD</h2>
                <span
                    style="margin-left: 20px; color: #FFFFFF; font-size: large;">Overview of the child rescue platform</span>
            </v-flex>
        </v-layout>
        <v-layout class="intro-items" justify-center align-center wrap>
            <v-flex xs11 sm3 md3 lg3 id="intro-item1">
                <h4 style="font-size: large; color: #FFFFFF; margin-top: 5px; margin-left: 10px;">CASES</h4>
                <v-icon large dark style="float: right; margin-top: 10px;">folder_open</v-icon>
                <div style="font-size: 40px; color: #FFFFFF; margin-top: 0px; margin-left: 10px;">{{ getCases.length
                    }}
                </div>
                <div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;"> active cases</div>
            </v-flex>
            <v-flex xs11 sm3 md3 lg3 id="intro-item2">
                <h4 style="font-size: large; color: #FFFFFF; margin-top: 5px; margin-left: 10px;">VOLUNTEERS</h4>
                <v-icon large dark style="float: right; margin-top: 10px;">group</v-icon>
                <div style="font-size: 40px; color: #FFFFFF; margin-top: 0px; margin-left: 10px;">0</div>
                <div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;">0 new volunteers in
                    the last month
                </div>
            </v-flex>
            <v-flex xs11 sm3 md3 lg3 id="intro-item3">
                <h4 style="font-size: large; color: #FFFFFF; margin-top: 5px; margin-left: 10px;">FACTS</h4>
                <v-icon large dark style="float: right; margin-top: 10px;">folder_shared</v-icon>
                <div style="font-size: 40px; color: #FFFFFF; margin-top: 0px; margin-left: 10px;">{{ getFeedbacks.length
                    }}
                </div>
                <!--<div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;">50 feedbacks in-->
                <!--active cases-->
                <!--</div>-->
                <div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;">total facts
                </div>
            </v-flex>
        </v-layout>
        <v-layout row wrap style="margin-top: 5px;">
            <v-flex xs12 sm12 md12 lg6 xl6>
                <v-card flat tile style="margin: 10px 15px 0px 15px;">
                    <v-card-title><h2>ACTIVE CASES</h2></v-card-title>
                    <v-layout row wrap>
                        <v-flex v-if="getCases.length > 0" xs12 sm6 md3 lg6 xl4 v-for="item in getCases"
                                @click="loadCase(item)">
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
                            <!--<v-card tile style="padding: 5px; margin: 5px 15px 15px 15px;">-->
                            <!--<div class="tile_background">-->
                            <!--<v-layout justify-space-between class="tile_background_tags">-->
                            <!--<v-flex class="tile_background_tag_left"><span style="background-color: red; padding: 5px; border-radius: 2px;">Amber alert</span></v-flex>-->
                            <!--<v-flex class="tile_background_tag_right"><span style="background-color: green; padding: 5px; border-radius: 2px;">Closed</span></v-flex>-->
                            <!--</v-layout>-->
                            <!--</div>-->
                            <!--<div style="text-align: left; font-size: medium; font-weight: bold; margin-top: 10px;">{{ caseObject.personal_data.last_name }}  {{ caseObject.personal_data.first_name }}</div>-->
                            <!--<div style="text-align: left; color: #C0C0C0;">Missing from: {{ item.disappearance_date }}</div>-->
                            <!--</v-card>-->
                        </v-flex>
                        <v-flex v-if="getCases.length === 0" xs12 sm12 md12 lg12 xl12>
                            <v-jumbotron :gradient=true dark
                                         src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg">
                                <v-container fill-height>
                                    <v-layout align-center>
                                        <v-flex>
                                            <h3 class="display-3">No active cases!!</h3>
                                            <span class="subheading">Lorem ipsum dolor sit amet, pri veniam forensibus id. Vis maluisset molestiae id, ad semper lobortis cum. At impetus detraxit incorrupte usu, repudiare assueverit ex eum, ne nam essent vocent admodum.</span>
                                            <v-divider class="my-3"></v-divider>
                                            <div class="title mb-3">Check out our newest features!</div>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-jumbotron>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs12 sm12 md12 lg6 xl6>
                <v-card flat tile style="margin: 10px 15px 0px 15px;">
                    <v-card-title>
                        <h2>RECENT ACTIVITY</h2>
                        <v-spacer></v-spacer>
                        <!--<a href="#" style="text-decoration: none;"><h3>SEE ALL</h3></a>-->
                    </v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-tile v-for="(item, index) in logs" @click="">
                                <v-list-tile-content>
                                    <div :class="{ hasColor: index%2===0 }"
                                         style="text-align: left; font-size: medium; font-weight: bold;">{{ item.text }}
                                    </div>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                    <v-icon large>keyboard_arrow_right</v-icon>
                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { dates } from '@/utils/mixins';
import { Observable } from 'rxjs/Observable';


export default {
    mixins: [dates],
    created() {
    },
    subscriptions() {
        return {
            count: Observable.interval(1000)
                .filter((value) => value % 2 === 0)
        };
    },
    data() {
        return {
            count: 0,
            isLoaded: false,
            baseUrl: process.env.VUE_APP_BACKEND,
            // cases: [
            //     { image: "../assets/logo.png", name: 'Mpla mpla', dateOfDisappearance: "1/2/2007" },
            //     { image: "../assets/logo.png", name: 'Mpla mpla', dateOfDisappearance: "1/2/2007" },
            //     { image: "../assets/logo.png", name: 'Mpla mpla', dateOfDisappearance: "1/2/2007" },
            //     { image: "../assets/logo.png", name: 'Mpla mpla', dateOfDisappearance: "1/2/2007" },
            //     { image: "../assets/logo.png", name: 'Mpla mpla', dateOfDisappearance: "1/2/2007" },
            //     { image: "../assets/logo.png", name: 'Mpla mpla', dateOfDisappearance: "1/2/2007" },
            // ],
            logs: [
                { text: 'Evidence #1234 for Tony Montana case' },
                { text: 'New message in Rescue Team #3 for Tony Montana' },
                { text: 'Evidence #1234 for Tony Montana case' },
                { text: 'New message in Rescue Team #3 for Tony Montana' },
                { text: 'Evidence #1234 for Tony Montana case' },
                { text: 'New message in Rescue Team #3 for Tony Montana' },
                { text: 'Evidence #1234 for Tony Montana case' },
                { text: 'New message in Rescue Team #3 for Tony Montana' },
                { text: 'New message in Rescue Team #3 for Tony Montana' },
            ]
        };
    },
    mounted() {
        // this.googlePlaces = googlePlacesService();
        // this.googlePlaces.getPredictions('ath', (prediction) => {
        //     console.log('AAA');
        //     console.log(prediction);
        // });
        // this.googlePlaces.getPlace(predictionObject, callback);
        this.loadCases();
    },
    computed: {
        ...mapGetters('case_module', {
            getCases: 'getCases',
        }),
        ...mapGetters('feedback_module', {
            getFeedbacks: 'getFeedbacks',
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
            getActiveCasesAction: 'getActiveCasesAction',
        }),
        ...mapActions('feedback_module', {
            getAllFeedbacksAction: 'getAllFeedbacksAction',
        }),
        loadCase(caseObject) {
            this.$router.push({
                name: 'case',
                params: { id: caseObject.id }
            });
        },
        getImagePath(path) {
            if (path === null) {
                return require('../assets/logo.png');
            }

            if (this.baseUrl && this.baseUrl.length > 1) {
                return this.baseUrl + path;
            } else {
                return path;
            }
        },
        loadCases() {
            this.showLoaderMutation();
            this.getActiveCasesAction()
                .then((response) => {
                    this.hideLoaderMutation();
                    if (response.status === 200) {
                        // this.isLoaded = true;
                        this.loadAllFeedbacks();
                    } else {
                        this.showSnackbarMutation({
                            message: `Something went wrong: ${response.status}`,
                            status: 'error'
                        });
                    }
                    setTimeout(() => {
                        this.hideSnackbarMutation();
                    }, 3000);
                })
                .catch((error) => {
                    this.isLoaded = false;
                    this.hideLoaderMutation();
                    if (error.response) {
                        this.showSnackbarMutation({
                            message: error.response,
                            status: 'error'
                        });
                    } else {
                        this.showSnackbarMutation({
                            message: 'Network error',
                            status: 'error'
                        });
                    }
                    setTimeout(() => {
                        this.hideSnackbarMutation();
                    }, 3000);
                });
        },
        loadAllFeedbacks() {
            this.showLoaderMutation();
            this.getAllFeedbacksAction()
                .then((response) => {
                    this.hideLoaderMutation();
                    if (response.status === 200) {
                        this.isLoaded = true;
                    } else {
                        this.showSnackbarMutation({
                            message: `Something went wrong! - ${response.status}`,
                            status: 'error'
                        });
                    }
                    setTimeout(() => {
                        this.hideSnackbarMutation();
                    }, 3000);
                })
                .catch((error) => {
                    this.isLoaded = false;
                    this.hideLoaderMutation();
                    if (error.response) {
                        this.showSnackbarMutation({
                            message: error.response,
                            status: 'error'
                        });
                    } else {
                        this.showSnackbarMutation({
                            message: 'Network error',
                            status: 'error'
                        });
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
    .intro {
        background-color: #A4A4A4;
        height: 200px;
    }

    .intro-items {
        margin-top: -100px;
    }

    #intro-item1 {
        background-color: #B3D28B;
        padding: 10px;
        max-width: 335px;
        height: 140px;
        margin-top: 10px;
        margin-left: 2%;
        margin-right: 2%;
    }

    #intro-item2 {
        background-color: #3B5998;
        padding: 10px;
        max-width: 335px;
        height: 140px;
        margin-top: 10px;
        margin-left: 2%;
        margin-right: 2%;
    }

    #intro-item3 {
        background-color: #F4B350;
        padding: 10px;
        max-width: 335px;
        height: 140px;
        margin-top: 10px;
        margin-left: 2%;
        margin-right: 2%;
    }

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

    .hasColor {
        color: cornflowerblue;
    }
</style>
