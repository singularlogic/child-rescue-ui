<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <router-view></router-view>
    <!-- <div v-if="isLoaded">
        <v-layout wrap>
            <v-flex xs12 sm12 md8 lg8 xl6 v-if="$store.state.role==='case_manager'">
                <v-layout align-center row fill-height reverse wrap>
                    <v-flex>
                        <div v-if="caseObject.status!='closed'" class="text-xs-right">
                            <v-btn dark color="#F4B350" @click="loadEditCase()">Edit case</v-btn>
                            <feedback
                                :case-id="caseObject.id"
                                :full-name="caseObject.personal_data.full_name"
                            ></feedback>
                            <alert :case-id="caseObject.id" :case-alert-message="caseObject.default_message" :full-name="caseObject.personal_data.full_name"></alert>
                            <v-btn outline dark color="#000000" @click="closeCase()">CLOSE CASE</v-btn>
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-layout align-center justify-center wrap>
            <v-flex xs12 sm12 md12 lg12 xl12 class="text-xs-center">
                <router-view></router-view>
            </v-flex>
        </v-layout>
    </div> -->
</template>

<script>
import Feedback from '@/components/Feedback.vue';
import Alert from '@/components/Alert.vue';
import { fonts } from '@/utils/mixins';

import { CasesApi } from '@/api';

export default {
    components: {
        alert: Alert,
        feedback: Feedback,
    },
    mixins: [fonts],
    props: {
        id: { type: [Number, String], required: true },
    },
    data() {
        return {
            isLoaded: false,
            caseObject: {},
        };
    },
    async created() {
        this.loadCase();
    },
    methods: {
        async loadCase() {
            if (this.id !== 'new') {
                const { data: caseObject } = await CasesApi.get(this.id);
                this.caseObject = caseObject;
                this.isLoaded = true;
            } else {
                this.$router.push({ name: 'cases' });
            }
        },
    },
};
</script>
