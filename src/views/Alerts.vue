<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded">
        <v-breadcrumbs :items="linkItems">
            <template v-slot:divider>
                <v-icon>chevron_right</v-icon>
            </template>
        </v-breadcrumbs>
        <v-card>
            <v-data-table :headers="headers" :items="alerts" :search="search" :pagination.sync="pagination">
                <template v-slot:items="props">
                    <tr @click="openAlert(props.item)">
                        <td class="text-xs-left">{{ props.item.start | formatDateTime }}</td>
                        <td class="text-xs-left">{{ props.item.end | formatDateTime }} {{ props.item.end_time }}</td>
                        <td class="text-xs-left">{{ props.item.fullname }}</td>
                        <td class="text-xs-left">{{ props.item.address }}</td>
                        <td class="text-xs-left">{{ props.item.radius }} km</td>
                        <td class="text-xs-left">{{ props.item.description | truncate(125, '...') }}</td>
                        <td class="text-xs-center">
                            <v-icon v-if="props.item.is_active" color="green">wifi_tethering</v-icon>
                            <v-icon v-else color="red">portable_wifi_off</v-icon>
                        </td>
                        <!-- <td class="justify-center layout px-0">
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
                        </td> -->
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
import { bus } from '../main';
import { dates, filters } from '@/utils/mixins';
import { AlertsApi } from '@/api';

export default {
    components: {},
    mixins: [dates, filters],
    data() {
        return {
            caseId: null,
            isLoaded: false,
            alerts: [],
            search: '',
            pagination: { sortBy: 'start', descending: true, rowsPerPage: 10 },
            headers: [
                {
                    text: 'START',
                    value: 'start',
                    width: '10%',
                },
                {
                    text: 'END',
                    value: 'end',
                    width: '10%',
                },
                {
                    text: 'CHILD',
                    value: 'fullname',
                    sortable: false,
                    width: '15%',
                },
                {
                    text: 'ADDRESS',
                    value: 'adress',
                    sortable: false,
                    width: '15%',
                },
                {
                    text: 'RADIUS',
                    value: 'radius',
                    sortable: false,
                    width: '5%',
                },
                {
                    text: 'DESCRIPTION',
                    value: 'description',
                    sortable: false,
                    width: '25%',
                },
                {
                    text: 'ACTIVE',
                    value: 'isActive',
                    align: 'center',
                    sortable: false,
                    width: '5%',
                },
                // {
                //     align: 'center',
                //     sortable: false,
                //     text: 'Actions',
                //     value: 'name',
                //     width: '5%',
                // },
            ],
            linkItems: [
                {
                    text: 'Home',
                    disabled: false,
                    href: '/',
                },
                {
                    text: 'Alerts',
                    disabled: true,
                    href: '/',
                },
            ],
        };
    },
    created() {
        this.caseId = this.$route.params.id;
        this.loadAlerts();
        bus.$off('reload-alerts-event');
        bus.$on('reload-alerts-event', () => {
            this.loadAlerts();
        });
    },
    methods: {
        async loadAlerts() {
            const { data: alerts } = await AlertsApi.all({ caseId: this.caseId });
            this.alerts = alerts;
            this.isLoaded = true;
        },
        openAlert(item) {
            bus.$emit('view-alert-dialog-event', item);
        },
        openEditAlert(item) {
            if (item.is_active) {
                bus.$emit('edit-alert-dialog-event', item);
            }
        },
    },
};
</script>
