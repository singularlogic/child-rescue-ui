<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-dialog v-model="dialogCaseModal" persistent max-width="900px" @keydown.esc="cancel()">
        <template v-slot:activator="{ on }">
            <v-btn dark color="#F4B350" v-on="on">
                <v-icon dark>add</v-icon>
                Create case
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                <span class="headline">New alert</span>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12 sm12 md6 lg6 xl6>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="caseObject.duration"
                                                  class="header-text-field-input"
                                                  label="Duration" placeholder="Duration in hours"
                                                  prepend-icon="access_time"></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-flex>
                </v-layout>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="dialogCaseModal = false">Close</v-btn>
                <v-btn color="blue darken-1" flat @click="dialogCaseModal = false">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {},
    data() {
        return {
            dialogCaseModal: false,
            caseObject: {},
        };
    },
    computed: {
        ...mapGetters('case_module', {
            getCases: 'getCases',
        }),
    },
};
</script>
