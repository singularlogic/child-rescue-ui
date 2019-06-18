<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded">
        <v-card>
            <v-layout justify-center row fill-height wrap reverse>
                <v-flex xs12 sm12 md12 lg12 xl12 style="padding: 15px;">
                    <!--<div style="margin-bottom: 10px;"><span-->
                    <!--style="font-size: large; font-weight: bold; border-bottom: 3px solid #F4B350;">INFORMATION</span>-->
                    <!--</div>-->
                    <v-layout justify-center row fill-height wrap>
                        <v-flex xs12 sm6 md3 lg3 xl3>
                            <div style="margin-bottom: 10px;"><span
                                style="font-size: large; font-weight: bold; border-bottom: 3px solid #F4B350;">PHOTO</span>
                            </div>
                            <v-img :src="getImagePath(caseObject.profile_photo)" height="200px"></v-img>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-layout align-center justify-space-between column fill-height>
                                <div style="margin-bottom: 10px;"><span
                                    style="font-size: large; font-weight: bold; border-bottom: 3px solid #F4B350;">PERSONAL</span>
                                </div>
                                <v-flex xs12 sm12 md3 lg3 xl3 class="text-xs-center">
                                    <div style="padding: 0px;">
                                        <span style="font-size: medium; font-weight: bold;">First name</span><br/>
                                        <span
                                            style="font-size: medium;">{{ caseObject.personal_data.first_name || '-' }}</span>
                                    </div>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3 class="text-xs-center">
                                    <div style="padding: 0px;">
                                        <span style="font-size: medium; font-weight: bold;">Last name</span><br/>
                                        <span style="font-size: medium;">{{ caseObject.personal_data.last_name || '-' }}</span>
                                    </div>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3 class="text-xs-center">
                                    <div style="padding: 0px;">
                                        <span
                                            style="font-size: medium; font-weight: bold;">Disappearance type</span><br/>
                                        <span style="font-size: medium;">{{ caseObject.disappearance_type || '-' }}</span>
                                    </div>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3 class="text-xs-center">
                                    <div style="padding: 0px;">
                                        <span
                                            style="font-size: medium; font-weight: bold;">Disappearnce date</span><br/>
                                        <span style="font-size: medium;">{{ caseObject.disappearance_date || '-' | formatDateTime }}</span>
                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-layout align-center justify-space-between column fill-height>
                                <div style="margin-bottom: 10px;"><span
                                    style="font-size: large; font-weight: bold; border-bottom: 3px solid #F4B350;">DEMOGRAPHICS</span>
                                </div>
                                <v-flex xs12 sm12 md3 lg3 xl3 class="text-xs-center">
                                    <div style="padding: 0px;">
                                        <span style="font-size: medium; font-weight: bold;">Birth city</span><br/>
                                        <span
                                            style="font-size: medium;">{{ caseObject.demographic_data.birth_city || '-' }}</span>
                                    </div>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3 class="text-xs-center">
                                    <div style="padding: 0px;">
                                        <span style="font-size: medium; font-weight: bold;">Home city</span><br/>
                                        <span
                                            style="font-size: medium;">{{ caseObject.demographic_data.home_city || '-' }}</span>
                                    </div>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3 class="text-xs-center">
                                    <div style="padding: 0px;">
                                        <span style="font-size: medium; font-weight: bold;">Nationality</span><br/>
                                        <span
                                            style="font-size: medium;">{{ caseObject.demographic_data.nationality || '-' }}</span>
                                    </div>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3 class="text-xs-center">
                                    <div style="padding: 0px;">
                                        <span style="font-size: medium; font-weight: bold;">Gender</span><br/>
                                        <span style="font-size: medium;">{{ caseObject.demographic_data.gender || '-' }}</span>
                                    </div>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3 class="text-xs-center">
                                    <div style="padding: 0px;">
                                        <span style="font-size: medium; font-weight: bold;">Date of birth</span><br/>
                                        <span
                                            style="font-size: medium;">{{ caseObject.demographic_data.date_of_birth || '-' }}</span>
                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-layout align-center justify-space-between column fill-height>
                                <div style="margin-bottom: 10px;"><span
                                    style="font-size: large; font-weight: bold; border-bottom: 3px solid #F4B350;">PHYSICAL</span>
                                </div>
                                <v-flex xs12 sm12 md3 lg3 xl3 class="text-xs-center">
                                    <div style="padding: 0px;">
                                        <span style="font-size: medium; font-weight: bold;">Eye color</span><br/>
                                        <span
                                            style="font-size: medium;">{{ caseObject.physical_data.eye_color || '-' }}</span>
                                    </div>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3 class="text-xs-center">
                                    <div style="padding: 0px;">
                                        <span style="font-size: medium; font-weight: bold;">Hair color</span><br/>
                                        <span style="font-size: medium;">{{ caseObject.physical_data.hair_color || '-' }}</span>
                                    </div>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3 class="text-xs-center">
                                    <div style="padding: 0px;">
                                        <span
                                            style="font-size: medium; font-weight: bold;">Skin color</span><br/>
                                        <span style="font-size: medium;">{{ caseObject.physical_data.skin_color || '-' }}</span>
                                    </div>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3 class="text-xs-center">
                                    <div style="padding: 0px;">
                                        <span
                                            style="font-size: medium; font-weight: bold;">Height</span><br/>
                                        <span style="font-size: medium;">{{ caseObject.physical_data.height || '-' }} cm</span>
                                    </div>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3 class="text-xs-center">
                                    <div style="padding: 0px;">
                                        <span
                                            style="font-size: medium; font-weight: bold;">Weight</span><br/>
                                        <span style="font-size: medium;">{{ caseObject.physical_data.weight || '-' }} kg</span>
                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <v-layout justify-start row fill-height wrap v-if="false">
                <v-flex xs12 sm12 md12 lg12 xl12 style="padding: 15px;">
                    <div style="margin-bottom: 10px;"><span
                        style="font-size: large; font-weight: bold; border-bottom: 3px solid #F4B350;">RELATED CASES</span>
                    </div>
                    <v-layout justify-start align-center row fill-height wrap>
                        <v-flex xs12 sm12 md2 lg2 xl2 v-for="item in relatedCases" @click="loadCase(item)">
                            <v-card tile style="padding: 5px; margin: 5px 15px 15px 15px;">
                                <div class="clickable_card">
                                    <div class="tile_background">
                                        <v-layout justify-center class="tile_background_tags">
                                            <v-flex class="tile_background_tag_center"><span
                                                style="background-color: #D3D3D3; padding: 5px; border-radius: 2px;">Tony Montana</span>
                                            </v-flex>
                                        </v-layout>
                                    </div>
                                </div>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <v-layout>
                <v-flex style="padding: 15px;">
                    <div style="margin-bottom: 10px;"><span
                        style="font-size: large; font-weight: bold; border-bottom: 3px solid #F4B350;">DESCRIPTION</span>
                    </div>
                    <div>
                        {{ caseObject.description || '-' }}
                    </div>
                </v-flex>
            </v-layout>
        </v-card>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { dates } from '@/utils/mixins';


export default {
    mixins: [dates],
    data() {
        return {
            baseUrl: process.env.VUE_APP_BACKEND,
            isLoaded: false,
            caseObject: null,
            relatedCases: [
                {
                    id: 1,
                    image: '../assets/logo.png',
                    name: 'Mpla mpla',
                    dateOfDisappearance: '1/2/2007'
                },
                {
                    id: 2,
                    image: '../assets/logo.png',
                    name: 'Mpla mpla 2',
                    dateOfDisappearance: '1/2/2007'
                },
            ],
        };
    },
    computed: {
        ...mapGetters('case_module', {
            getCase: 'getCase',
        }),
    },
    created() {
        this.caseObject = this.getCase;
        this.isLoaded = true;
    },
    methods: {
        getImagePath(path) {
            if (path === null) {
                return require('../../../assets/logo.png');
            }

            if (this.baseUrl && this.baseUrl.length > 1) {
                return this.baseUrl + path;
            } else {
                return path;
            }
        },
    },
};
</script>

<style scoped>
    .tile_background {
        height: 110px;
        background-color: #C3C3C3;
        background-image: url("../../../assets/logo.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    .tile_background_tags {
        position: relative;
        top: calc(100% - 30px);
        padding: 5px;
    }

    .tile_background_tag_center {
        color: #ffffff;
        font-weight: bold;
        text-align: center;
    }

    .hasColor {
        color: cornflowerblue;
    }
</style>
