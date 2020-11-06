<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded" style="padding: 10px;">
        <v-layout>
            <v-flex xs12>
                <v-toolbar v-if="$caseManagerAndAbove.includes($store.state.role) && (caseObject.status==='active' || caseObject.status==='inactive')">
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
                    <v-btn flat dark color="primary" @click="openCreateFeedback()">
                        {{ $t('case_facts.provide_fact') }}
                        <v-icon right>info</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-toolbar v-if="caseObject.status==='closed' && this.$store.state.role!=='facility_manager' && caseObject.organization===$store.state.organizationId">
                    <v-chip label dark color="teal darken-5">
                        <v-icon left>search_off</v-icon>
                        <b>{{ caseObject.status | title }}</b>
                    </v-chip>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <br/>
                <v-card color="grey lighten-5" class="mb-5" style="padding: 5px;">
                    <v-data-table :headers="headers" :items="feedbacks" :pagination.sync="pagination">
                        <template v-slot:items="props">
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <tr v-on="on" :style="{ 'background-color': isMainFact(props.item) }" @click="openFeedback(props.item)">
                                        <td class="text-xs-left">{{ props.item.updated_at | formatDateTime }}</td>
                                        <td class="text-xs-left">{{ props.item.comment | truncate(25, '...') }}</td>
                                        <td class="text-xs-left">{{ props.item.address | truncate(25, '...') }}</td>
                                        <td class="text-xs-left">{{ props.item.date | formatDateTime }}</td>
                                        <td class="text-xs-left"><v-icon v-if="props.item.feedback_image" color="blue">image</v-icon></td>
                                        <td class="text-xs-left"><span>{{ getScore(props.item.score) }}</span></td>
                                        <td class="text-xs-left"><span>{{ props.item.source | title }}</span></td>
                                        <td class="text-xs-left">
                                            <v-tooltip right>
                                                <!-- :style="{'color': getRoleColor(props.item.checked_by_role)}" -->
                                                <span slot="activator">{{ props.item.checked_by_name }}</span>
                                                <span>{{ props.item.checked_by_role | customTitle("_") }}</span>
                                            </v-tooltip>
                                        </td>
                                        <td class="text-xs-left">
                                            <span class="caption">{{ props.item.feedback_status | title }}</span>
                                        </td>
                                        <td><span style="color: #3B5998;">{{ props.item.id }}</span></td>
                                        <td><span style="color: #3B5998;">{{ props.item.is_valid }}</span></td>
                                        <td class="justify-center layout px-0">
                                            <v-icon small class="mr-2" @click.stop="openFeedback(props.item)">visibility</v-icon>
                                            <v-icon v-if="caseObject.status==='active' || caseObject.status==='inactive'" small class="mr-2" @click.stop="openEditFeedback(props.item)">edit</v-icon>
                                            <v-icon v-if="caseObject.status==='closed'" small class="mr-2" @click.stop="openValidateFactDialog(props.item)">edit</v-icon>
                                        </td>
                                    </tr>
                                </template>
                                <span v-if="props.item.user_id">Name: {{props.item.user_name}} - Email: {{props.item.user_email}} - Phone: {{props.item.user_phone}}</span>
                                <span v-else>Anonymous user</span>
                            </v-tooltip>
                        </template>
                        <v-alert v-slot:no-results :value="true" color="error" icon="warning">{{ $t('case_facts.no_facts') }}</v-alert>
                    </v-data-table>
                    <feedback :case-id="caseObject.id" :full-name="caseObject.fullName"></feedback>
                </v-card>
            </v-flex>
        </v-layout>
        <v-dialog v-model="validateFactDialog" width="400">
            <v-card>
                <v-toolbar flat color="white">
                    <v-toolbar-title>{{ $t('case_facts.fact_validation') }}</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="" flat @click="validateFactDialog = false; selectedFact={};">{{ $t('case_facts.cancel') }}</v-btn>
                    <v-btn color="green" flat @click="validateFact(true)">{{ $t('case_facts.valid') }}</v-btn>
                    <v-btn color="error" flat @click="validateFact(false)">{{ $t('case_facts.invalid') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { bus } from '../../../main';
import { dates, filters, fonts } from '@/utils/mixins';
import Feedback from '@/components/Feedback.vue';
import { CasesApi, FeedbacksApi } from '@/api';
import { SET_REFRESH_FEEDBACKS } from '@/store/mutation-types';

export default {
    components: {
        feedback: Feedback,
    },
    mixins: [dates, filters, fonts],
    data() {
        return {
            timeoutFun: null,
            caseId: null,
            caseObject: {},
            isLoaded: false,
            selectedFact: {},
            validateFactDialog: false,
            feedbacks: [],
            pagination: { sortBy: 'updated_at', descending: true, rowsPerPage: 10 },
            headers: [
                {
                    text: this.$t('case_facts.last_update'),
                    value: 'updated_at',
                    width: '11%',
                },
                {
                    text: this.$t('case_facts.description'),
                    value: 'comment',
                    width: '15%',
                },
                {
                    text: this.$t('case_facts.address'),
                    value: 'address',
                    width: '15%',
                },
                {
                    text: this.$t('case_facts.date_of_incident'),
                    value: 'date',
                    width: '10%',
                },
                {
                    text: this.$t('case_facts.media'),
                    align: 'left',
                    value: 'feedback_image',
                    width: '5%',
                },
                {
                    text: this.$t('case_facts.score'),
                    value: 'score',
                    width: '5%',
                },
                {
                    text: this.$t('case_facts.source'),
                    value: 'source',
                    width: '10%',
                },
                {
                    text: this.$t('case_facts.checked_by'),
                    value: 'name',
                    width: '10%',
                },
                {
                    text: this.$t('case_facts.status'),
                    value: 'feedback_status',
                    align: 'left',
                    width: '5%',
                },
                {
                    text: 'ID',
                    align: 'left',
                    sortable: false,
                    value: 'id',
                    width: '5%',
                },
                {
                    text: this.$t('case_facts.is_valid'),
                    align: 'left',
                    sortable: true,
                    value: 'is_valid',
                    width: '5%',
                },
                {
                    sortable: false,
                    text: this.$t('case_facts.actions'),
                    value: 'name',
                    width: '5%',
                },
            ],
        };
    },
    computed: {
        ...mapGetters(['refreshFeedbacks']),
    },
    async created() {
        this.$store.commit(SET_REFRESH_FEEDBACKS, true);
        this.caseId = this.$route.params.id;
        await this.loadFeedbacks();
        bus.$off('reload-feedbacks-event');
        bus.$on('reload-feedbacks-event', () => {
            this.loadFeedbacks();
        });
        const { data: caseObject } = await CasesApi.get(this.caseId);
        this.caseObject = caseObject;
        this.caseObject.fullName = `${caseObject.first_name} ${caseObject.last_name}`;
        this.reloadFeedbacks();
        this.isLoaded = true;
    },
    async destroyed () {
        await clearTimeout(this.timeoutFun);
    },
    async beforeDestroy() {
        await clearTimeout(this.timeoutFun);
    },
    methods: {
        getScore(score) {
            if (score === -2) {
                return 'Distance is out of bounds';
            } if (score === -1) {
                return 'Time is out of bounds';
            } if (score === -10) {
                return '* SPAM *';
            } if (score >= 0 && score < 0.33) {
                return 'Low Reliability';
            } if (score > 0.33 && score <= 0.99) {
                return 'Normal Reliability';
            } if (score >= 1 && score <= 2) {
                return 'High Reliability';
            }
            return 'Error in analytics';
        },
        async loadFeedbacks() {
            const { data: feedbacks } = await FeedbacksApi.all({ caseId: this.caseId });
            this.feedbacks = feedbacks;
            this.feedbacks.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        },
        async reloadFeedbacks() {
            if (this.$store.state.token === null || this.refreshFeedbacks === false) clearTimeout(this.timeoutFun);
            else if (this.refreshFeedbacks) {
                this.loadFeedbacks();
                this.timeoutFun = setTimeout(this.reloadFeedbacks, 5000);
            }
        },
        openFeedback(item) {
            bus.$emit('view-feedback-dialog-event', item);
        },
        openEditFeedback(item) {
            bus.$emit('edit-feedback-dialog-event', item);
        },
        openCreateFeedback() {
            bus.$emit('create-feedback-dialog-event');
        },
        openValidateFactDialog(fact) {
            this.validateFactDialog = true;
            this.selectedFact = fact;
        },
        async validateFact(isValid) {
            this.selectedFact.is_valid = isValid;
            await FeedbacksApi.edit(this.selectedFact);
            this.validateFactDialog = false;
            await this.loadFeedbacks();
        },
    },
};
</script>

<style scoped>
    .aaa {
        color: red;
    }
</style>
