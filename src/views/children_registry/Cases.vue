<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="loaded" align-center justify-center wrap class="content">
        <v-breadcrumbs :items="linkItems">
            <template v-slot:divider>
                <v-icon>chevron_right</v-icon>
            </template>
        </v-breadcrumbs>
        <v-layout align-center justify-center wrap>
            <v-flex xs12 sm12 md12 lg12 xl12>
                <v-card>
                    <v-toolbar flat color="white">
                        <h2>Children Registry</h2>
                        <v-spacer></v-spacer>
                        <v-text-field
                            style="max-width: 200px;"
                            v-model="search"
                            append-icon="search"
                            label="Search"
                            single-line
                            hide-details
                        ></v-text-field>
                    </v-toolbar>
                    <v-data-table
                        :headers="headers"
                        :items="cases"
                        :search="search"
                        :pagination.sync="pagination"
                        :rows-per-page-items="[10,20]"
                    >
                        <template v-slot:items="props">
                            <tr @click="loadFacilityCase(props.item)">
                                <td class="text-xs-left">{{ props.item.first_name | title }}</td>
                                <td class="text-xs-left">{{ props.item.last_name | title }}</td>

                                <td class="text-xs-left">{{ props.item.current_facility }}</td>

                                <td class="text-xs-left">{{ props.item.status }}</td>
                                <td v-if="props.item.presence_status==='not_present'" class="text-xs-left">not present</td>
                                <td v-else class="text-xs-left">{{ props.item.presence_status }}</td>

                                <td class="text-xs-left">{{ props.item.disappearance_date | formatDateTimeMinutes }}</td>

                                <td class="text-xs-left">{{ props.item.gender }}</td>
                                <td class="text-xs-left">{{ props.item.medical_treatment_required }}</td>
                                <td class="text-xs-left">{{ props.item.nationality }}</td>

                                <td class="text-xs-left">{{ props.item.child }}</td>
                            </tr>
                        </template>
                        <template v-slot:no-results>
                            <v-alert :value="true" color="error" icon="warning">
                                Your search for "{{ search }}" found no results
                            </v-alert>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import { dates, fonts } from '@/utils/mixins';
import { CasesApi } from '@/api';


export default {
    mixins: [dates, fonts],
    data() {
        return {
            cases: [],
            pagination: { rowsPerPage: 10 },
            search: '',
            headers: [
                {
                    align: 'left',
                    sortable: true,
                    text: 'First Name',
                    value: 'first_name',
                },
                {
                    align: 'left',
                    sortable: true,
                    text: 'Last Name',
                    value: 'last_name',
                },
                {
                    align: 'left',
                    sortable: true,
                    text: 'Hosted in facility',
                    value: 'hosted_in_facility',
                },
                {
                    align: 'left',
                    sortable: true,
                    text: 'Status',
                    value: 'status',
                },
                {
                    align: 'left',
                    sortable: true,
                    text: 'Presence',
                    value: 'presence',
                },
                {
                    align: 'left',
                    sortable: true,
                    text: 'Disappearance date',
                    value: 'disappearance_date',
                },
                {
                    align: 'left',
                    sortable: true,
                    text: 'Gender',
                    value: 'gender',
                },
                {
                    align: 'left',
                    sortable: true,
                    text: 'Medical treatment',
                    value: 'medical_treatment_required',
                },
                {
                    align: 'left',
                    sortable: true,
                    text: 'Nationality',
                    value: 'nationality',
                },
                {
                    align: 'left',
                    sortable: true,
                    text: 'Child ID',
                    value: 'child',
                },
            ],
            loaded: false,
            linkItems: [
                {
                    text: 'Home',
                    disabled: false,
                    href: '/',
                },
                {
                    text: 'Children Registry',
                    disabled: true,
                    href: '/children_registry',
                },
            ],
        };
    },
    created() {
        this.loadCases();
    },
    methods: {
        async loadCases() {
            const { data: cases } = await CasesApi.all();
            this.cases = cases;
            this.loaded = true;
        },
        loadFacilityCase(facilityCaseObject) {
            this.$router.push({
                name: 'manage_facility_child',
                params: { id: facilityCaseObject.id },
            });
        },
    },
};
</script>

<style scoped>
    .tile_background {
        height: 165px;
        background-color: #C3C3C3;
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
