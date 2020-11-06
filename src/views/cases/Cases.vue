<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout v-if="isLoaded" align-space-between justify-center row fill-height style="padding: 10px;">
        <v-flex xs12>
            <v-layout column justify-center fill-height>
                <v-flex>
                    <v-toolbar>
                        <v-toolbar-title v-if="$store.state.role!=='facility_manager'" style="width: 200px;">
                            <v-select
                                v-model="selectedSort"
                                :items="sortItems"
                                :label="$t('cases.sort_by')"
                                class="mt-3"
                                @change="applySort()"
                            ></v-select>
                        </v-toolbar-title>
                        <v-toolbar-title v-if="$store.state.role!=='facility_manager'" style="width: 100px;">
                            <v-select
                                v-model="selectedFilter"
                                :items="filterItems"
                                :label="$t('cases.filter_by')"
                                class="mt-3"
                                @change="applyFilter()"
                            ></v-select>
                        </v-toolbar-title>
                        <v-toolbar-title v-if="$store.state.role==='facility_manager'" style="width: 200px;">
                            <v-select
                                v-model="facilitySelectedSort"
                                :items="facilitySortItems"
                                :label="$t('cases.sort_by')"
                                class="mt-3"
                                @change="facilityApplySort()"
                            ></v-select>
                        </v-toolbar-title>
                        <v-toolbar-title v-if="$store.state.role==='facility_manager'" style="width: 100px;">
                            <v-select
                                v-model="facilitySelectedFilter"
                                :items="facilityFilterItems"
                                :label="$t('cases.filter_by')"
                                class="mt-3"
                                @change="facilityApplyFilter()"
                            ></v-select>
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn flat v-if="$store.state.role !== 'network_manager'" dark color="cyan lighten-1" @click="openSearchCaseDialog()">
                            {{ $t('cases.search') }}<v-icon right>search</v-icon>
                        </v-btn>
                        <v-btn flat v-if="$caseManagerAndAbove.includes($store.state.role)" dark color="#F4B350" @click="loadCaseManagement">
                            {{ $t('cases.create') }}<v-icon right>create_new_folder</v-icon>
                        </v-btn>
                        <v-btn v-else-if="$store.state.role === 'facility_manager'" dark color="#F4B350" @click="loadCaseManagement">
                            <v-icon left>add</v-icon>{{ $t('cases.add_child') }}
                        </v-btn>
                    </v-toolbar>
                </v-flex>
                <br/>
                <v-flex v-if="cases.length >= 1" fill-height>
                    <v-layout v-if="$store.state.role!=='facility_manager'" row wrap>
                        <v-flex xs12 sm6 md3 lg3 xl2 v-for="item in cases" :key="item.id" @click="loadCase(item)">
                            <v-card class="clickable_card" tile style="padding: 5px; margin: 5px 15px 15px 15px;">
                                <v-img :src="getImagePath(item.profile_photo)" height="165px" class="tile_background">
                                    <v-container fluid pa-2>
                                        <v-tooltip v-if="item.amber_alert" bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-chip v-on="on" small label dark color="warning">
                                                    <v-icon>warning</v-icon>
                                                </v-chip>
                                            </template>
                                            <span><b>{{ $t('case_info.amber_alert') }}</b></span>
                                        </v-tooltip>
                                        <v-tooltip v-if="item.status === 'active'" bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-chip v-on="on" small label dark color="blue-grey darken-3">
                                                    <v-icon>person_search</v-icon>
                                                </v-chip>
                                            </template>
                                            <span><b>Missing</b></span>
                                        </v-tooltip>
                                        <v-tooltip v-if="item.status === 'closed'" bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-chip v-on="on" small label dark color="teal darken-5">
                                                    <v-icon>search_off</v-icon>
                                                </v-chip>
                                            </template>
                                            <span><b>{{ item.status | title }}</b></span>
                                        </v-tooltip>
                                        <div v-if="item.organization!==$store.state.organizationId" style="margin-top: 90px;">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-chip v-on="on" small label dark color="indigo lighten-2">
                                                        <v-icon>folder_shared</v-icon>
                                                    </v-chip>
                                                </template>
                                                <span>{{ $t('cases.shared_by') }}<b>{{item.organization_name}}</b></span>
                                            </v-tooltip>
                                        </div>
                                        <div v-if="item.organization===$store.state.organizationId && item.is_shared===true" style="margin-top: 90px;">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-chip v-on="on" small label dark color="primary">
                                                        <v-icon>share</v-icon>
                                                    </v-chip>
                                                </template>
                                                <span>{{ $t('cases.is_shared') }}</span>
                                            </v-tooltip>
                                        </div>
                                        <v-tooltip v-if="item.status === 'inactive' && item.presence_status === 'transit'" bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-chip v-on="on" small label dark color="pink darken-1">
                                                    <v-icon>local_taxi</v-icon>
                                                </v-chip>
                                            </template>
                                            <span><b>{{ $t('case_info.transit_small') | title }}</b></span>
                                        </v-tooltip>
                                        <v-tooltip v-if="item.status === 'inactive' && item.presence_status !== 'transit'" bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-chip v-on="on" small label dark color="green darken-1">
                                                    <v-icon>person</v-icon>
                                                </v-chip>
                                            </template>
                                            <span><b>{{ $t('case_info.inactive') | title }}</b></span>
                                        </v-tooltip>
                                        <!-- <v-layout align-start justify-start row>
                                            <v-flex v-if="item.status === 'archived'" class="tile_background_tag_right">
                                                <span style="background-color: #8c3404; padding: 5px; border-radius: 2px;">{{ item.status }}</span>
                                            </v-flex>
                                        </v-layout> -->
                                    </v-container>
                                </v-img>
                                <v-list>
                                    <v-divider></v-divider>
                                    <v-list-tile>
                                        <v-list-tile-content style="margin-left:-10px;">
                                            <v-list-tile-title style="text-align: left; font-size: medium; font-weight: bold;">{{ item.first_name | title }} {{ item.last_name | title }}</v-list-tile-title>
                                            <v-list-tile-sub-title v-if="item.status === 'inactive'" style="text-align: left; color: #C0C0C0;">
                                                {{ $t('cases.arrival_at_facility') }}:<b>{{item.arrival_date | formatDate }}</b>
                                            </v-list-tile-sub-title>
                                            <v-list-tile-sub-title v-else style="text-align: left; color: #C0C0C0;">
                                                {{ $t('cases.missing_from') }}:<b>{{item.disappearance_date | formatDate }}</b>
                                            </v-list-tile-sub-title>
                                        </v-list-tile-content>
                                        <v-list-tile-action v-if="item.status==='active' && belongsToOrganization(item)" style="margin-right:-15px;">
                                            <v-btn @click.stop="openShareDialog(item)" fab small dark color="primary">
                                                <v-icon dark>share</v-icon>
                                            </v-btn>
                                        </v-list-tile-action>
                                    </v-list-tile>
                                </v-list>
                            </v-card>
                        </v-flex>
                    </v-layout>
                    <v-layout v-else row wrap>
                        <v-flex xs12 sm6 md3 lg3 xl2 v-for="item in cases" :key="item.id" @click="loadCase(item)">
                            <v-card class="clickable_card" tile style="padding: 5px; margin: 5px 15px 15px 15px;">
                                <v-img :src="getImagePath(item.profile_photo)" height="165px" class="tile_background">
                                    <v-container fill-height fluid pa-2>
                                        <v-layout justify-space-between class="tile_background_tags">
                                            <v-flex v-if="item.presence_status === 'present'" class="tile_background_tag_right">
                                                <span style="background-color: green; padding: 5px; border-radius: 2px;">present</span>
                                            </v-flex>
                                            <v-flex v-if="item.presence_status === 'not_present'" class="tile_background_tag_right">
                                                <span style="background-color: #2FD1D4; padding: 5px; border-radius: 2px;">not present</span>
                                            </v-flex>
                                            <v-flex v-if="item.status === 'active'" class="tile_background_tag_right">
                                                <span style="background-color: red; padding: 5px; border-radius: 2px;">missing</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-img>
                                <div style="text-align: left; font-size: medium; font-weight: bold; margin-top: 10px;">
                                    {{ item.first_name | title }} {{ item.last_name | title }}</div>
                                <div style="text-align: left; color: #C0C0C0;">
                                    {{ $t('cases.arrival_date') }}:<b>{{item.arrival_date | formatDate }}</b>
                                </div>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex v-else fill-height style="background-color: #C3C3C3;" text-xs-center>
                    <v-layout align-center justify-center style="height: 100%;">
                        <v-flex><h3 style="margin-top: 0px;" class="display-1">{{ $t('cases.no_records') }}</h3></v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-dialog v-model="searchCaseDialog" width="500" persistent @keydown.esc="searchCaseDialog=false;">
            <v-card>
                <v-toolbar>
                    <v-toolbar-title class='title'>{{ $t('cases.search_child') }}</v-toolbar-title>
                </v-toolbar>
                <v-toolbar flat color="white">
                    <v-text-field label="Child name" flat class="mt-2" v-model="searchName"></v-text-field>
                </v-toolbar>
                <v-divider></v-divider>
                <v-list v-if="children.length > 0" two-line class="mx-2" style="height: 500px; overflow-y: scroll;">
                    <template v-for="(item, index) in children">
                        <v-subheader v-if="item.header" :key="item.header">{{ item.header }}</v-subheader>
                        <!-- <v-divider v-else-if="item.divider" :key="index" :inset="item.inset"></v-divider> -->
                        <v-list-tile v-else :key="item.title" avatar>
                            <!-- <v-avatar style="background-color: #CCC" size=36 class="mr-2">{{ item.rank }}</v-avatar> -->
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.first_name | title }} {{ item.last_name | title }}</v-list-tile-title>
                                <v-list-tile-sub-title><v-chip small label style="margin-left: -5px;">{{ item.status }}</v-chip></v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-btn v-if="item.status !== 'active'" @click="createNewCase(item)" icon color="primary" dark><v-icon>create_new_folder</v-icon></v-btn>
                            <v-btn v-if="item.status !== 'archived'" @click="goToCase(item.case_id)" icon color="blue" dark><v-icon>folder_open</v-icon></v-btn>
                            <v-btn v-else @click="goToArchivedCase(item.case_id)" icon color="blue" dark><v-icon>folder_open</v-icon></v-btn>
                        </v-list-tile>
                        <v-divider v-if="index<children.length-1"></v-divider>
                    </template>
                </v-list>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat color="grey" @click="searchCaseDialog=false">{{ $t('cases.cancel') }}</v-btn>
                    <v-btn flat color="cyan lighten-1" @click="loadChildren()">{{ $t('cases.search') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="shareCaseDialog" width="700">
            <v-toolbar>
                    <v-toolbar-title class="mt-3">[{{ caseId }}] <b>{{ caseObject.custom_name }}</b></v-toolbar-title>
            </v-toolbar>
            <v-card>
                <v-toolbar flat color="white">
                    <v-toolbar-title class="mt-3">{{ $t('cases.shared_to_organizations') }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="dialogSearch"
                        prepend-icon="search"
                        clearable
                        :label="$t('cases.search')"
                        single-line
                        hide-details
                    ></v-text-field>
            </v-toolbar>
                <v-data-table :headers="organizationHeaders" :items="organizations" v-model="selected" :search="dialogSearch" style="margin-top:-5px;">
                    <template v-slot:items="props">
                        <tr @click="props.item.selected = !props.item.selected" :active="props.item.selected">
                            <td>
                                <v-checkbox :input-value="props.item.selected" primary hide-details></v-checkbox>
                            </td>
                            <td class="text-xs-left">{{ props.item.id }}</td>
                            <td class="text-xs-left">{{ props.item.name || ' - ' | title }}</td>
                        </tr>
                    </template>
                    <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                        {{ $t('cases.no_records') }}
                    </v-alert>
                </v-data-table>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat color="grey" @click="shareCaseDialog = false;">{{ $t('volunteers.close') }}</v-btn>
                    <v-btn flat color="primary" @click="share()">{{ $t('cases.share') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
import { dates, fonts } from '@/utils/mixins';
import { CasesApi, OrganizationsApi } from '@/api';

export default {
    mixins: [dates, fonts],
    data() {
        return {
            selectedFilter: 'all',
            facilitySelectedFilter: 'all',
            selectedSort: 'disappearance_date',
            facilitySelectedSort: 'arrival_date',
            isLoaded: false,
            cases: [],
            searchName: '',
            searchCaseDialog: false,
            children: [],
            shareCaseDialog: false,
            dialogSearch: '',
            caseId: null,
            caseObject: {},
            organizations: [],
            sharedCases: [],
            selected: [],
            organizationHeaders: [
                {
                    text: '',
                    value: 'selected',
                    width: '1%',
                    align: '',
                    sortable: false,
                },
                {
                    text: 'Id',
                    value: 'id',
                    width: '5%',
                    align: 'left',
                },
                {
                    text: this.$t('cases.organization_name'),
                    value: 'name',
                    width: '95%',
                    align: 'left',
                },
            ],
            sortItems: [
                {
                    text: this.$t('cases.sort.disappearance_date'),
                    value: 'disappearance_date',
                },
                {
                    text: this.$t('cases.sort.last_update'),
                    value: 'last_update',
                },
            ],
            filterItems: [
                {
                    text: this.$t('cases.filter.all'),
                    value: 'all',
                },
                {
                    text: this.$t('cases.filter.active'),
                    value: 'active',
                },
                {
                    text: this.$t('cases.filter.closed'),
                    value: 'closed',
                },
                // {
                //     text: this.$t('cases.filter.archived'),
                //     value: 'archived',
                // },
            ],
            facilitySortItems: [
                {
                    text: this.$t('cases.facility_sort.arrival_date'),
                    value: 'arrival_date',
                },
                {
                    text: this.$t('cases.facility_sort.name'),
                    value: 'name',
                },
            ],
            facilityFilterItems: [
                {
                    text: this.$t('cases.facility_filter.all'),
                    value: 'all',
                },
                {
                    text: this.$t('cases.facility_filter.present'),
                    value: 'present',
                },
                {
                    text: this.$t('cases.facility_filter.not_present'),
                    value: 'not_present',
                },
            ],
        };
    },
    async created() {
        if (this.$store.state.role !== 'facility_manager') {
            await this.loadCases();
        } else {
            await this.loadFacilityCases();
        }
        const { data: organizations } = await OrganizationsApi.others();
        this.organizations = organizations;
        this.isLoaded = true;
    },
    methods: {
        openSearchCaseDialog() {
            this.children = [];
            this.searchName = '';
            this.searchCaseDialog = true;
        },
        applySort() {
            if (this.selectedSort === 'last_update') {
                this.cases.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            }
            if (this.selectedSort === 'disappearance_date') {
                this.cases.sort((a, b) => new Date(b.disappearance_date) - new Date(a.disappearance_date));
            }
        },
        facilityApplySort() {
            if (this.facilityelectedSort === 'arrival_date') {
                this.cases.sort((a, b) => new Date(b.arrival_date) - new Date(a.arrival_date));
            }
            if (this.facilitySelectedSort === 'name') {
                this.cases.sort((a, b) => (a.last_name > b.last_name) * 2 - 1);
            }
        },
        async loadChildren() {
            const { data: children } = await CasesApi.children({ name: this.searchName });
            this.children = children;
        },
        goToCase(caseId) {
            this.$router.push({ name: 'info', params: { id: caseId } });
        },
        belongsToOrganization(caseobject) {
            return caseobject.organization === this.$store.state.organizationId;
        },
        goToArchivedCase(caseId) {
            this.$router.push({ name: 'archived_case_info', params: { id: caseId } });
        },
        createNewCase(child) {
            this.$router.push({ name: 'case_new', params: { childId: child.id } });
        },
        applyFilter() {
            this.loadCases();
        },
        facilityApplyFilter() {
            this.loadFacilityCases();
        },
        loadCase(caseObject) {
            this.$router.push({
                name: 'case',
                params: { id: caseObject.id },
            });
        },
        getImagePath(path) {
            if (path === null) {
                return require('../../assets/images/default_photo.png');
            }
            return path;
        },
        loadCaseManagement() {
            this.$router.push({ name: 'case_new' });
        },
        async loadCases() {
            let params = {};
            if (this.selectedFilter === 'all') {
                params = { is_active: 'all' };
            }
            if (this.selectedFilter === 'active') {
                params = { is_active: 'true' };
            }
            if (this.selectedFilter === 'closed') {
                params = { is_active: 'false' };
            }
            const { data: cases } = await CasesApi.all(params);
            const regex = /http:/gi;
            for (let i = 0; i < cases.length; i++) {
                if (cases[i].profile_photo !== null) {
                    if (cases[i].profile_photo.includes('localhost')) {} else {
                        cases[i].profile_photo = cases[i].profile_photo.replace(regex, 'https:');
                    }
                }
            }
            this.cases = cases;
            this.applySort();
        },
        async loadFacilityCases() {
            let params = {};
            if (this.facilitySelectedFilter === 'all') {
                params = { };
            }
            if (this.facilitySelectedFilter === 'present') {
                params = { presence_status: 'present' };
            }
            if (this.facilitySelectedFilter === 'not_present') {
                params = { presence_status: 'not_present' };
            }
            const { data: cases } = await CasesApi.getFacilityCases(params);
            this.cases = cases;
            this.facilityApplySort();
        },
        async openShareDialog(caseObject) {
            this.caseId = caseObject.id;
            this.caseObject = caseObject;
            console.log(caseObject);
            const { data: sharedCases } = await CasesApi.shared_organizations({caseId: this.caseId});
            this.sharedCases = sharedCases;
            for (let index = 0; index < this.organizations.length; index++) {
                let isSelected = sharedCases.filter(sharedCase => sharedCase.organization === this.organizations[index].id)
                if (isSelected.length > 0) {
                    this.organizations[index].selected = true;
                } else {
                    this.organizations[index].selected = false;
                }
            }
            this.shareCaseDialog = true;
        },
        async share() {
            const { data: sharedCases } = await CasesApi.shared_to_organizations({organizations: this.organizations}, {caseId: this.caseId});
            this.shareCaseDialog = false;
            this.loadCases();
        }
    },
};
</script>

<style scoped>
.textField {
    padding: 5px 15px;
}

.tile_background {
    height: 165px;
    /* background-color: #EEEEEE; */
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
    /* transform: scale(1.02); */
}

.clickable_card:hover {
    cursor: pointer;
}
</style>

