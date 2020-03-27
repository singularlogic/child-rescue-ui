<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded">
        <v-card flat>
            <v-toolbar v-if="$caseManagerAndAbove.includes($store.state.role) && (caseObject.status==='active' || caseObject.status==='inactive')" dense flat color="white">
                <v-spacer></v-spacer>
                <div class="text-xs-right">
                    <v-btn dark color="#F4B350" @click="loadEditCase()">Edit case</v-btn>
                    <v-btn outline dark color="#000000" @click="closeCase()">CLOSE CASE</v-btn>
                </div>
            </v-toolbar>
            <v-toolbar v-if="caseObject.status==='closed'" dense flat color="white">
                <v-spacer></v-spacer>
                <div class="text-xs-right">
                    <v-btn dark color="#F4B350" @click="loadEditCase()">Edit case</v-btn>
                    <v-btn outline dark color="#000000" @click="archiveCase()">ARCHIVE CASE</v-btn>
                </div>
            </v-toolbar>
            <v-layout row wrap>
                <v-flex xs12 sm12 md5 lg5 xl5 style="padding: 10px;">
                    <v-img :src="getImagePath(caseObject.profile_photo)" height="350px"></v-img>
                </v-flex>
                <v-flex xs12 sm12 md7 lg7 xl7 style="padding: 12px;">
                    <v-layout align-center row wrap>
                        <v-flex xs12 sm12 md4 lg4 xl4>
                            <v-text-field
                                v-model="caseObject.first_name"
                                label="First name"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md4 lg4 xl4>
                            <v-text-field
                                v-model="caseObject.last_name"
                                label="Last name"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md4 lg4 xl4>
                            <v-text-field
                                :value="getAge(caseObject.date_of_birth)"
                                label="Age"
                                :class="{'disable-events': true }"
                                class="textField"
                                readonly
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md6 lg6 xl6>
                            <v-text-field
                                v-model="caseObject.disappearance_location"
                                label="Disappearance location"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md6 lg6 xl6>
                            <v-text-field
                                v-model="caseObject.disappearance_date"
                                label="Disappearance date"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md6 lg6 xl6>
                            <v-text-field
                                v-model="caseObject.disappearance_type"
                                label="Disappearance type"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md6 lg6 xl6>
                            <v-text-field
                                v-model="caseObject.nationality"
                                label="Nationality"
                                :class="{'disable-events': true }"
                                class="textField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-textarea name="input-7-1"
                                        v-model="caseObject.default_message" box
                                        label="Default alert message"
                                        placeholder="Default alert message..." auto-grow
                                        rows="5" :class="{'disable-events': true }" class="textField"
                                        counter maxlength="5000">
                            </v-textarea>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-card>
    </div>
</template>

<script>
import moment from 'moment';
import { dates, filters, fonts } from '@/utils/mixins';
import { CasesApi, FeedbacksApi } from '@/api';
import { SET_SNACKBAR_STATUS } from '@/store/mutation-types';


export default {
    mixins: [dates, filters, fonts],
    props: {
        id: { type: [String, Number], required: true },
    },
    data() {
        return {
            baseUrl: process.env.VUE_APP_BACKEND,
            isLoaded: false,
            caseObject: {},
        };
    },
    created() {
        this.loadCase();
    },
    methods: {
        getAge(birthDate) {
            if (birthDate) {
                return `${Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)} years`;
            }
            return ' - ';
        },
        loadEditCase() {
            this.$router.push({ name: 'case_edit', params: { caseObjectProp: this.caseObject } });
        },
        async closeCase() {
            await CasesApi.close(this.id);
            this.$router.push({ name: 'cases' });
        },
        async archiveCase() {
            const { data: feedbacks } = await FeedbacksApi.all({ caseId: this.caseObject.id });
            this.feedbacks = feedbacks;
            let checkFeedbacks = true;
            feedbacks.forEach((feedback) => {
                if (feedback.is_valid === null || feedback.is_valid === undefined) {
                    checkFeedbacks = false;
                }
            });
            if (this.caseObject.disappearance_type == null || this.caseObject.disappearance_type === undefined) {
                this.$store.commit(SET_SNACKBAR_STATUS, { message: 'You must set disappearance type before archiving the case!', color: 'error' });
            } else if (this.caseObject.is_refugee == null || this.caseObject.is_refugee === undefined) {
                this.$store.commit(SET_SNACKBAR_STATUS, { message: 'You must set refugee before archiving the case!', color: 'error' });
            } else if (!checkFeedbacks) {
                this.$store.commit(SET_SNACKBAR_STATUS, { message: 'You must set set facts validation before archiving the case!', color: 'error' });
            } else {
                await CasesApi.archive(this.id);
                this.$router.push({ name: 'cases' });
                this.$store.commit(SET_SNACKBAR_STATUS, { message: 'Case has been archived!', color: 'primary' });
            }
        },
        getDate(value) {
            return moment(String(value)).format('YYYY-MM-DD HH:mm:ss');
        },
        async loadCase() {
            const { data: caseObject } = await CasesApi.get(this.id);
            this.caseObject = caseObject;
            this.caseObject.disappearance_date = this.getDate(caseObject.disappearance_date);
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
