<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded">
        <v-card flat>
            <v-toolbar dense flat color="white">
                <div v-if="caseObject.amber_alert" class="text-xs-left">
                    <v-chip label color="red" text-color="white" style="font-size:18px; margin-left:-10px;">{{ $t('case_info.amber_alert') }}</v-chip>
                </div>
            </v-toolbar>
            <v-layout row wrap>
                <v-flex xs12 sm12 md5 lg5 xl5 style="padding: 10px;">
                    <v-img :src="getImagePath(caseObject.profile_photo)" height="350px"></v-img>
                </v-flex>
                <v-flex xs12 sm12 md7 lg7 xl7 style="padding: 12px;">
                    <v-layout align-center row wrap>
                        <v-flex xs12 sm12 md3>
                            <v-text-field
                                v-model="caseObject.first_name"
                                :label="$t('case_info.first_name')"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md3>
                            <v-text-field
                                v-model="caseObject.last_name"
                                :label="$t('case_info.last_name')"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md3>
                            <v-text-field
                                :value="getAge(caseObject.date_of_birth)"
                                :label="$t('case_info.age')"
                                :class="{'disable-events': true }"
                                class="textField"
                                readonly
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md3>
                            <v-text-field
                                v-model="caseObject.nationality"
                                :label="$t('case_info.nationality')"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md6 lg6 xl6>
                            <v-text-field
                                v-model="caseObject.disappearance_location"
                                :label="$t('case_info.disappearence_location')"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md6 lg6 xl6>
                            <v-text-field
                                v-model="caseObject.disappearance_date"
                                :label="$t('case_info.disappearence_date')"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md6 lg6 xl6>
                            <v-select :items="disappearanceTypeOptions"
                                          v-model="caseObject.disappearance_type"
                                          :class="{'disable-events': true }"
                                          :label="$t('case.dis_type')" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-textarea name="input-7-1"
                                        v-model="caseObject.default_message" box
                                        :label="$t('case_info.alert_message')"
                                        :placeholder="$t('case_info.alert_message_hint')" auto-grow
                                        rows="5" :class="{'disable-events': true }" class="textField"
                                        counter maxlength="5000">
                            </v-textarea>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <!-- <v-parallax v-if="caseObject.status!=='inactive'" dark style="background-color: #C3C3C3; height:250px; margin-left: 10px; margin-right: 10px;">
                <v-layout align-center column justify-center>
                    <h1 class="display-2 font-weight-thin mb-3">{{ $t('case_info.related_cases') }}</h1>
                    <h4 class="subheading">{{ $t('case_info.no_related_cases') }}</h4>
                </v-layout>
            </v-parallax>
            <div v-if="caseObject.status!=='inactive'">
                <v-layout v-if="similarCases.length >= 1" row wrap style="margin-left: 10px; margin-right: 10px;">
                    <v-flex xs12>
                        <h2>{{ $t('case_info.similar_cases') }}</h2>
                    </v-flex>
                    <v-flex fill-height>
                        <v-layout row wrap>
                            <v-flex xs12 sm6 md3 lg3 xl2 v-for="item in similarCases" :key="item.id" @click="loadSimilarCase(item)">
                                <v-card class="clickable_card" tile style="padding: 5px; margin: 5px 15px 15px 15px;">
                                    <v-img :src="getImagePath(item.profile_photo)" height="165px" class="tile_background">
                                        <v-container fill-height fluid pa-2>
                                            <v-layout justify-space-between class="tile_background_tags">
                                                <v-flex v-if="item.amber_alert" class="tile_background_tag_left">
                                                    <span style="background-color: red; padding: 5px; border-radius: 2px;">{{ $t('case_info.amber_alert') }}</span>
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
                                                    <span style="background-color: #800080; padding: 5px; border-radius: 2px;">{{ $t('case_info.transit_small') }}</span>
                                                </v-flex>
                                                <v-flex v-if="item.status === 'inactive' && item.presence_status !== 'transit'" class="tile_background_tag_right">
                                                    <span style="background-color: #2FD1D4; padding: 5px; border-radius: 2px;">{{ $t('case_info.inactive') }}</span>
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
                </v-layout>
                <v-parallax v-else dark style="background-color: #C3C3C3; height:250px; margin-top: 2px; margin-left: 10px; margin-right: 10px;">
                    <v-layout align-center column justify-center>
                        <h1 class="display-2 font-weight-thin mb-3">{{ $t('case_info.similar_cases') }}</h1>
                        <h4 class="subheading">{{ $t('case_info.no_similar_cases') }}</h4>
                    </v-layout>
                </v-parallax>
            </div> -->
        </v-card>
    </div>
</template>

<script>
import moment from 'moment';
import { dates, filters, fonts } from '@/utils/mixins';
import { CasesApi, FeedbacksApi, FacilitiesApi } from '@/api';
import { SET_SNACKBAR_STATUS } from '@/store/mutation-types';

import MissingReport from '@/components/MissingReport.vue';


export default {
    mixins: [dates, filters, fonts],
    props: {
        id: { type: [String, Number], required: true },
    },
    data() {
        return {
            baseUrl: process.env.VUE_APP_BACKEND,
            isLoaded: false,
            caseObject: {
                status: '',
            },
            disappearanceTypeOptions: [
                {
                    text: this.$t('case.disap_type.runaway'),
                    value: 'runaway',
                },
                {
                    text: this.$t('case.disap_type.parental_abduction'),
                    value: 'parental_abduction',
                },
                {
                    text: this.$t('case.disap_type.lost'),
                    value: 'lost',
                },
                {
                    text: this.$t('case.disap_type.missing'),
                    value: 'missing',
                },
                {
                    text: this.$t('case.disap_type.third_party_abduction'),
                    value: 'third_party_abduction',
                },
                {
                    text: this.$t('case.disap_type.unknown'),
                    value: null,
                },
            ],
        };
    },
    async created() {
        await this.loadCase();
        this.isLoaded = true;
    },
    methods: {
        getAge(birthDate) {
            if (birthDate) {
                return `${Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)} ${this.$t('case_info.years')}`;
            }
            return ' - ';
        },
        getDate(value) {
            return moment(String(value)).format('YYYY-MM-DD HH:mm:ss');
        },
        async loadCase() {
            // const { data: caseObject } = await CasesApi.get(this.id);
            const { data: caseObject } = await CasesApi.anonymizedCase(this.id);
            this.caseObject = caseObject;
            console.log(this.caseObject);
            this.caseObject.disappearance_date = this.getDate(caseObject.disappearance_date);
        },
        getImagePath(path) {
            if (path === null) {
                return require('../../../assets/images/default_photo.png');
            }
            return path;
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
