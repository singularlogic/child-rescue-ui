<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout v-if="isLoaded" row class="facilities">
        <v-flex xs12>
            <v-card>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Organization Facilities</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <router-link to="/facilities/new/" v-slot="{ href, route, navigate }">
                        <v-btn :href="href" @click="navigate" color="primary" dark>Add Facility</v-btn>
                    </router-link>
                </v-toolbar>
                <v-data-table
                    :headers="headers"
                    :items="facilities"
                    :search="search"
                    :pagination.sync="pagination"
                >
                    <template v-slot:items="props">
                        <tr @click="openFacility(props.item)">
                            <td class="text-xs-left">{{ props.item.id }}</td>
                            <td class="text-xs-left">{{ props.item.name || '-' }}</td>
                            <td class="text-xs-left">{{ props.item.email || '-' }}</td>
                            <td class="text-xs-left">{{ props.item.phone || '-' }}</td>
                            <td class="text-xs-left">{{ props.item.address || '-' }}</td>
                            <td class="text-xs-center">
                                <v-icon v-if="props.item.supports_hosting" color="green">house</v-icon>
                                <v-icon v-else color="gray">house</v-icon>
                            </td>
                            <td class="text-xs-center">{{ props.item.capacity || '-' }}</td>
                            <td class="justify-center layout px-0">
                                <!-- <v-icon
                                    v-if="props.item.is_active"
                                    style="color: green;"
                                    class="mr-2"
                                    :class="
                                        props.item.is_active
                                            ? 'active'
                                            : 'inactive'
                                    "
                                    @click.stop="toggleActivation(props.item)"
                                >toggle_on</v-icon>
                                <v-icon
                                    v-else
                                    style="color: red;"
                                    class="mr-2"
                                    :class="
                                        props.item.is_active
                                            ? 'active'
                                            : 'inactive'
                                    "
                                    @click.stop="toggleActivation(props.item)"
                                >toggle_off</v-icon> -->
                                <v-icon
                                    small
                                    class="mr-2"
                                    @click.stop="openEditFacility(props.item)"
                                >edit</v-icon>
                            </td>
                        </tr>
                    </template>
                    <v-alert
                        v-slot:no-results
                        :value="true"
                        color="error"
                        icon="warning"
                    >Your search for "{{ search }}" found no results.</v-alert>
                </v-data-table>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import { bus } from '../../../main';
import { dates, filters, fonts } from '@/utils/mixins';
import { FacilitiesApi } from '@/api';
import { SET_SNACKBAR_STATUS } from '@/store/mutation-types';

export default {
    components: {},
    mixins: [dates, filters, fonts],
    data() {
        return {
            isLoaded: false,
            facilities: [],
            search: '',
            pagination: { sortBy: 'start', descending: true, rowsPerPage: 10 },
            headers: [
                {
                    text: 'ID',
                    value: 'id',
                    width: '5%',
                },
                {
                    text: 'Name',
                    value: 'name',
                    width: '10%',
                },
                {
                    text: 'Email',
                    value: 'email',
                    width: '10%',
                },
                {
                    text: 'Phone',
                    value: 'phone',
                    sortable: false,
                    width: '10%',
                },
                {
                    text: 'Address',
                    value: 'address',
                    sortable: false,
                    width: '10%',
                },
                {
                    text: 'Is hosting',
                    value: 'supports_hosting',
                    align: 'center',
                    sortable: true,
                    width: '5%',
                },
                {
                    text: 'Capacity',
                    value: 'capacity',
                    align: 'center',
                    sortable: true,
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
        this.loadFacilities();
        this.initEvents();
    },
    methods: {
        async loadFacilities() {
            const { data: facilities } = await FacilitiesApi.all();
            this.facilities = facilities;
            this.isLoaded = true;
        },
        initEvents() {
            bus.$off('reload-users-event');
            bus.$on('reload-users-event', () => {
                this.loadFacilities();
            });
        },
        openEditFacility(facility) {
            this.$router.push({ name: 'facility_edit', params: { id: String(facility.id) } });
        },
        openFacility(facility) {
            this.$router.push({ name: 'facility', params: { id: String(facility.id) } });
        },
        async toggleActivation(item) {
            item.is_active = !item.is_active;
            const { data: facilityObject } = await FacilitiesApi.update(this.$store.state.organizationId, item, { facility_id: item.id });
            this.$store.commit(SET_SNACKBAR_STATUS, { message: 'Facility updated successfully!', color: 'primary' });
        },
    },
};
</script>

<style lang="scss">
.facilities {
    .customTile {
        margin: 5px;
        padding: 10px;
    }
    .active {
        color: green;
    }
    .inactive {
        color: red;
    }
}
</style>
