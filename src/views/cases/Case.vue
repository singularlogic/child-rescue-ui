<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <router-view></router-view>
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
