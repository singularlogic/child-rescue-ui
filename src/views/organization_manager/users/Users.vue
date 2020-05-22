<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout v-if="isLoaded" row class="organization">
        <v-flex xs12>
            <v-card >
                <v-toolbar flat color="white">
                    <v-toolbar-title>{{ $t('user.organization_users') }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <router-link to="/users/new/" v-slot="{ href, route, navigate}">
                        <v-btn :href="href" @click="navigate" color="primary" dark>{{ $t('user.add_user') }}</v-btn>
                    </router-link>
                </v-toolbar>
                <v-data-table :headers="headers" :items="users" :search="search" :pagination.sync="pagination">
                    <template v-slot:items="props">
                        <tr v-if="props.item.role!=='organization_manager'" @click="openUser(props.item)">
                            <td class="text-xs-left">{{ props.item.id }}</td>
                            <td class="text-xs-left">{{ props.item.email }}</td>
                            <td class="text-xs-left">{{ props.item.role | customTitle('_') }}</td>
                            <td class="text-xs-left">{{ props.item.city || ' - ' | title }}</td>
                            <td class="text-xs-left">{{ props.item.first_name || '' | title }}</td>
                            <td class="text-xs-left">{{ props.item.last_name || '' | title }}</td>
                            <td class="text-xs-left">{{ props.item.facility_name ||  '' | title }}</td>
                            <td class="text-xs-center">
                                <div v-if="props.item.role!='volunteer'">
                                    <v-icon v-if="props.item.is_hosting_facility" color="green">house</v-icon>
                                    <v-icon v-else color="gray">house</v-icon>
                                </div>
                            </td>
                            <td class="justify-center layout px-0">
                                <v-icon
                                    v-if="props.item.is_active"
                                    style="color: green;"
                                    class="mr-2"
                                    :class="props.item.is_active ? 'activeUser' : 'inactiveUser'"
                                    @click.stop="toggleActivation(props.item)"
                                >toggle_on</v-icon>
                                <v-icon
                                    v-else
                                    style="color: red;"
                                    class="mr-2"
                                    :class="props.item.is_active ? 'activeUser' : 'inactiveUser'"
                                    @click.stop="toggleActivation(props.item)"
                                >toggle_off</v-icon>
                                <v-icon
                                    small
                                    class="mr-2"
                                    @click.stop="openEditUser(props.item)"
                                >edit</v-icon>
                            </td>
                        </tr>
                    </template>
                    <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                        {{ $t('user.no_results') }}
                    </v-alert>
                </v-data-table>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import { bus } from '../../../main';
import { dates, filters, fonts } from '@/utils/mixins';
import { UsersApi } from '@/api';
import { SET_SNACKBAR_STATUS } from '@/store/mutation-types';

export default {
    components: {},
    mixins: [dates, filters, fonts],
    data() {
        return {
            isLoaded: false,
            users: [],
            search: '',
            pagination: { sortBy: 'start', descending: true, rowsPerPage: 10 },
            headers: [
                {
                    text: 'ID',
                    value: 'id',
                    width: '5%',
                },
                {
                    text: 'Email',
                    value: 'email',
                    width: '10%',
                },
                {
                    text: this.$t('user.role'),
                    value: 'role',
                    sortable: true,
                    width: '10%',
                },
                {
                    text: this.$t('user.city'),
                    value: 'city',
                    sortable: true,
                    width: '15%',
                },
                {
                    text: this.$t('user.first_name'),
                    value: 'first_name',
                    sortable: true,
                    width: '10%',
                },
                {
                    text: this.$t('user.last_name'),
                    value: 'last_name',
                    sortable: true,
                    width: '10%',
                },
                {
                    text: this.$t('user.facility'),
                    value: 'facility_name',
                    sortable: true,
                    width: '10%',
                },
                {
                    text: this.$t('user.is_hosting'),
                    value: 'is_hosting_facility',
                    align: 'center',
                    sortable: true,
                    width: '5%',
                },
                {
                    align: 'center',
                    sortable: false,
                    text: this.$t('user.actions'),
                    value: 'name',
                    width: '5%',
                },
            ],
        };
    },
    created() {
        this.loadUsers();
        this.initEvents();
    },
    methods: {
        async loadUsers() {
            const { data: users } = await UsersApi.getUsers();
            this.users = users;
            this.isLoaded = true;
        },
        initEvents() {
            bus.$off('reload-users-event');
            bus.$on('reload-users-event', () => {
                this.loadUsers();
            });
        },
        openEditUser(user) {
            this.$router.push({ name: 'user_edit', params: { id: String(user.id) } });
        },
        openUser(user) {
            this.$router.push({ name: 'user', params: { id: String(user.id) } });
        },
        async toggleActivation(item) {
            item.is_active = !item.is_active;
            const { data: userObject } = await UsersApi.updateUser(item);
            this.$store.commit(SET_SNACKBAR_STATUS, { message: this.$t('user.update_success'), color: 'primary' });
        },
    },
};
</script>

<style>
.customTile {
    margin: 5px;
    padding: 10px;
}
.activeUser {
    color: green;
}
.inactiveUser {
    color: red;
}
</style>
