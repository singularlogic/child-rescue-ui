<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout v-if="isLoaded" align-space-between justify-center row fill-height>
        <v-flex xs12 sm12 md12 lg12 xl12 style="padding: 0px;">
            <v-layout column justify-center fill-height>
                <v-flex>
                    <v-breadcrumbs :items="linkItems">
                        <template v-slot:divider>
                            <v-icon>chevron_right</v-icon>
                        </template>
                    </v-breadcrumbs>
                </v-flex>
                <v-flex>
                    <v-layout wrap>
                        <v-flex xs12 sm12 md6 lg6 xl6>
                            <v-layout>
                                <v-flex xs12 sm6 md4 lg4 xl4>
                                    <v-select
                                        v-model="selectedSort"
                                        :items="sortItems"
                                        label="Sort by:"
                                        class="textField"
                                        @change="applySort()"
                                    ></v-select>
                                </v-flex>
                                <v-flex xs12 sm6 md4 lg4 xl4>
                                    <v-select
                                        v-model="selectedFilter"
                                        :items="filterItems"
                                        label="Filter by:"
                                        class="textField"
                                        @change="applyFilter()"
                                    ></v-select>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 sm12 md6 lg6 xl6>
                            <v-layout align-center row fill-height reverse>
                                <v-flex xs12 sm12 md5 lg4 xl4>
                                    <v-btn dark color="#F4B350" @click="loadCaseManagement">
                                        <v-icon dark>add</v-icon>Add Child
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex v-if="cases.length >= 1" fill-height>
                    <v-layout row wrap>
                        <!-- <h3>Children in facility ({{ cases.length }})</h3> -->
                        <v-flex xs12 sm6 md3 lg3 xl2 v-for="item in cases" @click="loadFacilityCase(item)">
                            <v-card
                                class="clickable_card"
                                tile
                                style="padding: 5px; margin: 5px 15px 15px 15px;"
                            >
                                <v-img
                                    :src="getImagePath(item.profile_photo)"
                                    height="165px"
                                    class="tile_background"
                                >
                                    <v-container fill-height fluid pa-2>
                                        <v-layout
                                            justify-space-between
                                            class="tile_background_tags"
                                        >
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
                                <div
                                    style="text-align: left; font-size: medium; font-weight: bold; margin-top: 10px;"
                                >{{ item.last_name | title }} {{ item.first_name | title }}</div>
                                <div style="text-align: left; color: #C0C0C0;">
                                    Arrival date:
                                    <b>
                                        {{item.arrival_date | formatDate }}
                                    </b>
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
            selectedSort: 'arrival_date',
            cases: [],
            isLoaded: false,
            baseUrl: process.env.VUE_APP_BACKEND,
            linkItems: [
                {
                    text: 'Home',
                    disabled: false,
                    href: '/',
                },
                {
                    text: 'Manage Facility',
                    disabled: true,
                    href: '/manage_facility',
                },
            ],
            sortItems: [
                {
                    text: 'Arrival date',
                    value: 'arrival_date',
                },
                {
                    text: 'Name',
                    value: 'name',
                },
            ],
            filterItems: [
                {
                    text: 'All',
                    value: 'all',
                },
                {
                    text: 'Present',
                    value: 'present',
                },
                {
                    text: 'Not present',
                    value: 'not_present',
                },
            ],
        };
    },
    created() {
        this.loadFacilityCases();
    },
    methods: {
        loadFacilityCase(facilityCaseObject) {
            this.$router.push({
                name: 'manage_facility_child',
                params: { id: facilityCaseObject.id },
            });
        },
        getImagePath(path) {
            if (path === null) {
                return require('../../assets/images/default_photo.png');
            }
            return path;
        },
        loadCaseManagement() {
            this.$router.push({ name: 'manage_facility_add' });
        },
        applySort() {
            if (this.selectedSort === 'arrival_date') {
                this.cases.sort((a, b) => new Date(b.arrival_date) - new Date(a.arrival_date));
            }
            if (this.selectedSort === 'name') {
                this.cases.sort((a, b) => (a.last_name > b.last_name) * 2 - 1);
            }
        },
        applyFilter() {
            this.loadFacilityCases();
        },
        async loadFacilityCases() {
            let params = {};
            if (this.selectedFilter === 'all') {
                params = { };
            }
            if (this.selectedFilter === 'present') {
                params = { presence_status: 'present' };
            }
            if (this.selectedFilter === 'not_present') {
                params = { presence_status: 'not_present' };
            }
            const { data: cases } = await CasesApi.getFacilityCases(params);
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
    color: white;
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
