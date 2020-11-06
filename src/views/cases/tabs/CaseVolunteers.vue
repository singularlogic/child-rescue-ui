<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded" style="padding: 10px;">
        <v-layout>
            <v-flex xs12>
                <v-toolbar v-if="$networkManagerAndAbove.includes($store.state.role) && (caseObject.status==='active' || caseObject.status==='inactive')">
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
                    <v-btn flat @click="openManageVolunteersDialog()" color="primary" dark>
                        {{ $t('volunteers.invite_volunteers') }}
                        <v-icon right>person_add</v-icon>
                    </v-btn>
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
                    <v-toolbar flat dense color="white">
                        <v-spacer></v-spacer>
                        <v-text-field
                            v-model="search"
                            append-icon="search"
                            :label="$t('volunteers.search')"
                            single-line
                            hide-details
                        ></v-text-field>
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
            </v-flex>
        </v-layout>
        <v-dialog v-model="manageVolunteersDialog" width="950">
            <v-card>
                <v-toolbar flat>
                    <v-toolbar-title class="mt-3">{{ $t('volunteers.select_volunteer') }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="dialogSearch"
                        prepend-icon="search"
                        clearable
                        :label="$t('volunteers.search')"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-toolbar>
                <v-card-text>
                    <v-textarea
                        v-model="invitationMessage" box
                        rows="4" row-height="50px"
                        :label="$t('volunteers.invitation_message')" :placeholder="$t('volunteers.invitation_message_placeholder')"
                        no-resize class="mx-2"
                    ></v-textarea>
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
                                    <v-checkbox :input-value="props.selected" primary hide-details :disabled='props.selected' :label="$t('volunteers.invited')"></v-checkbox>
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
                            {{ $t('volunteers.no_results') }}
                        </v-alert>
                    </v-data-table>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="manageVolunteersDialog = false;">{{ $t('volunteers.close') }}</v-btn>
                    <v-btn flat color="primary" @click="updateVolunteers()">{{ $t('volunteers.invite') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editVolunteerDialog" width="400">
            <v-card>
                <v-toolbar flat>
                    <v-toolbar-title>{{ $t('volunteers.edit_volunteer') }}</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text>
                    <v-list two-line>
                        <v-list-tile>
                            <v-layout>
                                <v-flex xs12 sm6 md6 lg6 xl6>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>{{ $t('volunteers.first_name') }}</v-list-tile-sub-title>
                                        <v-list-tile-title>{{ (selectedVolunteer.first_name || '') | title }}</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-flex>
                                <v-flex xs12 sm6 md6 lg6 xl6>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>{{ $t('volunteers.last_name') }}</v-list-tile-sub-title>
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
                                    <v-text-field v-model="selectedVolunteer.team_name" :label="$t('volunteers.team_name')" :placeholder="$t('volunteers.team_name')"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6 lg6 xl6 class="mr-2">
                                    <v-select :items="leaderOptions" v-model="selectedVolunteer.is_team_leader"
                                              :label="$t('volunteers.is_team_leader')" item-text="text" item-value="value" :hint="$t('volunteers.is_team_leader_hint')"
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
                    <v-btn flat @click="editVolunteerDialog = false; selectedVolunteer={};">{{ $t('volunteers.cancel') }}}}</v-btn>
                    <v-btn flat color="primary" @click="editVolunteer()">{{ $t('volunteers.update') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="removeVolunteerDialog" width="400">
            <v-card>
                <v-toolbar flat color="white">
                    <v-toolbar-title>{{ $t('volunteers.remove_volunteer') }}</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text>
                    <v-list two-line>
                        <v-list-tile>
                            <v-layout>
                                <v-flex xs12 sm6 md6 lg6 xl6>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>{{ $t('volunteers.first_name') }}</v-list-tile-sub-title>
                                        <v-list-tile-title>{{ (selectedVolunteer.first_name || '') | title }}</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-flex>
                                <v-flex xs12 sm6 md6 lg6 xl6>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>{{ $t('volunteers.last_name') }}</v-list-tile-sub-title>
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
                                        <v-list-tile-sub-title>{{ $t('volunteers.team_name') }}</v-list-tile-sub-title>
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
                    <v-btn color="" flat @click="removeVolunteerDialog = false; selectedVolunteer={};">{{ $t('volunteers.cancel') }}</v-btn>
                    <v-btn color="error" flat @click="removeVolunteer()">{{ $t('volunteers.remove') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
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
                    text: this.$t('volunteers.city'),
                    value: 'city',
                    width: '20%',
                    align: 'left',
                },
                {
                    text: this.$t('volunteers.first_name'),
                    value: 'first_name',
                    width: '20%',
                    align: 'left',
                },
                {
                    text: this.$t('volunteers.last_name'),
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
                    text: this.$t('volunteers.first_name'),
                    value: 'first_name',
                    width: '20%',
                },
                {
                    text: this.$t('volunteers.last_name'),
                    value: 'last_name',
                    width: '20%',
                },
                {
                    text: this.$t('volunteers.city'),
                    value: 'city',
                    width: '20%',
                },
                {
                    text: this.$t('volunteers.team_name'),
                    value: 'team_name',
                    width: '20%',
                },
                {
                    text: this.$t('volunteers.team_leader'),
                    align: 'left',
                    value: 'is_team_leader',
                    width: '5%',
                },
                {
                    text: this.$t('volunteers.invited'),
                    value: 'has_accept_invitation',
                    width: '5%',
                },
                {
                    align: 'center',
                    sortable: false,
                    text: this.$t('volunteers.actions'),
                    value: 'name',
                    width: '5%',
                },
            ],
            leaderOptions: [
                {
                    text: this.$t('volunteers.yes'),
                    value: true,
                },
                {
                    text: this.$t('volunteers.no'),
                    value: false,
                },
            ],
        };
    },
    computed: {
        ...mapGetters(['refreshVolunteers']),
    },
    async created() {
        this.caseId = this.$route.params.id;
        await this.loadVolunteers();
        const { data: caseObject } = await CasesApi.get(this.caseId);
        this.caseObject = caseObject;
        this.isLoaded = true;
        this.reloadVolunteers();
    },
    async destroyed () {
        await clearTimeout(this.timeoutFun);
    },
    async beforeDestroy() {
        await clearTimeout(this.timeoutFun);
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
        async reloadVolunteers() { // Check in onBeforeDestroy
            let flag = false;
            for (let index = 0; index < this.volunteers.length; index++) {
                if (this.volunteers[index].has_accept_invitation === null) {
                    flag = true;
                }
            }
            if (flag === false || this.$store.state.token === null || this.refreshVolunteers === false) clearTimeout(this.timeoutFun);
            else {
                await this.loadVolunteers();
                this.timeoutFun = setTimeout(this.reloadVolunteers, 5000);
            }
        },
        async updateVolunteers() {
            const userIds = this.selected.map(volunteer => volunteer.id);
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
