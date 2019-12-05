<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-card v-if="isLoaded">
        <v-data-table :headers="headers" :items="feedbacks" :search="search" :pagination.sync="pagination">
            <template v-slot:items="props">
                <tr @click="openFeedback(props.item)">
                    <td class="text-xs-left">{{ props.item.updated_at | formatDateTime }}</td>
                    <td class="text-xs-left">{{ props.item.comment | truncate(50, '...') }}</td>
                    <td class="text-xs-left">{{ props.item.address }}</td>
                    <td class="text-xs-left">{{ props.item.date | formatDateTime }}</td>
                    <td class="text-xs-left">
                        <v-icon v-if="props.item.feedback_image" color="blue">image</v-icon>
                    </td>
                    <td class="text-xs-left">
                        <span :class="{ blueName: getUserType(props.item.source) }">{{ props.item.source }}</span>
                    </td>
                    <td class="text-xs-left">
                        <span>{{ props.item.checked_by_name }}</span>
                    </td>
                    <td class="text-xs-left">
                        <v-btn v-if="props.item.feedback_status === 'pending'" outline dark color="#3B5998">
                            Pending
                        </v-btn>
                        <span v-if="props.item.feedback_status === 'relevant'" style="color: #28A745;"><b>RELEVANT</b></span>
                        <span v-if="props.item.feedback_status === 'irrelevant'"
                              style="color: #FB6221;"><b>IRRELEVANT</b></span>
                        <span v-if="props.item.feedback_status === 'credible'" style="color: #28A745;"><b>CREDIBLE</b></span>
                    </td>
                    <td><span style="color: #3B5998;">{{ props.item.id }}</span></td>
                    <td class="justify-center layout px-0">
                        <v-icon
                            small
                            class="mr-2"
                            @click.stop="openFeedback(props.item)"
                        >visibility</v-icon>
                    </td>
                </tr>
            </template>
            <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                Your search for "{{ search }}" found no results.
            </v-alert>
        </v-data-table>
        <div v-show="false"><feedback></feedback></div>
    </v-card>
</template>

<script>
import { bus } from '../../../main';
import { dates, filters } from '@/utils/mixins';
import { FeedbacksApi } from '@/api';
import Feedback from '@/components/Feedback.vue';

export default {
    components: {
        Feedback,
    },
    mixins: [dates, filters],
    data() {
        return {
            caseId: null,
            isLoaded: false,
            feedbacks: [],
            search: '',
            pagination: { sortBy: 'updated_at', descending: true, rowsPerPage: 10 },
            headers: [
                {
                    text: 'LAST UPDATE',
                    value: 'updated_at',
                    width: '10%',
                },
                {
                    text: 'DESCRIPTION',
                    value: 'comment',
                    width: '25%',
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
                    text: 'SOURCE',
                    value: 'source',
                },
                {
                    text: 'CHECKED BY',
                    value: 'name',
                },
                {
                    text: 'STATUS',
                    value: 'feedback_status',
                    align: 'left',
                    width: '10%',
                },
                {
                    text: 'ID',
                    align: 'left',
                    sortable: false,
                    value: 'id',
                    width: '5%',
                },
                {
                    align: 'center',
                    sortable: false,
                    text: 'Actions',
                    value: 'name',
                    width: '5%',
                },
            ],
        };
    },
    created() {
        this.caseId = this.$route.params.id;
        this.loadFeedbacks();
    },
    methods: {
        getUserType(user) {
            return user !== 'Anonymous' && user !== 'Police';
        },
        async loadFeedbacks() {
            const { data: feedbacks } = await FeedbacksApi.all({ caseId: this.caseId });
            feedbacks.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            this.feedbacks = feedbacks;
            this.isLoaded = true;
        },
        openFeedback(item) {
            bus.$emit('view-feedback-dialog-event', item);
        },
    },
};
</script>

<style scoped>
    .blueName {
        color: #3B5998
    }
</style>
