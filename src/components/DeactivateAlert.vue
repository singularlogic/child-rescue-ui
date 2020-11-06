<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-dialog v-model="deactivateAlertDialog" persistent max-width="500px" @keydown.esc="cancel()">
        <template v-slot:activator="{ on }">
            <v-btn flat color="red darken-1" v-on="on">{{ $t('deactivate_alert.deactivate_alert') }}</v-btn>
        </template>
        <v-card>
            <v-toolbar flat>
                <v-toolbar-title>
                    <span>{{ $t('deactivate_alert.verification') }}</span>
                </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="mx-2">{{ $t('deactivate_alert.verification_question') }}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color flat="flat" @click="cancel()">{{ $t('deactivate_alert.close') }}</v-btn>
                <v-btn color="red darken-1" flat="flat" @click="deactivateAlert()">{{ $t('deactivate_alert.deactivate_alert') }}</v-btn>
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
