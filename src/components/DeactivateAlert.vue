<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-dialog v-model="deactivateAlertDialog" persistent max-width="300px" @keydown.esc="cancel()">
        <template v-slot:activator="{ on }">
            <v-btn dark color="pink" v-on="on">Deactivate alert</v-btn>
        </template>
        <v-card>
            <v-card-title class="headline">Deactivate alert verification</v-card-title>
            <v-card-text>Are you sure you want to deactivate the alert?</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color flat="flat" @click="cancel()">Close</v-btn>
                <v-btn color="red darken-1" flat="flat" @click="deactivateAlert()">Deactivate alert</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { AlertsApi } from '@/api';
import { bus } from '../main';

export default {
    props: {
        alertId: { type: String, default: null },
    },
    data() {
        return {
            deactivateAlertDialog: false,
        };
    },
    methods: {
        cancel() {
            this.deactivateAlertDialog = false;
        },
        async deactivateAlert() {
            const { data: alertObject } = await AlertsApi.deactivate(this.alertId);
            this.deactivateAlertDialog = false;
            bus.$emit('reload-alerts-event');
            bus.$emit('close-alert-dialog-event');
        },
    },
};
</script>
