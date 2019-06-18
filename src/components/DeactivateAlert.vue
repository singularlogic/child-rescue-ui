<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-dialog v-model="deactivateAlertDialog" persistent max-width="300px">
        <template v-slot:activator="{ on }">
            <v-btn dark color="pink" v-on="on">
                Deactivate alert
            </v-btn>
        </template>
        <v-card>
            <v-card-title class="headline">Deactivate alert verification</v-card-title>
            <v-card-text>Are you sure you want to deactivate the alert?
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="" flat="flat" @click="cancel()">Close</v-btn>
                <v-btn color="red darken-1" flat="flat" @click="deactivateAlert()">Deactivate alert</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { bus } from '../main';
import AlertMap from './AlertMap';
import moment from 'moment';

import { mapGetters, mapMutations, mapActions } from 'vuex';
import * as R from 'ramda';

export default {
    components: {},
    props: {
        caseId: null,
        alertId: null,
    },
    data() {
        return {
            deactivateAlertDialog: false,
        };
    },
    computed: {
        ...mapGetters('alert_module', {
            getAlert: 'getAlert',
            getAlertStructure: 'getAlertStructure',
        }),
        alertObject: {
            get() {
                return R.clone(this.getAlert);
            },
            set(value) {
                this.updateAlertMutation(value);
            },
        },
    },
    mounted() {
        bus.$emit('enable-alert-geolocation-event');
    },
    created() {

    },
    methods: {
        ...mapMutations('generic_module', {
            showSnackbarMutation: 'showSnackbarMutation',
            hideSnackbarMutation: 'hideSnackbarMutation',
            showLoaderMutation: 'showLoaderMutation',
            hideLoaderMutation: 'hideLoaderMutation',
        }),
        ...mapMutations('alert_module', {
            clearAlertMutation: 'clearAlertMutation',
            updateAlertMutation: 'updateAlertMutation',
            addToAlertsMutation: 'addToAlertsMutation',
            replaceToAlertsMutation: 'replaceToAlertsMutation',
        }),
        ...mapActions('alert_module', {
            deactivateAlertAction: 'deactivateAlertAction',
        }),
        cancel() {
            this.deactivateAlertDialog = false;
        },
        deactivateAlert() {
            this.deactivateAlertDialog = false;
            this.alertObject.is_active = false;
            this.showLoaderMutation();
            this.deactivateAlertAction({ alertObject: this.alertObject })
                .then((response) => {
                    if (response.status === 200) {
                        this.hideLoaderMutation();
                        this.replaceToAlertsMutation(response.data);
                        bus.$emit('reload-alerts-event');
                        bus.$emit('close-alert-dialog-event');
                    } else {
                        this.hideLoaderMutation();
                    }
                })
                .catch((error) => {
                    this.hideLoaderMutation();
                    if (error.response) {
                        this.showSnackbarMutation({ message: error.response, status: 'error' });
                    } else {
                        this.showSnackbarMutation({ message: "Network error", status: 'error' });
                    }
                    setTimeout(() => {
                        this.hideSnackbarMutation();
                    }, 3000);
                });
        }
    }
};
</script>

<style scoped>
</style>
