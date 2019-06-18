<template>
    <v-app>
        <router-view></router-view>
        <v-snackbar :color="getSnackbarStatus" :value="getIsSnackbarShown" :top=true :timeout="0">
            {{ getSnackbarMessage }}
            <v-btn flat dark @click="hideSnackbarMutation">
                <!--{{ $t('generic.close') }}-->
                Close
            </v-btn>
        </v-snackbar>
        <!--<v-dialog v-model="getLoader" hide-overlay persistent width="300">-->
            <!--<v-card color="primary" dark>-->
                <!--<v-card-text>-->
                    <!--Please stand by-->
                    <!--<v-progress-linear indeterminate color="purple" class="mb-0"></v-progress-linear>-->
                <!--</v-card-text>-->
            <!--</v-card>-->
        <!--</v-dialog>-->
    </v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: 'App',
    data() {
        return {};
    },
    computed: {
        ...mapGetters('generic_module', {
            getIsSnackbarShown: 'getIsSnackbarShown',
            getSnackbarStatus: 'getSnackbarStatus',
            getSnackbarMessage: 'getSnackbarMessage',
            getLoader: 'getLoader',
        }),
    },
    methods: {
        ...mapMutations('generic_module', {
            hideSnackbarMutation: 'hideSnackbarMutation',
        }),
    },
};
</script>

<style>

</style>
