<template>
    <v-app>
        <slot></slot>
        <snackbar></snackbar>
    </v-app>
</template>

<script>
import { Snackbar } from '@/components';

export default {
    name: 'app',
    components: { Snackbar },
};
</script>
