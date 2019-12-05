<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded">
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
                                <v-chip
                                    v-if="caseObject.status === 'active'"
                                    dark
                                    color="#555"
                                    small
                                >missing</v-chip>
                                <v-chip
                                    v-else-if="caseObject.presence_status === 'present'"
                                    dark
                                    color="green"
                                    small
                                >Present</v-chip>
                                <v-chip
                                    v-else-if="caseObject.presence_status === 'not_present'"
                                    dark
                                    color="#2FD1D4"
                                    small
                                >Not Present</v-chip>
                                <v-chip
                                    v-else-if="caseObject.presence_status === 'transit'"
                                    dark
                                    color="#800080"
                                    small
                                >Not Present</v-chip>
                            </span>
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md8 lg8 xl6>
                <v-layout align-center row fill-height reverse wrap>
                    <v-flex>
                        <div v-if="caseObject.status === 'inactive' && this.$store.state.facilityId === caseObject.current_facility_id" class="text-xs-right">
                            <v-btn :dark="caseObject.status !== 'active'" color="#F4B350" @click="loadEditCase()">Edit</v-btn>
                            <v-btn :dark="caseObject.status !== 'active'" color="green" @click="setPresence('present')">PRESENT</v-btn>
                            <v-btn :dark="caseObject.status !== 'active'" color="#2FD1D4" @click="setPresence('not_present')">NON PRESENT</v-btn>
                            <v-btn :dark="caseObject.status !== 'active'" color="#800080" @click="setPresence('transit')">TRANSIT</v-btn>
                            <missing-report
                                :case-id="caseObject.id"
                                :full-name="caseObject.personal_data.full_name"
                            ></missing-report>
                        </div>
                        <div v-if="caseObject.presence_status === 'transit'" class="text-xs-right">
                            <v-btn :dark="caseObject.status !== 'active'" color="#2FD1D4" @click="addChilceToFacility(caseObject.id)">Accept transfer</v-btn>
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-layout wrap>
            <v-flex xs12 sm12 md12 lg12 >
                <v-tabs color="transparent">
                    <v-tabs-slider color="#FBA621" />
                    <v-tab :ripple="false" :to="`/manage_facility/${$route.params.id}/info`">Child Info</v-tab>
                    <v-tab :ripple="false" :to="`/manage_facility/${$route.params.id}/additional-info`">Additional info</v-tab>
                    <v-tab :ripple="false" :disabled="caseObject.status !== 'active'" :to="`/manage_facility/${$route.params.id}/alerts`">Alerts</v-tab>
                    <v-tab :ripple="false" :disabled="caseObject.status !== 'active'" :to="`/manage_facility/${$route.params.id}/feedbacks`">Facts</v-tab>
                    <v-tab :ripple="false" :disabled="caseObject.status !== 'active'" :to="`/manage_facility/${$route.params.id}/feedbacks`">Analytics</v-tab>
                </v-tabs>
            </v-flex>
        </v-layout>
        <v-layout align-center justify-center wrap class="content">
            <v-flex xs12 sm12 md12 lg12 xl12 class="text-xs-center">
                <router-view></router-view>
            </v-flex>
        </v-layout>
        <div v-show="false"><missing-report></missing-report></div>
    </div>
</template>

<script>
import MissingReport from '@/components/MissingReport.vue';
import { CasesApi, FacilitiesApi } from '@/api';

export default {
    components: {
        MissingReport,
    },
    props: {
        id: { type: Number, required: true },
    },
    data() {
        return {
            isLoaded: false,
            caseObject: {},
            linkItems: [
                {
                    text: 'Home',
                    disabled: false,
                    href: '/',
                },
                {
                    text: 'Cases',
                    disabled: false,
                    href: '/manage_facility',
                },
            ],
        };
    },
    async created() {
        this.loadCase();
    },
    methods: {
        loadEditCase() {
            this.$router.push({ name: 'manage_facility_child_edit', params: { caseObject: this.caseObject } });
        },
        async loadCase() {
            if (this.id !== 'new') {
                const { data: caseObject } = await CasesApi.getFacilityCase(this.id);
                this.caseObject = caseObject;
                this.linkItems.push({
                    text: `#${this.caseObject.id}`,
                    disabled: true,
                    href: '/manage_facility_child',
                });
                this.isLoaded = true;
            } else {
                this.$router.push({ name: 'manage_facility' });
            }
        },
        async setPresence(state) {
            const { data: response } = await CasesApi.setState(this.caseObject.id, { presence_status: state });
            const { data: caseObject } = await CasesApi.get(this.id);
            this.caseObject = caseObject;
        },
        async addChilceToFacility(caseId) {
            const { data: addChildResponse } = await FacilitiesApi.addChild(caseId);
            const { data: caseObject } = await CasesApi.get(this.id);
            this.caseObject = caseObject;
        },
    },
};
</script>
