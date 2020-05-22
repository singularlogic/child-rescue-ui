<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded">
        <v-card flat>
            <v-toolbar v-if="caseObject.status==='active' || caseObject.status==='inactive'" dense flat color="white">
                <div v-if="caseObject.amber_alert" class="text-xs-left">
                    <v-chip label color="red" text-color="white" style="font-size:18px; margin-left:-10px;">Amber Alert</v-chip>
                </div>
                <div style="font-size: x-large; font-weight: bold;">
                    <v-chip
                        v-if="caseObject.status === 'active'"
                        dark label
                        color="#555"
                    >missing</v-chip>
                    <v-chip
                        v-else-if="caseObject.presence_status === 'present'"
                        dark label
                        color="green"
                    >Present</v-chip>
                    <v-chip
                        v-else-if="caseObject.presence_status === 'not_present'"
                        dark label
                        color="#2FD1D4"
                    >Not Present</v-chip>
                    <v-chip
                        v-else-if="caseObject.presence_status === 'transit'"
                        dark label
                        color="#800080"
                    >Not Present</v-chip>
                </div>
                <v-spacer></v-spacer>
                <div v-if="caseObject.presence_status === 'transit' && this.$store.state.role==='facility_manager'" class="text-xs-right">
                    <v-btn :dark="caseObject.status !== 'active'" color="#2FD1D4" @click="addChilceToFacility(caseObject)">Accept transfer</v-btn>
                </div>
                <div v-else class="text-xs-right">
                    <v-btn v-if="caseObject.status==='active' && this.$caseManagerAndAbove.includes($store.state.role) ||
                        caseObject.status==='inactive' && this.$store.state.role==='facility_manager'" dark color="#F4B350" @click="loadEditCase()">Edit case</v-btn>
                    <v-btn v-if="caseObject.status==='active' && this.$caseManagerAndAbove.includes($store.state.role)" outline dark color="#000000" @click="closeCase()">CLOSE CASE</v-btn>
                    <v-btn v-if="caseObject.status==='inactive' && this.$store.state.role==='facility_manager'" :dark="caseObject.status !== 'active'" color="green" @click="setPresence('present')">PRESENT</v-btn>
                    <v-btn v-if="caseObject.status==='inactive' && this.$store.state.role==='facility_manager'" :dark="caseObject.status !== 'active'" color="#2FD1D4" @click="setPresence('not_present')">NON PRESENT</v-btn>
                    <v-btn v-if="caseObject.status==='inactive' && this.$store.state.role==='facility_manager'" :dark="caseObject.status !== 'active'" color="#800080" @click="setPresence('transit')">TRANSIT</v-btn>
                    <missing-report
                        v-if="caseObject.status==='inactive' && this.$store.state.role==='facility_manager'"
                        :case-id="caseObject.id"
                        :full-name="caseObject.full_name"
                    ></missing-report>
                </div>
            </v-toolbar>
            <v-toolbar v-if="caseObject.status==='closed' && this.$store.state.role!=='facility_manager'" dense flat color="white">
                <v-spacer></v-spacer>
                <div class="text-xs-right">
                    <v-btn dark color="#F4B350" @click="loadEditCase()">Edit case</v-btn>
                    <v-btn outline dark color="#000000" @click="archiveCase()">ARCHIVE CASE</v-btn>
                </div>
            </v-toolbar>
            <v-layout row wrap>
                <v-flex xs12 sm12 md5 lg5 xl5 style="padding: 10px;">
                    <v-img :src="getImagePath(caseObject.profile_photo)" height="350px"></v-img>
                </v-flex>
                <v-flex xs12 sm12 md7 lg7 xl7 style="padding: 12px;">
                    <v-layout align-center row wrap>
                        <v-flex xs12 sm12 md3>
                            <v-text-field
                                v-model="caseObject.first_name"
                                label="First name"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md3>
                            <v-text-field
                                v-model="caseObject.last_name"
                                label="Last name"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md3>
                            <v-text-field
                                :value="getAge(caseObject.date_of_birth)"
                                label="Age"
                                :class="{'disable-events': true }"
                                class="textField"
                                readonly
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md3>
                            <v-text-field
                                v-model="caseObject.nationality"
                                label="Nationality"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex v-if="caseObject.status==='active'" xs12 sm12 md6 lg6 xl6>
                            <v-text-field
                                v-model="caseObject.disappearance_location"
                                label="Disappearance location"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex v-if="caseObject.status==='active'" xs12 sm12 md6 lg6 xl6>
                            <v-text-field
                                v-model="caseObject.disappearance_date"
                                label="Disappearance date"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex v-if="caseObject.status==='active'" xs12 sm12 md6 lg6 xl6>
                            <v-text-field
                                v-model="caseObject.disappearance_type"
                                label="Disappearance type"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-textarea name="input-7-1"
                                        v-model="caseObject.default_message" box
                                        label="Default alert message"
                                        placeholder="Default alert message..." auto-grow
                                        rows="5" :class="{'disable-events': true }" class="textField"
                                        counter maxlength="5000">
                            </v-textarea>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <v-parallax v-if="caseObject.status!=='inactive'" dark style="background-color: #C3C3C3; height:250px; margin-left: 10px; margin-right: 10px;">
                <v-layout align-center column justify-center>
                    <h1 class="display-2 font-weight-thin mb-3">Related cases</h1>
                    <h4 class="subheading">No related cases yet...</h4>
                </v-layout>
            </v-parallax>
            <div v-if="caseObject.status!=='inactive'">
                <v-layout v-if="similarCases.length >= 1" row wrap style="margin-left: 10px; margin-right: 10px;">
                    <v-flex xs12>
                        <h2>Similar cases</h2>
                    </v-flex>
                    <v-flex fill-height>
                        <v-layout row wrap>
                            <v-flex xs12 sm6 md3 lg3 xl2 v-for="item in similarCases" :key="item.id" @click="loadSimilarCase(item)">
                                <v-card class="clickable_card" tile style="padding: 5px; margin: 5px 15px 15px 15px;">
                                    <v-img :src="getImagePath(item.profile_photo)" height="165px" class="tile_background">
                                        <v-container fill-height fluid pa-2>
                                            <v-layout justify-space-between class="tile_background_tags">
                                                <v-flex v-if="item.amber_alert" class="tile_background_tag_left">
                                                    <span style="background-color: red; padding: 5px; border-radius: 2px;">Amber alert</span>
                                                </v-flex>
                                                <v-flex v-if="item.status === 'closed'" class="tile_background_tag_right">
                                                    <span style="background-color: green; padding: 5px; border-radius: 2px;">{{ item.status }}</span>
                                                </v-flex>
                                                <v-flex v-if="item.status === 'active'" class="tile_background_tag_right">
                                                    <span style="background-color: #555; padding: 5px; border-radius: 2px;">{{ item.status }}</span>
                                                </v-flex>
                                                <v-flex v-if="item.status === 'archived'" class="tile_background_tag_right">
                                                    <span style="background-color: #8c3404; padding: 5px; border-radius: 2px;">{{ item.status }}</span>
                                                </v-flex>
                                                <v-flex v-if="item.status === 'inactive' && item.presence_status === 'transit'" class="tile_background_tag_right">
                                                    <span style="background-color: #800080; padding: 5px; border-radius: 2px;">transit</span>
                                                </v-flex>
                                                <v-flex v-if="item.status === 'inactive' && item.presence_status !== 'transit'" class="tile_background_tag_right">
                                                    <span style="background-color: #2FD1D4; padding: 5px; border-radius: 2px;">inactive</span>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-img>
                                    <div style="text-align: left; font-size: medium; font-weight: bold; margin-top: 10px;">
                                        {{ item.first_name | title }} {{ item.last_name | title }}
                                    </div>
                                <!-- <div v-if="item.status === 'inactive'" style="text-align: left; color: #C0C0C0;">
                                    Arrival at facility:<b>{{item.arrival_date | formatDate }}</b>
                                </div>
                                <div v-else style="text-align: left; color: #C0C0C0;">
                                    Missing from:<b>{{item.disappearance_date | formatDate }}</b>
                                </div> -->
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
                <v-parallax v-else dark style="background-color: #C3C3C3; height:250px; margin-top: 2px; margin-left: 10px; margin-right: 10px;">
                    <v-layout align-center column justify-center>
                        <h1 class="display-2 font-weight-thin mb-3">Similar cases</h1>
                        <h4 class="subheading">No similar cases yet...</h4>
                    </v-layout>
                </v-parallax>
            </div>
        </v-card>
    </div>
</template>

<script>
import moment from 'moment';
import { dates, filters, fonts } from '@/utils/mixins';
import { CasesApi, FeedbacksApi, FacilitiesApi } from '@/api';
import { SET_SNACKBAR_STATUS } from '@/store/mutation-types';

import MissingReport from '@/components/MissingReport.vue';


export default {
    components: {
        MissingReport,
    },
    mixins: [dates, filters, fonts],
    props: {
        id: { type: [String, Number], required: true },
    },
    data() {
        return {
            baseUrl: process.env.VUE_APP_BACKEND,
            isLoaded: false,
            caseObject: {},
            similarCases: [],
        };
    },
    async created() {
        await this.loadCase();
        if (this.caseObject.status !== 'inactive') {
            await this.loadSimilarCases();
        }
        this.isLoaded = true;
    },
    methods: {
        getAge(birthDate) {
            if (birthDate) {
                return `${Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)} years`;
            }
            return ' - ';
        },
        loadEditCase() {
            this.$router.push({ name: 'case_edit', params: { caseObjectProp: this.caseObject } });
        },
        async closeCase() {
            await CasesApi.close(this.id);
            this.$router.push({ name: 'cases' });
        },
        async archiveCase() {
            const { data: feedbacks } = await FeedbacksApi.all({ caseId: this.caseObject.id });
            this.feedbacks = feedbacks;
            let checkFeedbacks = true;
            feedbacks.forEach((feedback) => {
                if (feedback.is_valid === null || feedback.is_valid === undefined) {
                    checkFeedbacks = false;
                }
            });
            if (this.caseObject.disappearance_type == null || this.caseObject.disappearance_type === undefined) {
                this.$store.commit(SET_SNACKBAR_STATUS, { message: 'You must set disappearance type before archiving the case!', color: 'error' });
            } else if (this.caseObject.is_refugee == null || this.caseObject.is_refugee === undefined) {
                this.$store.commit(SET_SNACKBAR_STATUS, { message: 'You must set refugee before archiving the case!', color: 'error' });
            } else if (!checkFeedbacks) {
                this.$store.commit(SET_SNACKBAR_STATUS, { message: 'You must set set facts validation before archiving the case!', color: 'error' });
            } else {
                await CasesApi.archive(this.id);
                this.$router.push({ name: 'cases' });
                this.$store.commit(SET_SNACKBAR_STATUS, { message: 'Case has been archived!', color: 'primary' });
            }
        },
        getDate(value) {
            return moment(String(value)).format('YYYY-MM-DD HH:mm:ss');
        },
        async loadCase() {
            const { data: caseObject } = await CasesApi.get(this.id);
            this.caseObject = caseObject;
            console.log(caseObject);
            this.caseObject.disappearance_date = this.getDate(caseObject.disappearance_date);
        },
        async loadSimilarCases() {
            const { data: similarCases } = await CasesApi.getSimilarCases(this.id);
            console.log('SIMILAR CASES');
            console.log(similarCases);
            this.similarCases = similarCases;
        },
        getImagePath(path) {
            if (path === null) {
                return require('../../../assets/images/default_photo.png');
            }
            return path;
        },
        async setPresence(state) {
            const { data: response } = await CasesApi.setState(this.caseObject.id, { presence_status: state });
            const { data: caseObject } = await CasesApi.get(this.id);
            this.caseObject = caseObject;
        },
        async addChilceToFacility(caseObjecta) {
            console.log(caseObjecta);
            const { data: addChildResponse } = await FacilitiesApi.addChild(caseObjecta.child);
            const { data: caseObject } = await CasesApi.get(this.id);
            this.caseObject = caseObject;
        },
        loadSimilarCase(caseObject) {
            console.log('LOAD');
            console.log(caseObject);
            this.id = caseObject.id;
            this.loadCase();
            this.$router.push({
                name: 'case',
                params: { id: caseObject.id },
            });
        },
    },
};
</script>
<style scoped>
.textField {
    padding: 5px 15px;
}

.tile_background {
    height: 165px;
    background-color: #c3c3c3;
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
