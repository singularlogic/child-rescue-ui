<template>
    <v-snackbar v-model="show" :color="color" bottom left>
        {{ message }}
        <v-btn flat @click.native="clear()">{{ $t('snackbar.close') }}</v-btn>
    </v-snackbar>
</template>

<script>
import { SET_SNACKBAR_STATUS } from '@/store/mutation-types';

export default {
    data: () => ({
        show: false,
        message: '',
        color: '',
        delay: null,
    }),
    async created() {
        this.$store.watch(state => state.snackbarMessage, () => {
            const msg = this.$store.state.snackbarMessage;
            const color = this.$store.state.snackbarColor;
            if (msg !== '') {
                this.show = true;
                this.message = msg;
                this.color = color;
                this.delay = setTimeout(() => {
                    this.$store.commit(SET_SNACKBAR_STATUS, { message: '', color: '' });
                }, 5000);
            }
        });
    },
    methods: {
        clear() {
            this.show = false;
            clearTimeout(this.delay);
        },
    },
};
</script>
