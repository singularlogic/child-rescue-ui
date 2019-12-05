<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div style="padding: 0px;" v-if="isLoaded">
        <v-layout row wrap>
            <v-flex xs12 sm12 md12 lg12 xl12>
                <v-card>
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">REAL TIME ACTIVITY</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-tile v-for="(item, index) in logs" @click="">
                                <v-list-tile-content>
                                    <div :class="{ hasColor: index%2===0 }"
                                         style="text-align: left; font-size: medium; font-weight: bold;">
                                        <span v-if="index <= 2" class="isNew">new</span>
                                        {{ item.text }}
                                    </div>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                    <v-icon large>keyboard_arrow_right</v-icon>
                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            isLoaded: false,
            logs: [
                { text: 'Evidence #1234 for Tony Montana case' },
                { text: 'New message in Rescue Team #3 for Tony Montana' },
                { text: 'Evidence #1234 for Tony Montana case' },
                { text: 'New message in Rescue Team #3 for Tony Montana' },
                { text: 'Evidence #1234 for Tony Montana case' },
                { text: 'New message in Rescue Team #3 for Tony Montana' },
                { text: 'Evidence #1234 for Tony Montana case' },
                { text: 'New message in Rescue Team #3 for Tony Montana' },
                { text: 'New message in Rescue Team #3 for Tony Montana' },
            ],
        };
    },
    computed: {},
    created() {
        this.isLoaded = true;
    },
    methods: {},
};
</script>

<style scoped>
    .hasColor {
        color: cornflowerblue;
    }
    .isNew {
        color: #ffffff;
        background-color: red;
        border-radius: 2px;
        font-size: small;
        padding: 2px;
    }
</style>
