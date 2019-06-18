<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded">
        <v-card>
            <v-card-title>
                <div style="margin-bottom: 0px;"><span
                    style="font-size: large; font-weight: bold;">INFORMATION ({{ getFeedbacks.length || 0 }})</span>
                </div>
                <v-spacer></v-spacer>
            </v-card-title>
            <v-data-table :headers="headers" :items="getFeedbacks" :search="search">
                <template v-slot:items="props">
                    <tr @click="openEditFeedback(props.item)">
                        <td>
                            <span style="color: #3B5998;">{{ props.item.id }}</span></td>
                        <td class="text-xs-left">{{ props.item.comment }}</td>
                        <td class="text-xs-left">{{ props.item.address }}</td>
                        <td class="text-xs-left">{{ props.item.date }} {{ props.item.time }}</td>
                        <td class="text-xs-left">
                            <v-img v-if="props.item.feedback_image" :src="getImagePath(props.item.feedback_image)" width="64px"></v-img>
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
                    </tr>
                </template>
                <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                    Your search for "{{ search }}" found no results.
                </v-alert>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import { bus } from '../../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { dates } from '@/utils/mixins';

export default {
    components: {},
    props: {
        caseId: null,
    },
    mixins: [dates],
    data() {
        return {
            baseUrl: process.env.VUE_APP_BACKEND,
            isLoaded: false,
            search: '',
            headers: [
                {
                    text: 'ID',
                    align: 'left',
                    sortable: false,
                    value: 'id'
                },
                {
                    text: 'DESCRIPTION',
                    value: 'comment'
                },
                {
                    text: 'ADDRESS',
                    value: 'address'
                },
                {
                    text: 'DATE',
                    value: 'created_at'
                },
                {
                    text: 'MEDIA',
                    value: 'feedback_image'
                },
                {
                    text: 'USER',
                    value: 'source'
                },
                {
                    text: 'CHECKED BY',
                    value: 'name'
                },
                {
                    text: 'STATUS',
                    value: 'feedback_status',
                    align: 'left',
                }
            ],
        };
    },
    computed: {
        ...mapGetters('feedback_module', {
            getFeedbacks: 'getFeedbacks',
        })
    },
    created() {
        if (!this.getFeedbacks || this.getFeedbacks === null) {
            this.loadFeedbacks();
        } else {
            this.isLoaded = true;
        }

        bus.$off('reload-feedbacks-event');
        bus.$on('reload-feedbacks-event', () => {
            this.loadFeedbacks();
        });
    },
    methods: {
        ...mapMutations('generic_module', {
            showSnackbarMutation: 'showSnackbarMutation',
            hideSnackbarMutation: 'hideSnackbarMutation',
            showLoaderMutation: 'showLoaderMutation',
            hideLoaderMutation: 'hideLoaderMutation',
        }),
        ...mapActions('feedback_module', {
            getFeedbacksAction: 'getFeedbacksAction'
        }),
        getImagePath(path) {
            if (this.baseUrl && this.baseUrl.length > 1) {
                return this.baseUrl + path;
            } else {
                return path;
            }
        },
        getUserType(user) {
            return user !== 'Anonymous' && user !== 'Police';
        },
        loadFeedbacks() {
            this.showLoaderMutation();
            this.getFeedbacksAction({ caseId: this.caseId })
                .then((response) => {
                    if (response.status === 200) {
                        this.hideLoaderMutation();
                        this.isLoaded = true;
                    } else {
                        this.hideLoaderMutation();
                    }
                })
                .catch((error) => {
                    this.hideLoaderMutation();
                    if (error.response) {
                        this.showSnackbarMutation({ message: error.response, status: 'error' });
                    } else {
                        this.showSnackbarMutation({ message: "Network error", status: 'error' });
                    }
                    // this.clearForm();
                    setTimeout(() => {
                        this.hideSnackbarMutation();
                    }, 3000);
                });
        },
        openEditFeedback(item) {
            bus.$emit('edit-feedback-dialog-event', item);
        }
    }
};
</script>

<style scoped>
    .blueName {
        color: #3B5998
    }
</style>
