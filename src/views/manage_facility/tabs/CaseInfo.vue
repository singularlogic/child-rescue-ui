<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded">
        <v-card>
            <v-layout row wrap>
                <v-flex xs12 sm12 md5 lg5 xl5 style="padding: 10px;">
                    <v-img :src="getImagePath(caseObject.profile_photo)" height="350px"></v-img>
                </v-flex>
                <v-flex xs12 sm12 md7 lg7 xl7 style="padding: 12px; margin-top: 10px;">
                    <v-layout align-center row wrap>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-text-field
                                v-model="caseObject.first_name"
                                label="First name"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-text-field
                                v-model="caseObject.last_name"
                                label="Last name"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-text-field
                                v-model="dateOfBirth"
                                label="Date of birth"
                                :class="{'disable-events': true }"
                                class="textField"
                                prepend-icon="event"
                                readonly
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-text-field
                                v-model="caseObject.arrival_date"
                                label="Arrival date"
                                :class="{'disable-events': true }"
                                class="textField"
                                prepend-icon="event"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-text-field
                                v-model="caseObject.nationality"
                                label="Nationality"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-card>
    </div>
</template>

<script>
import moment from 'moment';
import { dates } from '@/utils/mixins';
import { CasesApi } from '@/api';


export default {
    mixins: [dates],
    props: {
        id: { type: Number, required: true },
    },
    data() {
        return {
            baseUrl: process.env.VUE_APP_BACKEND,
            dateOfBirth: null,
            isLoaded: false,
            caseObject: {},
        };
    },
    created() {
        this.loadCase();
    },
    methods: {
        getDate(value) {
            return moment(String(value)).format('YYYY-MM-DD HH:mm:ss');
        },
        async loadCase() {
            const { data: caseObject } = await CasesApi.get(this.id);
            this.caseObject = caseObject;
            this.dateOfBirth = this.caseObject.date_of_birth;
            this.isLoaded = true;
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
</style>
