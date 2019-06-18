<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div style="padding: 10px;" v-if="isLoaded">
        <v-breadcrumbs :items="linkItems">
            <template v-slot:divider>
                <v-icon>chevron_right</v-icon>
            </template>
        </v-breadcrumbs>
        <v-layout wrap>
            <v-flex xs12 sm12 md4 lg4 xl6>
                <v-layout>
                    <v-flex xs12 sm6 md12 lg12 xl12 style="margin: 5px;">
                        <div>
                            <span style="font-size: x-large; font-weight: bold;">
                                {{ this.caseObject.personal_data.first_name }} {{ this.caseObject.personal_data.last_name }}
                                <v-chip v-if="caseObject.status === 'closed'" dark color="green" small>
                                    {{ this.caseObject.status }}
                                </v-chip>
                                <v-chip v-if="caseObject.status === 'active'" dark color="red" small>
                                    {{ this.caseObject.status }}
                                </v-chip>
                            </span>
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md8 lg8 xl6>
                <v-layout align-center row fill-height reverse wrap>
                    <v-flex>
                        <div class="text-xs-right">
                            <v-btn dark color="#F4B350" @click="loadEditCase()">Edit case</v-btn>
                            <feedback :caseId="getCase.id" :fullName="getCase.personal_data.full_name"></feedback>
                            <alert :caseId="getCase.id" :fullName="getCase.personal_data.full_name"></alert>
                            <v-btn outline dark color="#000000" @click="closeCase()">CLOSE CASE</v-btn>
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-layout wrap>
            <v-flex xs12 sm12 md12 lg12 style="margin-top: 10px;">
                <v-tabs color="transparent">
                    <v-tabs-slider color="#FBA621"/>
                    <v-tab :ripple="false" href="#tab-info">Case</v-tab>
                    <v-tab :ripple="false" href="#tab-feedback">Facts</v-tab>
                    <v-tab :ripple="false" href="#tab-alert">Alerts</v-tab>
                    <v-tab :ripple="false" href="#tab-analysis">Analysis</v-tab>
                    <v-tab :ripple="false" href="#tab-additional">Additional info</v-tab>
                    <v-tab :ripple="false" href="#tab-timeline">Timeline</v-tab>
                    <v-tab-item :value="'tab-info'" transition="fade-transition"
                                reverse-transition="fade-transition">
                        <case-info></case-info>
                    </v-tab-item>
                    <v-tab-item :value="'tab-feedback'" transition="fade-transition"
                                reverse-transition="fade-transition">
                        <case-feedbacks :caseId="getCase.id"></case-feedbacks>
                    </v-tab-item>
                    <v-tab-item :value="'tab-alert'" transition="fade-transition"
                                reverse-transition="fade-transition">
                        <case-alerts :caseId="getCase.id"></case-alerts>
                    </v-tab-item>
                    <v-tab-item :value="'tab-analysis'" transition="fade-transition"
                                reverse-transition="fade-transition">
                        <v-jumbotron dark src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg">
                            <v-container fill-height>
                                <v-layout align-center>
                                    <v-flex>
                                        <h3 class="display-3">Not data analysis yet</h3>
                                        <span class="subheading">Lorem ipsum dolor sit amet, pri veniam forensibus id. Vis maluisset molestiae id, ad semper lobortis cum. At impetus detraxit incorrupte usu, repudiare assueverit ex eum, ne nam essent vocent admodum.</span>
                                        <v-divider class="my-3"></v-divider>
                                        <div class="title mb-3">Check out our newest features!</div>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-jumbotron>
                    </v-tab-item>
                    <v-tab-item :value="'tab-additional'" transition="fade-transition"
                                reverse-transition="fade-transition">
                        <case-additional-info></case-additional-info>
                    </v-tab-item>
                    <v-tab-item :value="'tab-timeline'" transition="fade-transition"
                                reverse-transition="fade-transition">
                        <timeline></timeline>
                    </v-tab-item>
                </v-tabs>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import Feedback from '../../components/Feedback';

import Alert from '../../components/Alert';
import CaseInfo from './tabs/CaseInfo';
import CaseFeedbacks from './tabs/CaseFeedbacks';
import CaseAlerts from './tabs/CaseAlerts';
import Timeline from '../Timeline';

import { mapGetters, mapMutations, mapActions } from 'vuex';
import CaseAdditionalInfo from './tabs/CaseAdditionalInfo';


export default {
    props: {
        id: null,
        // caseObjectProp: {
        //     type: Object,
        //     required: false
        // },
    },
    components: {
        'feedback': Feedback,
        'case-info': CaseInfo,
        'case-additional-info': CaseAdditionalInfo,
        'case-feedbacks': CaseFeedbacks,
        'case-alerts': CaseAlerts,
        'timeline': Timeline,
        'alert': Alert,
    },
    data() {
        return {
            isLoaded: false,
            caseObject: {},
            linkItems: [
                {
                    text: 'Home',
                    disabled: false,
                    href: '/dashboard',
                },
                {
                    text: 'Cases',
                    disabled: false,
                    href: '/cases',
                }
            ],
        };
    },
    computed: {
        ...mapGetters('case_module', {
            getCase: 'getCase',
        }),
    },
    created() {
        this.loadCase();
    },
    methods: {
        ...mapMutations('generic_module', {
            showSnackbarMutation: 'showSnackbarMutation',
            hideSnackbarMutation: 'hideSnackbarMutation',
            showLoaderMutation: 'showLoaderMutation',
            hideLoaderMutation: 'hideLoaderMutation',
        }),
        ...mapMutations('feedback_module', {
            clearFeedbacksMutation: 'clearFeedbacksMutation',
        }),
        ...mapMutations('alert_module', {
            clearAlertsMutation: 'clearAlertsMutation',
        }),
        ...mapActions('case_module', {
            getCaseAction: 'getCaseAction',
            closeCaseAction: 'closeCaseAction',
        }),
        loadEditCase() {
            this.$router.push({
                name: 'case_edit',
                params: { id: this.caseObject.id }
            });
        },
        loadCase() {
            if (this.id !== 'new') {
                this.showLoaderMutation();
                this.getCaseAction({ caseId: this.id })
                    .then((response) => {
                        if (response.status === 200) {
                            this.hideLoaderMutation();
                            this.caseObject = this.getCase;
                            this.clearFeedbacksMutation();
                            this.clearAlertsMutation();
                            this.linkItems.push({
                                // text: this.caseObject.personal_data.last_name + ' ' + this.caseObject.personal_data.first_name,
                                text: '#' + this.caseObject.id,
                                disabled: true,
                                href: '/case'
                            });
                            this.isLoaded = true;
                        } else {
                            this.hideLoaderMutation();
                            this.$router.push({ name: 'cases' });
                        }
                    })
                    .catch((error) => {
                        this.hideLoaderMutation();
                        this.showSnackbarMutation({ message: "Case id not found", status: 'error' });
                        this.$router.push({ name: 'cases' });
                        setTimeout(() => {
                            this.hideSnackbarMutation();
                        }, 3000);
                    });
            } else {
                this.$router.push({ name: 'cases' });
            }
        },
        closeCase() {
            this.showLoaderMutation();
                this.closeCaseAction({ caseId: this.getCase.id })
                    .then((response) => {
                        if (response.status === 200) {
                            this.hideLoaderMutation();
                             this.$router.push({ name: 'cases' });
                            // this.clearFeedbacksMutation();
                            // this.clearAlertsMutation();
                            // this.linkItems.push({
                            //     // text: this.caseObject.personal_data.last_name + ' ' + this.caseObject.personal_data.first_name,
                            //     text: '#' + this.caseObject.id,
                            //     disabled: true,
                            //     href: '/case'
                            // });
                            // this.isLoaded = true;
                        }
                    })
                    .catch((error) => {
                        this.hideLoaderMutation();
                        this.showSnackbarMutation({ message: "Case id not found", status: 'error' });
                        this.$router.push({ name: 'cases' });
                        setTimeout(() => {
                            this.hideSnackbarMutation();
                        }, 3000);
                    });
        }
    }
};
</script>

<style scoped>
</style>
