<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout v-if="isLoaded" align-space-between justify-center row fill-height>
        <v-flex xs12 sm12 md12 lg12 xl12 style="padding: 0px;">
            <v-layout column justify-center fill-height>
                <v-flex>
                    <v-toolbar class="mb-2">
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
                        <v-btn v-if="$caseManagerAndAbove.includes($store.state.role)" dark color="#F4B350" @click="loadCaseManagement">
                            <v-icon dark>add</v-icon>Create case
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
            linkItems: [
                {
                    text: 'Home',
                    disabled: false,
                    href: '/',
                },
                {
                    text: 'Cases',
                    disabled: true,
                    href: '/cases',
                },
            ],
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
            ],
        };
    },
    created() {
        this.loadCases();
    },
    methods: {
        applySort() {
            if (this.selectedSort === 'last_update') {
                this.cases.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            }
            if (this.selectedSort === 'disappearance_date') {
                this.cases.sort((a, b) => new Date(b.disappearance_date) - new Date(a.disappearance_date));
            }
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
                params = { is_active: true };
            }
            if (this.selectedFilter === 'closed') {
                params = { is_active: false };
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
