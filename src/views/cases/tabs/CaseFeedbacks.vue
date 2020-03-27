<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded">
        <v-card flat>
            <v-toolbar v-if="$caseManagerAndAbove.includes($store.state.role) && (caseObject.status==='active' || caseObject.status==='inactive')" class="text-xs-right" dense flat color="white">
                <v-spacer></v-spacer>
                <v-btn dark color="primary" @click="openCreateFeedback()">Provide Fact</v-btn>
            </v-toolbar>
            <v-data-table :headers="headers" :items="feedbacks" :pagination.sync="pagination">
                <template v-slot:items="props">
                    <tr :style="{ 'color': isMainFact(props.item.is_main) }" @click="openFeedback(props.item)">
                        <td class="text-xs-left">{{ props.item.updated_at | formatDateTime }}</td>
                        <td class="text-xs-left">{{ props.item.comment | truncate(25, '...') }}</td>
                        <td class="text-xs-left">{{ props.item.address | truncate(25, '...') }}</td>
                        <td class="text-xs-left">{{ props.item.date | formatDateTime }}</td>
                        <td class="text-xs-left"><v-icon v-if="props.item.feedback_image" color="blue">image</v-icon></td>
                        <td class="text-xs-left"><span>{{ props.item.score }}</span></td>
                        <td class="text-xs-left"><span>{{ props.item.source | title }}</span></td>
                        <td class="text-xs-left">
                            <v-tooltip right>
                                <span slot="activator" :style="{'color': getRoleColor(props.item.checked_by_role)}">{{ props.item.checked_by_name }}</span>
                                <span>{{ props.item.checked_by_role | customTitle("_") }}</span>
                            </v-tooltip>
                        </td>
                        <td class="text-xs-left">
                            <span :style="{ 'color': getFactStatusColor(props.item.feedback_status) }" class="caption">{{ props.item.feedback_status | title }}</span>
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
                <v-alert v-slot:no-results :value="true" color="error" icon="warning">No facts!</v-alert>
            </v-data-table>
            <feedback :case-id="caseObject.id" :full-name="caseObject.full_name"></feedback>
        </v-card>
        <v-dialog v-model="validateFactDialog" width="400">
            <v-card>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Fact validation</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="" flat @click="validateFactDialog = false; selectedFact={};">Cancel</v-btn>
                    <v-btn color="green" flat @click="validateFact(true)">Valid</v-btn>
                    <v-btn color="error" flat @click="validateFact(false)">Invalid</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { bus } from '../../../main';
import { dates, filters, fonts } from '@/utils/mixins';
import Feedback from '@/components/Feedback.vue';
import { CasesApi, FeedbacksApi } from '@/api';

export default {
    components: {
        feedback: Feedback,
    },
    mixins: [dates, filters, fonts],
    data() {
        return {
            caseId: null,
            caseObject: {},
            isLoaded: false,
            selectedFact: {},
            validateFactDialog: false,
            feedbacks: [],
            pagination: { sortBy: 'updated_at', descending: true, rowsPerPage: 10 },
            headers: [
                {
                    text: 'LAST UPDATE',
                    value: 'updated_at',
                    width: '11%',
                },
                {
                    text: 'DESCRIPTION',
                    value: 'comment',
                    width: '15%',
                },
                {
                    text: 'ADDRESS',
                    value: 'address',
                    width: '15%',
                },
                {
                    text: 'DATE OF INCIDENT',
                    value: 'date',
                    width: '10%',
                },
                {
                    text: 'MEDIA',
                    align: 'left',
                    value: 'feedback_image',
                    width: '5%',
                },
                {
                    text: 'SCORE',
                    value: 'score',
                    width: '5%',
                },
                {
                    text: 'SOURCE',
                    value: 'source',
                    width: '10%',
                },
                {
                    text: 'CHECKED BY',
                    value: 'name',
                    width: '10%',
                },
                {
                    text: 'STATUS',
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
                    text: 'Is valid',
                    align: 'left',
                    sortable: true,
                    value: 'is_valid',
                    width: '5%',
                },
                {
                    sortable: false,
                    text: 'Actions',
                    value: 'name',
                    width: '5%',
                },
            ],
        };
    },
    async created() {
        this.caseId = this.$route.params.id;
        await this.loadFeedbacks();
        bus.$off('reload-feedbacks-event');
        bus.$on('reload-feedbacks-event', () => {
            this.loadFeedbacks();
        });
        const { data: caseObject } = await CasesApi.get(this.caseId);
        this.caseObject = caseObject;
        this.isLoaded = true;
    },
    methods: {
        async loadFeedbacks() {
            const { data: feedbacks } = await FeedbacksApi.all({ caseId: this.caseId });
            feedbacks.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            this.feedbacks = feedbacks;
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
