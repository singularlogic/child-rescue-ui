<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded" style="padding: 10px;">
        <v-layout>
            <v-flex xs12>
                <v-toolbar v-if="caseObject.status==='active' || caseObject.status==='inactive'">
                    <v-chip v-if="caseObject.organization!==$store.state.organizationId" label dark color="indigo lighten-2">
                        <v-icon left>folder_shared</v-icon>
                        <b>{{caseObject.organization_name}}</b>
                    </v-chip>
                    <v-chip v-if="caseObject.amber_alert" label dark color="warning">
                        <v-icon left>warning</v-icon>
                        <b>{{ $t('case_info.amber_alert') }}</b>
                    </v-chip>
                    <v-chip v-if="caseObject.status === 'active'" label dark color="blue-grey darken-3">
                        <v-icon left>person_search</v-icon>
                        <b>Missing</b>
                    </v-chip>
                    <v-chip v-else-if="caseObject.presence_status === 'present'" label dark color="green">
                        <v-icon left>person</v-icon>
                        <b>Present</b>
                    </v-chip>
                    <v-chip v-else-if="caseObject.presence_status === 'not_present'" label dark color="#2FD1D4">
                        <v-icon left>person</v-icon>
                        <b>Not Present</b>
                    </v-chip>
                    <v-chip v-else-if="caseObject.presence_status === 'transit'" label dark color="#800080">
                        <v-icon left>person</v-icon>
                        <b>Not Present</b>
                    </v-chip>
                    <v-spacer></v-spacer>
                    <div v-if="caseObject.presence_status === 'transit' && this.$store.state.role==='facility_manager'" class="text-xs-right">
                        <v-btn :dark="caseObject.status !== 'active'" color="#2FD1D4" @click="addChilceToFacility(caseObject)">{{ $t('case_info.accept_transfer') }}</v-btn>
                    </div>
                    <div v-if="caseObject.organization===$store.state.organizationId" class="text-xs-right">
                        <v-btn flat v-if="caseObject.status==='active' && this.$caseManagerAndAbove.includes($store.state.role) ||
                            caseObject.status==='inactive' && this.$store.state.role==='facility_manager'" dark color="#F4B350" @click="loadEditCase()">
                            {{ $t('case_info.edit_case') }}
                            <v-icon right dark>edit</v-icon>
                        </v-btn>
                        <v-btn flat v-if="caseObject.status==='active' && this.$caseManagerAndAbove.includes($store.state.role)" dark color="teal" @click="openCloseCaseDialog()">
                            {{ $t('case_info.close_case') }}
                            <v-icon right dark>search_off</v-icon>
                        </v-btn>
                        <v-btn v-if="caseObject.status==='inactive' && this.$store.state.role==='facility_manager'" :dark="caseObject.status !== 'active'" color="green" @click="setPresence('present')">{{ $t('case_info.present') }}</v-btn>
                        <v-btn v-if="caseObject.status==='inactive' && this.$store.state.role==='facility_manager'" :dark="caseObject.status !== 'active'" color="#2FD1D4" @click="setPresence('not_present')">{{ $t('case_info.not_present') }}</v-btn>
                        <v-btn v-if="caseObject.status==='inactive' && this.$store.state.role==='facility_manager'" :dark="caseObject.status !== 'active'" color="#800080" @click="setPresence('transit')">{{ $t('case_info.transit') }}</v-btn>
                        <missing-report
                            v-if="caseObject.status==='inactive' && this.$store.state.role==='facility_manager' && caseObject.presence_status === 'not_present'"
                            :case-id="caseObject.id"
                            :full-name="caseObject.full_name"
                        ></missing-report>
                    </div>
                </v-toolbar>
                <v-toolbar v-if="caseObject.status==='closed' && this.$store.state.role!=='facility_manager' && caseObject.organization===$store.state.organizationId">
                    <v-chip label dark color="teal darken-5">
                        <v-icon left>search_off</v-icon>
                        <b>{{ caseObject.status | title }}</b>
                    </v-chip>
                    <v-spacer></v-spacer>
                    <v-btn flat dark color="#F4B350" @click="loadEditCase()">
                        {{ $t('case_info.edit_case') }}
                        <v-icon right dark>edit</v-icon>
                    </v-btn>
                    <v-btn flat dark color="brown darken-1" @click="archiveCase()">
                        {{ $t('case_info.archive_case') }}
                        <v-icon right dark>archive</v-icon>
                    </v-btn>
                </v-toolbar>
                <br/>
                <v-card color="grey lighten-4" class="mb-2" style="padding: 15px;">
                    <v-layout row wrap>
                        <v-flex xs12 sm12 md5 lg5 xl5 style="padding: 10px;">
                            <v-img :src="getImagePath(caseObject.profile_photo)" height="350px"></v-img>
                        </v-flex>
                        <v-flex xs12 sm12 md7 lg7 xl7 style="padding: 12px;">
                            <v-layout align-center row wrap>
                                <v-flex xs12 sm12 md3>
                                    <v-text-field
                                        v-model="caseObject.first_name"
                                        :label="$t('case_info.first_name')"
                                        :class="{'disable-events': true }"
                                        class="textField"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md3>
                                    <v-text-field
                                        v-model="caseObject.last_name"
                                        :label="$t('case_info.last_name')"
                                        :class="{'disable-events': true }"
                                        class="textField"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md3>
                                    <v-text-field
                                        :value="getAge(caseObject.date_of_birth)"
                                        :label="$t('case_info.age')"
                                        :class="{'disable-events': true }"
                                        class="textField"
                                        readonly
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md3>
                                    <v-text-field
                                        v-model="caseObject.nationality"
                                        :label="$t('case_info.nationality')"
                                        :class="{'disable-events': true }"
                                        class="textField"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex v-if="caseObject.status==='active'" xs12 sm12 md6 lg6 xl6>
                                    <v-text-field
                                        v-model="caseObject.disappearance_location"
                                        :label="$t('case_info.disappearence_location')"
                                        :class="{'disable-events': true }"
                                        class="textField"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex v-if="caseObject.status==='active'" xs12 sm12 md6 lg6 xl6>
                                    <v-text-field
                                        v-model="caseObject.disappearance_date"
                                        :label="$t('case_info.disappearence_date')"
                                        :class="{'disable-events': true }"
                                        class="textField"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex v-if="caseObject.status==='active'" xs12 sm12 md6 lg6 xl6>
                                    <v-text-field
                                        v-model="caseObject.disappearance_type"
                                        :label="$t('case_info.disappearence_type')"
                                        :class="{'disable-events': true }"
                                        class="textField"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12 lg12 xl12>
                                    <v-textarea name="input-7-1"
                                                v-model="caseObject.default_message" box
                                                :label="$t('case_info.alert_message')"
                                                :placeholder="$t('case_info.alert_message_hint')" auto-grow
                                                rows="5" :class="{'disable-events': true }" class="textField"
                                                counter maxlength="5000">
                                    </v-textarea>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card>
                <v-card v-if="caseObject.status!=='inactive'" class="mb-2">
                    <v-toolbar flat style="background-color: white;">
                        <v-toolbar-title>{{ $t('case_info.linked_cases') }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn dark flat color="#2FD1D4" @click="openEditLinkedCaseDialog()">{{ $t('case_info.edit_linked_cases') }}</v-btn>
                    </v-toolbar>
                    <v-card-text v-if="linkedCases.length >= 1">
                        <v-layout row wrap>
                            <v-flex fill-height>
                                <v-layout row wrap>
                                    <v-flex xs12 sm6 md3 lg3 xl2 v-for="item in linkedCases" :key="item.id" @click="loadSimilarCase(item)">
                                        <v-card class="clickable_card" tile style="padding: 5px; margin: 5px 15px 15px 15px;">
                                            <v-img :src="getImagePath(item.profile_photo)" height="165px" class="">
                                                <v-container fluid pa-2>
                                                    <v-tooltip v-if="item.amber_alert" bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-chip v-on="on" small label dark color="warning">
                                                                <v-icon>warning</v-icon>
                                                            </v-chip>
                                                        </template>
                                                        <span><b>{{ $t('case_info.amber_alert') }}</b></span>
                                                    </v-tooltip>
                                                    <v-tooltip v-if="item.status === 'active'" bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-chip v-on="on" small label dark color="blue-grey darken-3">
                                                                <v-icon>person_search</v-icon>
                                                            </v-chip>
                                                        </template>
                                                        <span><b>Missing</b></span>
                                                    </v-tooltip>
                                                    <v-tooltip v-if="item.status === 'closed'" bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-chip v-on="on" small label dark color="teal darken-5">
                                                                <v-icon>search_off</v-icon>
                                                            </v-chip>
                                                        </template>
                                                        <span><b>{{ item.status | title }}</b></span>
                                                    </v-tooltip>
                                                    <v-tooltip v-if="item.status === 'archived'" bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-chip v-on="on" small label dark color="brown darken-1">
                                                                <v-icon>archive</v-icon>
                                                            </v-chip>
                                                        </template>
                                                        <span><b>{{ item.status | title }}</b></span>
                                                    </v-tooltip>
                                                    <v-tooltip v-if="item.status === 'inactive' && item.presence_status === 'transit'" bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-chip v-on="on" small label dark color="pink darken-1">
                                                                <v-icon>local_taxi</v-icon>
                                                            </v-chip>
                                                        </template>
                                                        <span><b>{{ $t('case_info.transit_small') | title }}</b></span>
                                                    </v-tooltip>
                                                    <v-tooltip v-if="item.status === 'inactive' && item.presence_status !== 'transit'" bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-chip v-on="on" small label dark color="green darken-1">
                                                                <v-icon>person</v-icon>
                                                            </v-chip>
                                                        </template>
                                                        <span><b>{{ $t('case_info.inactive') | title }}</b></span>
                                                    </v-tooltip>
                                                </v-container>
                                            </v-img>
                                            <v-list>
                                                <v-divider></v-divider>
                                                <v-list-tile>
                                                    <v-list-tile-content style="margin-left:-10px;">
                                                        <v-list-tile-title style="text-align: left; font-size: medium; font-weight: bold;">{{ item.first_name | title }} {{ item.last_name | title }}</v-list-tile-title>
                                                        <v-list-tile-sub-title v-if="item.status === 'inactive'" style="text-align: left; color: #C0C0C0;">
                                                            {{ $t('cases.arrival_at_facility') }}:<b>{{item.arrival_date | formatDate }}</b>
                                                        </v-list-tile-sub-title>
                                                        <v-list-tile-sub-title v-else style="text-align: left; color: #C0C0C0;">
                                                            {{ $t('cases.missing_from') }}:<b>{{item.disappearance_date | formatDate }}</b>
                                                        </v-list-tile-sub-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                            </v-list>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                    <v-parallax v-else dark style="height:250px; background-color: #99a8b2;">
                        <v-layout align-center column justify-center>
                            <h1 class="display-2 font-weight-thin mb-3">{{ $t('case_info.no_related_cases') }}</h1>
                        </v-layout>
                    </v-parallax>
                </v-card>
                <v-card v-if="caseObject.status!=='inactive'" class="mb-2">
                    <v-toolbar flat style="background-color: white;">
                        <v-toolbar-title>{{ $t('case_info.similar_cases') }}</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text v-if="similarCases.length >= 1">
                        <v-layout row wrap>
                            <v-flex fill-height>
                                <v-layout row wrap>
                                    <v-flex xs12 sm6 md3 lg3 xl2 v-for="item in similarCases" :key="item.id" @click="loadSimilarCase(item)">
                                        <v-card class="clickable_card" tile style="padding: 5px; margin: 5px 15px 15px 15px;">
                                            <v-img :src="getImagePath(item.profile_photo)" height="165px" class="">
                                                <v-container fluid pa-2>
                                                    <v-tooltip v-if="item.amber_alert" bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-chip v-on="on" small label dark color="warning">
                                                                <v-icon>warning</v-icon>
                                                            </v-chip>
                                                        </template>
                                                        <span><b>{{ $t('case_info.amber_alert') }}</b></span>
                                                    </v-tooltip>
                                                    <v-tooltip v-if="item.status === 'active'" bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-chip v-on="on" small label dark color="blue-grey darken-3">
                                                                <v-icon>person_search</v-icon>
                                                            </v-chip>
                                                        </template>
                                                        <span><b>Missing</b></span>
                                                    </v-tooltip>
                                                    <v-tooltip v-if="item.status === 'closed'" bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-chip v-on="on" small label dark color="teal darken-5">
                                                                <v-icon>search_off</v-icon>
                                                            </v-chip>
                                                        </template>
                                                        <span><b>{{ item.status | title }}</b></span>
                                                    </v-tooltip>
                                                    <v-tooltip v-if="item.status === 'archived'" bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-chip v-on="on" small label dark color="brown darken-1">
                                                                <v-icon>archive</v-icon>
                                                            </v-chip>
                                                        </template>
                                                        <span><b>{{ item.status | title }}</b></span>
                                                    </v-tooltip>
                                                    <v-tooltip v-if="item.status === 'inactive' && item.presence_status === 'transit'" bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-chip v-on="on" small label dark color="pink darken-1">
                                                                <v-icon>local_taxi</v-icon>
                                                            </v-chip>
                                                        </template>
                                                        <span><b>{{ $t('case_info.transit_small') | title }}</b></span>
                                                    </v-tooltip>
                                                    <v-tooltip v-if="item.status === 'inactive' && item.presence_status !== 'transit'" bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-chip v-on="on" small label dark color="green darken-1">
                                                                <v-icon>person</v-icon>
                                                            </v-chip>
                                                        </template>
                                                        <span><b>{{ $t('case_info.inactive') | title }}</b></span>
                                                    </v-tooltip>
                                                </v-container>
                                            </v-img>
                                            <v-list>
                                                <v-divider></v-divider>
                                                <v-list-tile>
                                                    <v-list-tile-content style="margin-left:-10px;">
                                                        <v-list-tile-title style="text-align: left; font-size: medium; font-weight: bold;">{{ item.first_name | title }} {{ item.last_name | title }}</v-list-tile-title>
                                                        <v-list-tile-sub-title v-if="item.status === 'inactive'" style="text-align: left; color: #C0C0C0;">
                                                            {{ $t('cases.arrival_at_facility') }}:<b>{{item.arrival_date | formatDate }}</b>
                                                        </v-list-tile-sub-title>
                                                        <v-list-tile-sub-title v-else style="text-align: left; color: #C0C0C0;">
                                                            {{ $t('cases.missing_from') }}:<b>{{item.disappearance_date | formatDate }}</b>
                                                        </v-list-tile-sub-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                            </v-list>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                    <v-parallax v-else dark style="height:250px; background-color: #99a8b2;">
                        <v-layout align-center column justify-center>
                            <h1 class="display-2 font-weight-thin mb-3">{{ $t('case_info.no_similar_cases') }}</h1>
                        </v-layout>
                    </v-parallax>
                </v-card>
            </v-flex>
        </v-layout>
        <v-dialog v-model="verifyCloseCaseDialog" width="600">
            <v-card>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <span>{{ $t('case.close_case_validation') }}</span>
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <div class="mx-2 my-2">{{ $t('case.close_case_dialog_message') }}</div>
                    <v-textarea name="input-7-1" v-model="closeCaseMessage" box class="mx-2"
                                :label="$t('case.close_case_notification_message')"
                                ref="close-case-notification" rows="4">
                    </v-textarea>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="" flat @click="verifyCloseCaseDialog = false; closeCaseMessage=null;">{{ $t('case_facts.cancel') }}</v-btn>
                    <v-btn color="red" flat @click="closeCase()">{{ $t('case_info.close_case') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editLinkedCasesDialog" width="950">
            <v-card>
                <v-toolbar flat>
                    <v-toolbar-title class="mt-3">{{ $t('case_info.edit_linked_cases') }}</v-toolbar-title>
                </v-toolbar>
                <v-toolbar flat color="white">
                    <v-text-field label="Child name" flat class="mt-2" v-model="searchName"></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn flat color="cyan lighten-1" @click="loadChildren()">{{ $t('case_info.search') }}</v-btn>
                </v-toolbar>
                <v-list v-if="children.length > 0" two-line class="mx-2" style="height: 500px; overflow-y: scroll;">
                    <template v-for="(item, index) in children">
                        <v-subheader v-if="item.header" :key="item.header">{{ item.header }}</v-subheader>
                        <v-list-tile v-else :key="item.title" avatar>
                            <v-list-tile-avatar>
                                <img :src="getImagePath(item.image)">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.first_name | title }} {{ item.last_name | title }}</v-list-tile-title>
                                <v-list-tile-sub-title><v-chip small label style="margin-left: -5px;">{{ item.status }}</v-chip></v-list-tile-sub-title>
                            </v-list-tile-content>
                            <div v-if="item.is_linked">
                                <v-btn flat icon disabled color="primary"><v-icon>link</v-icon></v-btn>
                                <v-btn flat icon @click="unlinkCase(item)" color="red" dark><v-icon>link_off</v-icon></v-btn>
                            </div>
                            <div v-else>
                                <v-btn flat icon @click="linkCase(item)" color="primary" dark><v-icon>link</v-icon></v-btn>
                                <v-btn flat icon disabled color="red"><v-icon>link_off</v-icon></v-btn>
                            </div>
                        </v-list-tile>
                        <v-divider v-if="index<children.length-1"></v-divider>
                    </template>
                </v-list>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="editLinkedCasesDialog = false;">{{ $t('case_info.close') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
            searchName: '',
            caseObject: {
                status: '',
            },
            verifyCloseCaseDialog: false,
            closeCaseMessage: null,
            similarCases: [],
            linkedCases: [],
            children: [],
            editLinkedCasesDialog: false,
        };
    },
    async created() {
        await this.loadCase();
    },
    methods: {
        openEditLinkedCaseDialog() {
            this.children = [];
            this.searchName = '';
            this.editLinkedCasesDialog = true;
            this.loadChildren();
        },
        async loadChildren() {
            const { data: children } = await CasesApi.children({ name: this.searchName, case_id: this.caseObject.id });
            this.children = children;
            console.log(children);
        },
        async linkCase(data) {
            await CasesApi.linkCase(this.caseObject.id, { case_id: data.id });
            await this.loadChildren();
            await this.loadLinkedCases();
        },
        async unlinkCase(data) {
            await CasesApi.unlinkCase(this.caseObject.id, data.id );
            await this.loadChildren();
            await this.loadLinkedCases();
        },
        getAge(birthDate) {
            if (birthDate) {
                return `${Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)} ${this.$t('case_info.years')}`;
            }
            return ' - ';
        },
        loadEditCase() {
            this.$router.push({ name: 'case_edit', params: { caseObjectProp: this.caseObject } });
        },
        openCloseCaseDialog() {
            this.verifyCloseCaseDialog = true;
        },
        async closeCase() {
            await CasesApi.close(this.id, { message: this.closeCaseMessage });
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
                this.$store.commit(SET_SNACKBAR_STATUS, { message: this.$t('case_info.set_disappearance_type'), color: 'error' });
            } else if (this.caseObject.is_refugee == null || this.caseObject.is_refugee === undefined) {
                this.$store.commit(SET_SNACKBAR_STATUS, { message: this.$t('case_info.set_refugee'), color: 'error' });
            } else if (!checkFeedbacks) {
                this.$store.commit(SET_SNACKBAR_STATUS, { message: this.$t('case_info.set_facts_validation'), color: 'error' });
            } else {
                await CasesApi.archive(this.id);
                this.$router.push({ name: 'cases' });
                this.$store.commit(SET_SNACKBAR_STATUS, { message: this.$t('case_info.success_archiving'), color: 'primary' });
            }
        },
        getDate(value) {
            return moment(String(value)).format('YYYY-MM-DD HH:mm:ss');
        },
        async loadCase() {
            const { data: caseObject } = await CasesApi.get(this.id);
            this.caseObject = caseObject;
            this.caseObject.disappearance_date = this.getDate(caseObject.disappearance_date);
            if (this.caseObject.status !== 'inactive') {
                await this.loadSimilarCases();
                await this.loadLinkedCases();
            }
            this.isLoaded = true;
        },
        async loadSimilarCases() {
            const { data: similarCases } = await CasesApi.getSimilarCases(this.id);
            this.similarCases = similarCases;
            console.log(similarCases);
        },
        async loadLinkedCases() {
            const { data: linkedCases } = await CasesApi.getLinkedCases(this.id);
            this.linkedCases = linkedCases;
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
            const { data: addChildResponse } = await FacilitiesApi.addChild(caseObjecta.child);
            const { data: caseObject } = await CasesApi.get(this.id);
            this.caseObject = caseObject;
        },
        loadSimilarCase(caseObject) {
            this.id = caseObject.id;
            this.loadCase();
            this.$router.push({
                name: 'case',
                params: { id: this.id },
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
