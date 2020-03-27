<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout v-if="isLoaded" align-space-between justify-center row fill-height>
        <v-flex xs12 sm12 md12 lg12 xl12 style="padding: 0px;">
            <v-layout column justify-center fill-height>
                <v-flex>
                    <v-toolbar class="mb-2" flat color="transparent">
                        <v-toolbar-title style="width: 200px;">
                            <v-select
                                v-model="selectedSort"
                                :items="sortItems"
                                label="Sort by:"
                                class="mt-3"
                                @change="applySort()"
                            ></v-select>
                        </v-toolbar-title>
                        <v-toolbar-title style="width: 100px;">
                            <v-select
                                v-model="selectedFilter"
                                :items="filterItems"
                                label="Filter by:"
                                class="mt-3"
                                @change="applyFilter()"
                            ></v-select>
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn v-if="$caseManagerAndAbove.includes($store.state.role)" dark color="#8c3404" @click="openSearchCaseDialog()">
                            <v-icon>search</v-icon>Search
                        </v-btn>
                        <v-btn v-if="$caseManagerAndAbove.includes($store.state.role)" dark color="#F4B350" @click="loadCaseManagement">
                            <v-icon>add</v-icon>Create
                        </v-btn>
                    </v-toolbar>
                </v-flex>
                <v-flex v-if="cases.length >= 1" fill-height>
                    <v-layout row wrap>
                        <v-flex xs12 sm6 md3 lg3 xl2 v-for="item in cases" :key="item.id" @click="loadCase(item)">
                            <v-card class="clickable_card" tile style="padding: 5px; margin: 5px 15px 15px 15px;">
                                <v-img :src="getImagePath(item.profile_photo)" height="165px" class="tile_background">
                                    <v-container fill-height fluid pa-2>
                                        <v-layout justify-space-between class="tile_background_tags">
                                            <v-flex v-if="item.amber_alert" class="tile_background_tag_left">
                                                <span style="background-color: red; padding: 5px; border-radius: 2px;">Amber alert</span>
                                            </v-flex>
                                            <v-flex v-if="item.status === 'closed'" class="tile_background_tag_right">
                                                <span style="background-color: green; padding: 5px; border-radius: 2px;">{{ item.status }}</span>
                                            </v-flex>
                                            <v-flex v-if="item.status === 'active'" class="tile_background_tag_right">
                                                <span style="background-color: #555; padding: 5px; border-radius: 2px;">{{ item.status }}</span>
                                            </v-flex>
                                            <v-flex v-if="item.status === 'archived'" class="tile_background_tag_right">
                                                <span style="background-color: #8c3404; padding: 5px; border-radius: 2px;">{{ item.status }}</span>
                                            </v-flex>
                                            <v-flex v-if="item.status === 'inactive' && item.presence_status === 'transit'" class="tile_background_tag_right">
                                                <span style="background-color: #800080; padding: 5px; border-radius: 2px;">transit</span>
                                            </v-flex>
                                            <v-flex v-if="item.status === 'inactive' && item.presence_status !== 'transit'" class="tile_background_tag_right">
                                                <span style="background-color: #2FD1D4; padding: 5px; border-radius: 2px;">inactive</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-img>
                                <div style="text-align: left; font-size: medium; font-weight: bold; margin-top: 10px;">
                                    {{ item.first_name | title }} {{ item.last_name | title }}
                                </div>
                                <div v-if="item.status === 'inactive'" style="text-align: left; color: #C0C0C0;">
                                    Arrival at facility:<b>{{item.arrival_date | formatDate }}</b>
                                </div>
                                <div v-else style="text-align: left; color: #C0C0C0;">
                                    Missing from:<b>{{item.disappearance_date | formatDate }}</b>
                                </div>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex v-else fill-height style="background-color: #C3C3C3;" text-xs-center>
                    <v-layout align-center justify-center style="height: 100%;">
                        <v-flex><h3 style="margin-top: 0px;" class="display-1">No records found.</h3></v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-dialog v-model="searchCaseDialog" width="500" persistent @keydown.esc="searchCaseDialog=false;">
            <v-card>
                <v-toolbar color="white">
                    <v-toolbar-title class='title'>Search child</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="gray" icon @click="searchCaseDialog=false"><v-icon>close</v-icon></v-btn>
                </v-toolbar>
                <v-toolbar flat color="white">
                    <v-text-field label="Child name" flat class="mt-2" v-model="searchName"></v-text-field>
                    <v-toolbar-title>
                        <v-btn small @click="loadChildren()"><v-icon>search</v-icon>Search</v-btn>
                    </v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-list v-if="children.length > 0" two-line class="mx-2" style="height: 500px; overflow-y: scroll;">
                    <template v-for="(item, index) in children">
                        <v-subheader v-if="item.header" :key="item.header">{{ item.header }}</v-subheader>
                        <v-divider v-else-if="item.divider" :key="index" :inset="item.inset"></v-divider>
                        <v-list-tile v-else :key="item.title" avatar>
                            <!-- <v-avatar style="background-color: #CCC" size=36 class="mr-2">{{ item.rank }}</v-avatar> -->
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.first_name }} {{ item.last_name }}</v-list-tile-title>
                                <v-list-tile-sub-title>{{ item.status }}</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-btn v-if="item.status !== 'active'" @click="createNewCase(item)" icon color="#038add" dark><v-icon>add</v-icon></v-btn>
                            <v-btn @click="goToCase(item.case_id)" icon color="#b503dd" dark><v-icon>description</v-icon></v-btn>
                        </v-list-tile>
                    </template>
                </v-list>
                <v-parallax v-else dark style="background-color: #C3C3C3;" height="300">
                    <v-layout align-center justify-center row fill-height>
                        <v-flex sm12 class="text-center">
                            <h1 class="display-1 font-weight-thin mb-3">No children data...</h1>
                            <h4 class="subheading">No children criteria selected</h4>
                        </v-flex>
                    </v-layout>
                </v-parallax>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
import { dates, fonts } from '@/utils/mixins';
import { CasesApi } from '@/api';


export default {
    mixins: [dates, fonts],
    data() {
        return {
            selectedFilter: 'all',
            selectedSort: 'disappearance_date',
            isLoaded: false,
            cases: [],
            searchName: '',
            searchCaseDialog: false,
            children: [],
            sortItems: [
                {
                    text: 'Recently disappeared',
                    value: 'disappearance_date',
                },
                {
                    text: 'Recently updated',
                    value: 'last_update',
                },
            ],
            filterItems: [
                {
                    text: 'All',
                    value: 'all',
                },
                {
                    text: 'Active',
                    value: 'active',
                },
                {
                    text: 'Closed',
                    value: 'closed',
                },
                {
                    text: 'Archived',
                    value: 'archived',
                },
            ],
        };
    },
    created() {
        this.loadCases();
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
        async loadChildren() {
            const { data: children } = await CasesApi.children({ name: this.searchName });
            this.children = children;
        },
        goToCase(caseId) {
            this.$router.push({ name: 'info', params: { id: caseId } });
        },
        createNewCase(child) {
            this.$router.push({ name: 'case_new', params: { childId: child.id } });
        },
        applyFilter() {
            this.loadCases();
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
            if (this.selectedFilter === 'active') {
                params = { is_active: 'true' };
            }
            if (this.selectedFilter === 'closed') {
                params = { is_active: 'false' };
            }
            if (this.selectedFilter === 'archived') {
                params = { is_active: 'archived' };
            }
            const { data: cases } = await CasesApi.all(params);
            this.cases = cases;
            this.isLoaded = true;
            this.applySort();
        },
    },
};
</script>

<style scoped>
.textField {
    padding: 5px 15px;
}

.tile_background {
    height: 165px;
    background-color: #c3c3c3;
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
