<template>
    <div v-if="isLoaded">
        <v-layout>
            <v-flex xs12 sm12 md12 lg12 xl12 class="intro">
                <h2 style="margin-top: 20px; margin-left: 20px; color: #FFFFFF;">DASHBOARD</h2>
                <span v-if="role === 'case_manager'"
                      style="margin-left: 20px; color: #FFFFFF; font-size: large;">Overview of the Child Rescue case manager platform</span>
                <span v-if="role === 'facility_manager'"
                      style="margin-left: 20px; color: #FFFFFF; font-size: large;">Overview of the Child Rescue facility manager platform</span>
                <!-- <span v-if="role === 'facility_manager'"
                      style="margin-left: 20px; color: #FFFFFF; font-size: large;">Overview of {{ getFacility.name }} facility</span> -->
            </v-flex>
        </v-layout>
        <v-layout class="intro-items" justify-center align-center wrap v-if="role === 'case_manager'">
            <v-flex xs11 sm3 md3 lg3 class="intro-item1">
                <h4 style="font-size: large; color: #FFFFFF; margin-top: 5px; margin-left: 10px;">CASES</h4>
                <v-icon large dark style="float: right; margin-top: 10px;">folder_open</v-icon>
                <div style="font-size: 40px; color: #FFFFFF; margin-top: 0px; margin-left: 10px;">{{ cases.length }}</div>
                <div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;"> active cases</div>
            </v-flex>
            <v-flex xs11 sm3 md3 lg3 class="intro-item2">
                <h4 style="font-size: large; color: #FFFFFF; margin-top: 5px; margin-left: 10px;">ALERTS</h4>
                <v-icon large dark style="float: right; margin-top: 10px;">group</v-icon>
                <div style="font-size: 40px; color: #FFFFFF; margin-top: 0px; margin-left: 10px;">{{ alerts.length }}</div>
                <div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;"> active alerts
                </div>
            </v-flex>
            <v-flex xs11 sm3 md3 lg3 class="intro-item3">
                <h4 style="font-size: large; color: #FFFFFF; margin-top: 5px; margin-left: 10px;">FACTS</h4>
                <v-icon large dark style="float: right; margin-top: 10px;">folder_shared</v-icon>
                <div style="font-size: 40px; color: #FFFFFF; margin-top: 0px; margin-left: 10px;">{{ feedbacks.length }}</div>
                <div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;">total facts
                </div>
            </v-flex>
        </v-layout>
        <v-layout class="intro-items" justify-center align-center wrap v-if="role === 'facility_manager'">
            <v-flex xs11 sm3 md3 lg3 class="intro-item1">
                <h4 style="font-size: large; color: #FFFFFF; margin-top: 5px; margin-left: 10px;">HOSTED CHILDREN</h4>
                <v-icon large dark style="float: right; margin-top: 10px;">folder_open</v-icon>
                <div style="font-size: 40px; color: #FFFFFF; margin-top: 0px; margin-left: 10px;">{{ facilityCases.length }}</div>
                <div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;"> in facility</div>
            </v-flex>
            <v-flex xs11 sm3 md3 lg3 class="intro-item3">
                <h4 style="font-size: large; color: #FFFFFF; margin-top: 5px; margin-left: 10px;">MISSING CHILDREN</h4>
                <v-icon large dark style="float: right; margin-top: 10px;">folder_shared</v-icon>
                <div style="font-size: 40px; color: #FFFFFF; margin-top: 0px; margin-left: 10px;">
                    {{ missingCases.length }}
                </div>
                <div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;">Missing children in organisation
                </div>
            </v-flex>
            <v-flex xs11 sm3 md3 lg3 class="intro-item2">
                <h4 style="font-size: large; color: #FFFFFF; margin-top: 5px; margin-left: 10px;">REGISTRY</h4>
                <v-icon large dark style="float: right; margin-top: 10px;">group</v-icon>
                <div style="font-size: 40px; color: #FFFFFF; margin-top: 0px; margin-left: 10px;">{{ allCases.length }}</div>
                <div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;">All recorded children in organisation</div>
            </v-flex>
        </v-layout>
        <v-layout row wrap style="margin-top: 5px;">
            <v-flex xs12 sm12 md12 lg6 xl6 v-if="role === 'case_manager'">
                <v-card flat tile style="margin: 10px 15px 0px 15px;">
                    <v-card-title><h2>ACTIVE CASES</h2></v-card-title>
                    <v-layout row wrap style="min-height: 500px;">
                        <v-flex v-if="cases.length > 0" xs12 sm6 md3 lg6 xl4 v-for="item in cases" :key="item.id" @click="loadCase(item)">
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
                                                        style="background-color: #555; padding: 5px; border-radius: 2px;">{{ item.status }}</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-img>
                                <div
                                    style="text-align: left; font-size: medium; font-weight: bold; margin-top: 10px;">
                                    {{ item.first_name | title }} {{ item.last_name | title }}
                                </div>
                                <div style="text-align: left; color: #C0C0C0;">Missing from: <b>{{
                                    item.disappearance_date | formatDate }} </b>
                                </div>
                            </v-card>
                        </v-flex>
                        <v-flex v-if="cases.length === 0" xs12 sm12 md12 lg12 xl12 style="background-color: #C3C3C3;">
                            <v-layout row wrap align-center justify-center fill-height>
                                <h3 style="margin-top: -20px;" class="display-1">No records found.</h3>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs12 sm12 md12 lg8 xl8 v-if="role === 'facility_manager'">
                <v-card flat tile style="margin: 10px 15px 0px 15px;">
                    <v-card-title><h2>RECENTLY ARRIVED</h2></v-card-title>
                    <v-layout row wrap style="min-height: 500px;">
                        <v-flex v-if="facilityCases.length > 0" xs12 sm6 md3 lg3 xl3 v-for="item in facilityCases" :key="item.id" @click="loadFacilityCase(item)">
                            <v-card class="clickable_card" tile style="padding: 5px; margin: 5px 15px 15px 15px;">
                                <v-img :src="getImagePath(item.profile_photo)" height="165px" class="tile_background">
                                    <v-container v-if="item.status==='active'" fill-height fluid pa-2>
                                        <v-layout justify-space-between class="tile_background_tags">
                                            <v-flex class="tile_background_tag_right_red">
                                                <span style="background-color: #555; padding: 5px; border-radius: 2px;">missing</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                    <v-container v-if="item.status==='inactive'&&item.presence_status=='present'" fill-height fluid pa-2>
                                        <v-layout justify-space-between class="tile_background_tags">
                                            <v-flex class="tile_background_tag_right_red">
                                                <span style="background-color: green; padding: 5px; border-radius: 2px;">present</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                    <v-container v-if="item.status==='inactive'&&item.presence_status=='not_present'" fill-height fluid pa-2>
                                        <v-layout justify-space-between class="tile_background_tags">
                                            <v-flex class="tile_background_tag_right_red">
                                                <span style="background-color: #2FD1D4; padding: 5px; border-radius: 2px;">not present</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-img>
                                <div
                                    style="text-align: left; font-size: medium; font-weight: bold; margin-top: 10px;">
                                    {{ item.first_name | title }} {{ item.last_name | title }}
                                </div>
                                <div style="text-align: left; color: #C0C0C0;">Arrival at: <b>{{
                                    item.arrival_date | formatDate }} </b>
                                </div>
                            </v-card>
                        </v-flex>
                        <v-flex v-if="facilityCases.length === 0" xs12 sm12 md12 lg12 xl12 style="background-color: #C3C3C3;">
                            <v-layout row wrap align-center justify-center fill-height>
                                <h3 style="margin-top: -20px;" class="display-1">No children in this facility!</h3>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex v-if="role === 'case_manager'" xs12 sm12 md12 lg6 xl6>
                <v-layout row wrap>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <v-card flat tile style="margin: 10px 15px 0px 15px;">
                            <v-card-title><h2>RECENT ALERTS</h2></v-card-title>
                            <v-layout v-if="latestAlerts.length > 0" row wrap style="min-height: 213px;">
                                <v-flex>
                                    <v-list>
                                        <v-list-tile v-for="(item, index) in latestAlerts" :key="item.id" @click="openAlert(item)" style="height: 40px;">
                                            <v-list-tile-content>
                                                <div :class="{ hasColor: index%2===0 }"
                                                     style="text-align: left; font-size: medium; font-weight: bold;">Case: {{ item.case }} - Created: {{ item.start | formatDateTimeMinutes }}
                                                </div>
                                            </v-list-tile-content>
                                            <v-list-tile-action>
                                                <v-icon large>keyboard_arrow_right</v-icon>
                                            </v-list-tile-action>
                                        </v-list-tile>
                                    </v-list>
                                </v-flex>
                            </v-layout>
                            <v-layout v-else row wrap align-center style="min-height: 213px; background-color: #C3C3C3;">
                                <v-flex>
                                    <v-layout row wrap align-center justify-center fill-height>
                                        <h3 style="margin-top: -20px;" class="display-1">No alerts!</h3>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <v-card flat tile style="margin: 10px 15px 0px 15px;">
                            <v-card-title><h2>RECENT FACTS</h2></v-card-title>
                            <v-layout v-if="latestFeedbacks.length > 0" row wrap style="min-height: 213px;">
                                <v-flex>
                                    <v-list>
                                        <v-list-tile v-for="(item, index) in latestFeedbacks" :key="item.id" @click="openFeedback(item)" style="height: 40px;">
                                            <v-list-tile-content>
                                                <div :class="{ hasColor: index%2===0 }"
                                                     style="text-align: left; font-size: medium; font-weight: bold;">
                                                    Case: {{ item.case }} - Created: {{ item.created_at | formatDateTimeMinutes }} - Source: {{ item.source }}
                                                </div>
                                            </v-list-tile-content>
                                            <v-list-tile-action>
                                                <v-icon large>keyboard_arrow_right</v-icon>
                                            </v-list-tile-action>
                                        </v-list-tile>
                                    </v-list>
                                </v-flex>
                            </v-layout>
                            <v-layout v-else row wrap align-center style="min-height: 213px; background-color: #C3C3C3;">
                                <v-flex>
                                    <v-layout row wrap align-center justify-center fill-height>
                                        <h3 style="margin-top: -20px;" class="display-1">No facts!</h3>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex v-if="role === 'facility_manager'"  xs12 sm12 md12 lg4 xl4>
                <v-layout row wrap>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <v-card flat tile style="margin: 10px 15px 0px 15px;">
                            <v-card-title><h2>MISSING CHILDREN</h2></v-card-title>
                            <v-layout v-if="missingCases.length > 0" row wrap style="min-height: 500px;">
                                <v-flex>
                                    <v-list>
                                        <v-list-tile v-for="(item, index) in missingCases" :key="item.id" @click="loadFacilityCase(item)" style="height: 40px;">
                                            <v-list-tile-content>
                                                <div :class="{ hasColor: index%2===0 }"
                                                     style="text-align: left; font-size: medium; font-weight: bold;">{{ item.last_name | title }} {{ item.first_name | title }}, since: {{ item.disappearance_date | formatDateTimeMinutes }}
                                                </div>
                                            </v-list-tile-content>
                                            <v-list-tile-action>
                                                <v-icon large>keyboard_arrow_right</v-icon>
                                            </v-list-tile-action>
                                        </v-list-tile>
                                    </v-list>
                                </v-flex>
                            </v-layout>
                            <v-layout v-else row wrap align-center style="min-height: 500px; background-color: #C3C3C3;">
                                <v-flex>
                                    <v-layout row wrap align-center justify-center fill-height>
                                        <h3 style="margin-top: -20px;" class="display-1">No missing children!</h3>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <div v-show="false"><alert></alert></div>
        <div v-show="false"><feedback></feedback></div>
    </div>
</template>

<script>
import { bus } from '../main';
import { dates, fonts } from '@/utils/mixins';
import { CasesApi, AlertsApi, FeedbacksApi } from '@/api';
import Feedback from '@/components/Feedback.vue';
import Alert from '@/components/Alert.vue';

export default {
    components: {
        Alert,
        Feedback,
    },
    mixins: [dates, fonts],
    data() {
        return {
            cases: [],
            facilityCases: [],
            missingCases: [],
            allCases: [],
            alerts: [],
            latestAlerts: [],
            feedbacks: [],
            latestFeedbacks: [],
            count: 0,
            role: null,
            isLoaded: false,
        };
    },
    created() {
        this.role = this.$store.state.role;
        if (this.role === 'facility_manager') {
            this.loadFacilityCases();
        } else {
            this.loadCases();
        }
    },
    methods: {
        loadCase(caseObject) {
            this.$router.push({
                name: 'case',
                params: { id: caseObject.id },
            });
        },
        loadFacilityCase(facilityCaseObject) {
            this.$router.push({
                name: 'manage_facility_child',
                params: { id: facilityCaseObject.id },
            });
        },
        getImagePath(path) {
            if (path === null) {
                return require('../assets/images/default_photo.png');
            }
            return path;
        },
        async loadFacilityCases() {
            const { data: facilityCases } = await CasesApi.getFacilityCases();
            this.facilityCases = facilityCases;
            const { data: missingCases } = await CasesApi.all({ is_active: true });
            this.missingCases = missingCases;
            const { data: allCases } = await CasesApi.all();
            this.allCases = allCases;
            this.isLoaded = true;
        },
        async loadCases() {
            const { data: cases } = await CasesApi.all({ is_active: true });
            this.cases = cases;
            const { data: feedbacks } = await FeedbacksApi.all();
            this.feedbacks = feedbacks;
            const { data: alerts } = await AlertsApi.all({ is_active: true });
            this.alerts = alerts;
            const { data: latestAlerts } = await AlertsApi.latest();
            this.latestAlerts = latestAlerts;
            const { data: latestFeedbacks } = await FeedbacksApi.latest();
            this.latestFeedbacks = latestFeedbacks;
            this.isLoaded = true;
        },
        // goToAlerts(caseId) {
        //     this.$router.push({ name: 'alerts', params: { id: caseId } });
        // },
        openAlert(item) {
            bus.$emit('view-alert-dialog-event', item);
        },
        openFeedback(item) {
            bus.$emit('view-feedback-dialog-event', item);
        },
    },
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

    .intro-item1 {
        background-color: #B3D28B;
        padding: 10px;
        max-width: 335px;
        height: 140px;
        margin-top: 10px;
        margin-left: 2%;
        margin-right: 2%;
    }

    .intro-item2 {
        background-color: #3B5998;
        padding: 10px;
        max-width: 335px;
        height: 140px;
        margin-top: 10px;
        margin-left: 2%;
        margin-right: 2%;
    }

    .intro-item3 {
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

    .tile_background_tag_right_red {
        color: white;
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
