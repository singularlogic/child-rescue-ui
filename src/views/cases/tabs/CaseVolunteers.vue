<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>
        <v-card v-if="isLoaded">
            <v-toolbar v-if="$networkManagerAndAbove.includes($store.state.role) && (caseObject.status==='active' || caseObject.status==='inactive')" dense flat color="white">
                <v-text-field
                    v-model="search"
                    append-icon="search"
                    :label="$t('volunteers.search')"
                    single-line
                    hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-btn @click="openManageVolunteersDialog()" color="primary" dark>{{ $t('volunteers.invite_volunteers') }}</v-btn>
            </v-toolbar>
            <v-data-table :headers="headers" :items="volunteers" :search="search" :pagination.sync="pagination" height="500px;">
                <template v-slot:items="props">
                    <tr>
                        <td class="text-xs-left">{{ props.item.email }}</td>
                        <td class="text-xs-left">{{ props.item.first_name || ' - ' | title }}</td>
                        <td class="text-xs-left">{{ props.item.last_name || ' - ' | title }}</td>
                        <td class="text-xs-left">{{ props.item.city || ' - ' | title }}</td>
                        <td class="text-xs-left">{{ props.item.team_name || ' - ' | title }}</td>
                        <td class="text-xs-left">
                            <v-icon v-if="props.item.is_team_leader" color="green">check</v-icon>
                        </td>
                        <td class="text-xs-left">
                            <v-icon v-if="props.item.has_accept_invitation===true" color="green">check</v-icon>
                            <v-icon v-else-if="props.item.has_accept_invitation===false" color="error">close</v-icon>
                            <v-icon v-else color="warning">timelapse</v-icon>
                        </td>
                        <td class="justify-center layout px-0">
                            <template v-if="$networkManagerAndAbove.includes($store.state.role) && caseObject.status!='closed'">
                                <v-icon v-if="props.item.has_accept_invitation" small class="mr-2" @click.stop="openEditVolunteerDialog(props.item)">edit</v-icon>
                                <v-icon small class="mr-2" @click.stop="openRemoveVolunteerDialog(props.item)">delete</v-icon>
                            </template>
                        </td>
                    </tr>
                </template>
                <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                    {{ $t('volunteers.no_results') }}
                </v-alert>
            </v-data-table>
        </v-card>
        <v-dialog v-model="manageVolunteersDialog" width="700">
            <v-card>
                <v-toolbar flat color="white">
                    <v-toolbar-title class="mt-3">Select volunteers for the case</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="dialogSearch"
                        prepend-icon="search"
                        clearable
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-toolbar>
                <v-data-table :headers="allVolunteerHeaders" :items="formatted" v-model="selected" :search="dialogSearch" style="margin-top:-5px;">
                    <template v-slot:items="props">
                        <tr v-if="props.item.selected" :active="props.selected">
                            <td>
                                <v-chip label small color="primary">Invited</v-chip>
                            </td>
                            <td class="text-xs-left">{{ props.item.email }}</td>
                            <td class="text-xs-left">{{ props.item.city || ' - ' | title }}</td>
                            <td class="text-xs-left">{{ props.item.first_name || ' - ' | title }}</td>
                            <td class="text-xs-left">{{ props.item.last_name || ' - ' | title }}</td>
                        </tr>
                        <tr v-else-if="props.item.last_login !== null" :active="props.selected" @click="props.selected = toggleSelection(props.selected)">
                            <td>
                                <v-checkbox :input-value="props.selected" primary hide-details :disabled='props.selected' label="Invite"></v-checkbox>
                            </td>
                            <td class="text-xs-left">{{ props.item.email }}</td>
                            <td class="text-xs-left">{{ props.item.city || ' - ' | title }}</td>
                            <td class="text-xs-left">{{ props.item.first_name || ' - ' | title }}</td>
                            <td class="text-xs-left">{{ props.item.last_name || ' - ' | title }}</td>
                        </tr>
                        <tr v-else :active="props.selected">
                            <td>
                                <v-chip label small>Not verified</v-chip>
                            </td>
                            <td class="text-xs-left">{{ props.item.email }}</td>
                            <td class="text-xs-left">{{ props.item.city || ' - ' | title }}</td>
                            <td class="text-xs-left">{{ props.item.first_name || ' - ' | title }}</td>
                            <td class="text-xs-left">{{ props.item.last_name || ' - ' | title }}</td>
                        </tr>
                    </template>
                    <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                        Your search for "{{ search }}" found no results.
                    </v-alert>
                </v-data-table>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-textarea
                        v-model="invitationMessage" outline
                        rows="2" row-height="50px"
                        label="Invitation message" placeholder="Write a message for invitations..."
                        no-resize class="mx-2"
                    ></v-textarea>
                    <v-btn color="" @click="manageVolunteersDialog = false;">Close</v-btn>
                    <v-btn color="primary" @click="updateVolunteers()">Invite</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editVolunteerDialog" width="400">
            <v-card>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Edit volunteer</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text>
                    <v-list two-line>
                        <v-list-tile>
                            <v-layout>
                                <v-flex xs12 sm6 md6 lg6 xl6>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>First name</v-list-tile-sub-title>
                                        <v-list-tile-title>{{ (selectedVolunteer.first_name || '') | title }}</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-flex>
                                <v-flex xs12 sm6 md6 lg6 xl6>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>Last name</v-list-tile-sub-title>
                                        <v-list-tile-title>{{ (selectedVolunteer.last_name || '') | title }}</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-flex>
                            </v-layout>
                        </v-list-tile>
                        <v-list-tile>
                            <v-layout>
                                <v-flex xs12 sm12 md12 lg12 xl12>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>Email</v-list-tile-sub-title>
                                        <v-list-tile-title>{{ (selectedVolunteer.email || '') }}</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-flex>
                            </v-layout>
                        </v-list-tile>
                        <v-list-tile>
                            <v-layout>
                                <v-flex xs12 sm6 md6 lg6 xl6 class="mr-2">
                                    <v-text-field v-model="selectedVolunteer.team_name" label="Team name" placeholder="Name"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6 lg6 xl6 class="mr-2">
                                    <v-select :items="leaderOptions" v-model="selectedVolunteer.is_team_leader"
                                              label="Is team leader" item-text="text" item-value="value" hint="Set as team leader."
                                              style="margin-right:5px;">
                                    </v-select>
                                </v-flex>
                            </v-layout>
                        </v-list-tile>
                    </v-list>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="" flat @click="editVolunteerDialog = false; selectedVolunteer={};">Cancel</v-btn>
                    <v-btn color="primary" flat @click="editVolunteer()">Update</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="removeVolunteerDialog" width="400">
            <v-card>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Remove volunteer from the case</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text>
                    <v-list two-line>
                        <v-list-tile>
                            <v-layout>
                                <v-flex xs12 sm6 md6 lg6 xl6>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>First name</v-list-tile-sub-title>
                                        <v-list-tile-title>{{ (selectedVolunteer.first_name || '') | title }}</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-flex>
                                <v-flex xs12 sm6 md6 lg6 xl6>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>Last name</v-list-tile-sub-title>
                                        <v-list-tile-title>{{ (selectedVolunteer.last_name || '') | title }}</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-flex>
                            </v-layout>
                        </v-list-tile>
                        <v-list-tile>
                            <v-layout>
                                <v-flex xs12 sm6 md6 lg6 xl6>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>Email</v-list-tile-sub-title>
                                        <v-list-tile-title>{{ (selectedVolunteer.email || '') }}</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-flex>
                                <v-flex xs12 sm6 md6 lg6 xl6>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>Team name</v-list-tile-sub-title>
                                        <v-list-tile-title>{{ (selectedVolunteer.team_name || ' - ') }}</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-flex>
                            </v-layout>
                        </v-list-tile>
                    </v-list>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="" flat @click="removeVolunteerDialog = false; selectedVolunteer={};">Cancel</v-btn>
                    <v-btn color="error" flat @click="removeVolunteer()">Remove</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import * as R from 'ramda';
import { dates, filters, fonts } from '@/utils/mixins';
import { UsersApi, CasesApi } from '@/api';

export default {
    components: {},
    mixins: [dates, filters, fonts],
    data() {
        return {
            invitationMessage: '',
            formatted: [],
            selectedVolunteer: {},
            editVolunteerDialog: false,
            manageVolunteersDialog: false,
            removeVolunteerDialog: false,
            selected: [],
            caseId: null,
            caseObject: {},
            isLoaded: false,
            volunteers: [],
            allVolunteers: [],
            search: '',
            dialogSearch: '',
            pagination: { sortBy: 'start', descending: true, rowsPerPage: 10 },
            allVolunteerHeaders: [
                {
                    text: '',
                    value: '',
                    width: '1%',
                    align: '',
                    sortable: false,
                },
                {
                    text: 'Email',
                    value: 'email',
                    width: '15%',
                    align: 'left',
                },
                {
                    text: 'City',
                    value: 'city',
                    width: '20%',
                    align: 'left',
                },
                {
                    text: 'First name',
                    value: 'first_name',
                    width: '20%',
                    align: 'left',
                },
                {
                    text: 'Last name',
                    value: 'last_name',
                    width: '20%',
                    align: 'left',
                },
            ],
            headers: [
                {
                    text: 'Email',
                    value: 'email',
                    width: '15%',
                },
                {
                    text: 'First name',
                    value: 'first_name',
                    width: '20%',
                },
                {
                    text: 'Last name',
                    value: 'last_name',
                    width: '20%',
                },
                {
                    text: 'City',
                    value: 'city',
                    width: '20%',
                },
                {
                    text: 'Team',
                    value: 'team_name',
                    width: '20%',
                },
                {
                    text: 'Team leader',
                    align: 'left',
                    value: 'is_team_leader',
                    width: '5%',
                },
                {
                    text: 'Invited',
                    value: 'has_accept_invitation',
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
            leaderOptions: [
                {
                    text: 'Yes',
                    value: true,
                },
                {
                    text: 'No',
                    value: false,
                },
            ],
        };
    },
    computed: {
    },
    async created() {
        this.caseId = this.$route.params.id;
        await this.loadVolunteers();
        const { data: caseObject } = await CasesApi.get(this.caseId);
        this.caseObject = caseObject;
        this.isLoaded = true;
    },
    methods: {
        toggleSelection(selected) {
            if (selected === undefined) {
                return true;
            }
            return !selected;
        },
        toggleAll() {
            if (this.selected.length) this.selected = [];
            else this.selected = this.allVolunteers.slice();
        },
        async loadVolunteers() {
            const { data: volunteers } = await CasesApi.getVolunteers(this.caseId);
            this.volunteers = volunteers;
            const { data: allVolunteers } = await UsersApi.getUsers({ role: 'volunteer' });
            this.allVolunteers = allVolunteers;
            this.selected = this.allVolunteers.filter(volunteer => volunteers.find(caseVolunteer => volunteer.id === caseVolunteer.user));
            this.formatted = this.allVolunteers.map((volunteer) => {
                for (let i = 0; i < this.volunteers.length; i++) {
                    if (volunteer.id === this.volunteers[i].user) {
                        volunteer.selected = true;
                        break;
                    } else {
                        volunteer.selected = false;
                    }
                }
                return volunteer;
            });
        },
        openManageVolunteersDialog() {
            this.invitationMessage = '';
            this.manageVolunteersDialog = true;
            this.selected = this.allVolunteers.filter(volunteer => this.volunteers.find(caseVolunteer => volunteer.id === caseVolunteer.user));
        },
        async updateVolunteers() {
            const userIds = this.selected.map(volunteer => volunteer.id);
            console.log(this.invitationMessage);
            const { data: volunteers } = await CasesApi.addVolunteers(this.caseId, { userIds, message: this.invitationMessage });
            this.manageVolunteersDialog = false;
            this.loadVolunteers();
        },
        openEditVolunteerDialog(volunteer) {
            this.editVolunteerDialog = true;
            this.selectedVolunteer = R.clone(volunteer);
        },
        async editVolunteer() {
            await CasesApi.editVolunteer(this.caseId, this.selectedVolunteer);
            this.editVolunteerDialog = false;
            this.selectedVolunteer = {};
            this.loadVolunteers();
        },
        openRemoveVolunteerDialog(volunteer) {
            this.removeVolunteerDialog = true;
            this.selectedVolunteer = volunteer;
        },
        async removeVolunteer() {
            await CasesApi.removeVolunteer(this.caseId, this.selectedVolunteer.id);
            this.removeVolunteerDialog = false;
            this.selectedVolunteer = {};
            this.loadVolunteers();
        },
    },
};
</script>

<style scoped>
    .blueName {
        color: #3B5998
    }
</style>
