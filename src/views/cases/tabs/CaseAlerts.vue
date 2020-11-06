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
                    <v-btn flat v-if="caseObject.organization===$store.state.organizationId" dark color="red" v-on="on" @click="deactivateAlertsDialog=true;">
                        {{ $t('alert.deactivate_alerts') }}
                        <v-icon right>cancel</v-icon>
                    </v-btn>
                    <alert :case-id="caseObject.id" :case-alert-message="caseObject.default_message" :full-name="caseObject.fullName"></alert>
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
                    <v-data-table :headers="headers" :items="alerts" :search="search" :pagination.sync="pagination">
                        <template v-slot:items="props">
                            <tr @click="openAlert(props.item)">
                                <td class="text-xs-left">{{ props.item.start | formatDateTime }}</td>
                                <!-- <td class="text-xs-left">{{ props.item.organization_name }}</td>
                                <td class="text-xs-left">{{ props.item.fullname }}</td> -->
                                <td class="text-xs-left">{{ props.item.volunteers_only }}</td>
                                <td class="text-xs-left">{{ props.item.custom_name }}</td>
                                <td class="text-xs-left">{{ props.item.address }}</td>
                                <td class="text-xs-left">{{ props.item.radius }} km</td>
                                <td class="text-xs-left">{{ props.item.description | truncate(125, '...') }}</td>
                                <td class="text-xs-left">{{ props.item.end | formatDateTime }} {{ props.item.end_time }}</td>
                                <td class="text-xs-center">
                                    <v-icon v-if="props.item.is_active" color="green">wifi_tethering</v-icon>
                                    <v-icon v-else color="red">portable_wifi_off</v-icon>
                                </td>
                                <td class="justify-center layout px-0">
                                    <v-icon
                                        small
                                        class="mr-2"
                                        @click.stop="openAlert(props.item)"
                                    >visibility</v-icon>
                                    <v-icon v-if="props.item.is_active"
                                            small
                                            class="mr-2"
                                            @click.stop="openEditAlert(props.item)"
                                    >edit</v-icon>
                                    <v-icon v-if="!props.item.is_active"
                                            small
                                            class="mr-2"
                                            @click.stop="openCopyAlert(props.item)"
                                    >file_copy</v-icon>
                                </td>
                            </tr>
                        </template>
                        <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                            {{ $t('case_alerts.no_results') }}
                        </v-alert>
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
        <v-dialog v-model="deactivateAlertsDialog" width="500">
            <v-card>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <span>{{ $t('alert.deactivate_alerts') }}</span>
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text class="mx-2">
                    <span>{{ $t('alert.deactivate_alerts_message') }}</span>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="" flat @click="deactivateAlertsDialog = false;">{{ $t('alert.close') }}</v-btn>
                    <v-btn color="red" flat @click="deactivateAlerts()">{{ $t('alert.deactivate') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { bus } from '../../../main';
import Alert from '@/components/Alert.vue';
import { dates, filters, fonts } from '@/utils/mixins';
import { CasesApi, AlertsApi } from '@/api';

export default {
    components: {
        alert: Alert,
    },
    mixins: [dates, filters, fonts],
    data() {
        return {
            deactivateAlertsDialog: false,
            caseId: null,
            caseObject: {},
            isLoaded: false,
            alerts: [],
            search: '',
            pagination: { sortBy: 'start', descending: true, rowsPerPage: 10 },
            headers: [
                {
                    text: this.$t('case_alerts.start'),
                    value: 'start',
                    width: '10%',
                },
                // {
                //     text: this.$t('case_alerts.organization'),
                //     value: 'organization_name',
                //     sortable: true,
                //     width: '15%',
                // },
                // {
                //     text: this.$t('case_alerts.full_name'),
                //     value: 'fullname',
                //     sortable: true,
                //     width: '15%',
                // },
                {
                    text: this.$t('case_alerts.volunteerd_only'),
                    value: 'volunteerd_only',
                    sortable: true,
                    width: '15%',
                },
                {
                    text: this.$t('case_alerts.custom_name'),
                    value: 'custom_name',
                    sortable: true,
                    width: '15%',
                },
                {
                    text: this.$t('case_alerts.address'),
                    value: 'adress',
                    sortable: false,
                    width: '15%',
                },
                {
                    text: this.$t('case_alerts.radius'),
                    value: 'radius',
                    sortable: false,
                    width: '10%',
                },
                {
                    text: this.$t('case_alerts.description'),
                    value: 'description',
                    sortable: false,
                    width: '25%',
                },
                {
                    text: this.$t('case_alerts.end'),
                    value: 'end',
                    width: '10%',
                },
                {
                    text: this.$t('case_alerts.active'),
                    value: 'isActive',
                    sortable: false,
                    align: 'center',
                    width: '5%',
                },
                {
                    align: 'center',
                    sortable: false,
                    text: this.$t('case_alerts.actions'),
                    value: 'name',
                    width: '5%',
                },
            ],
        };
    },
    async created() {
        this.caseId = this.$route.params.id;
        await this.loadAlerts();
        bus.$off('reload-alerts-event');
        bus.$on('reload-alerts-event', async () => {
            await this.loadAlerts();
        });
        const { data: caseObject } = await CasesApi.get(this.caseId);
        this.caseObject = caseObject;
        this.caseObject.fullName = `${caseObject.first_name} ${caseObject.last_name}`;
        this.isLoaded = true;
    },
    methods: {
        async loadAlerts() {
            const { data: alerts } = await AlertsApi.all({ caseId: this.caseId });
            this.alerts = alerts;
            console.log(alerts);
        },
        openAlert(item) {
            bus.$emit('view-alert-dialog-event', item);
        },
        openEditAlert(item) {
            if (item.is_active) {
                bus.$emit('edit-alert-dialog-event', item);
            }
        },
        openCopyAlert(item) {
            if (!item.is_active) {
                bus.$emit('copy-alert-dialog-event', item);
            }
        },
        async deactivateAlerts() {
            const { data: response } = await CasesApi.deactivateAlerts(this.caseId);
            this.loadAlerts();
            this.deactivateAlertsDialog = false;
        },
    },
};
</script>
