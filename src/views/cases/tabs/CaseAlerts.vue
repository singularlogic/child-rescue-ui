<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded">
        <v-card>
            <v-card-title>
                <div><span
                    style="font-size: large; font-weight: bold;">ALERTS ({{ getAlerts.length || 0 }})</span>
                </div>
                <v-spacer></v-spacer>
            </v-card-title>
            <v-data-table :headers="headers" :items="getAlerts" :search="search" :pagination.sync="pagination">
                <template v-slot:items="props">
                    <tr @click="openEditAlert(props.item)">
                        <td><span style="color: #3B5998;">{{ props.item.id }}</span></td>
                        <td class="text-xs-left">{{ props.item.fullname }}</td>
                        <!--<td class="text-xs-left">-->
                            <!--<v-img :src="getImagePath(props.item.image)" width="64px"></v-img>-->
                        <!--</td>-->
                        <td class="text-xs-left">{{ props.item.address }}</td>
                        <td class="text-xs-left">{{ props.item.radius }} km</td>
                        <td class="text-xs-left">{{ props.item.description }}</td>
                        <td class="text-xs-left">{{ getISODateTime(props.item.start) }}</td>
                        <td class="text-xs-left">{{ getISODateTime(props.item.end) }} {{ props.item.end_time }}</td>
                        <td class="text-xs-center">
                            <v-icon v-if="props.item.is_active" color="#3B5998">done</v-icon>
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
import moment from 'moment';
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
            pagination: {
                rowsPerPage: 10
            },
            headers: [
                {
                    text: 'ID',
                    align: 'left',
                    value: 'id',
                },
                {
                    text: 'FULL NAME',
                    value: 'fullname',
                    sortable: false,
                },
                // {
                //     text: 'IMAGE',
                //     value: 'image',
                //     sortable: false,
                // },
                {
                    text: 'ADDRESS',
                    value: 'adress',
                    sortable: false,
                },
                {
                    text: 'RADIUS',
                    value: 'radius',
                    sortable: false,
                },
                {
                    text: 'DESCRIPTION',
                    value: 'description',
                    sortable: false,
                },
                {
                    text: 'START',
                    value: 'start'
                },
                {
                    text: 'END',
                    value: 'end'
                },
                {
                    text: 'ACTIVE',
                    value: 'isActive',
                    align: 'center',
                }
            ],
        };
    },
    computed: {
        ...mapGetters('alert_module', {
            getAlerts: 'getAlerts',
        })
    },
    created() {
        if (!this.getAlerts || this.getAlerts === null) {
            this.loadAlerts();
        } else {
            this.isLoaded = true;
        }

        bus.$off('reload-alerts-event');
        bus.$on('reload-alerts-event', () => {
            this.loadAlerts();
        });
    },
    methods: {
        ...mapMutations('generic_module', {
            showSnackbarMutation: 'showSnackbarMutation',
            hideSnackbarMutation: 'hideSnackbarMutation',
            showLoaderMutation: 'showLoaderMutation',
            hideLoaderMutation: 'hideLoaderMutation',
        }),
        ...mapActions('alert_module', {
            getAlertsAction: 'getAlertsAction'
        }),
        getISODateTime(dateTime) {
            return moment(dateTime).format('YYYY-MM-DD hh:mm:ss');
        },
        getImagePath(path) {
            if (this.baseUrl && this.baseUrl.length > 1) {
                return this.baseUrl + path;
            } else {
                return path;
            }
        },
        loadAlerts() {
            this.showLoaderMutation();
            this.getAlertsAction({ caseId: this.caseId })
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
                    this.clearForm();
                    setTimeout(() => {
                        this.hideSnackbarMutation();
                    }, 3000);
                });
        },
        openEditAlert(item) {
            if (item.is_active) {
                bus.$emit('edit-alert-dialog-event', item);
            }
        }
    }
};
</script>

<style scoped>
</style>
