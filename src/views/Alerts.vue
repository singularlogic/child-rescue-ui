<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div style="padding: 10px;">
        <v-breadcrumbs :items="linkItems">
            <template v-slot:divider>
                <v-icon>chevron_right</v-icon>
            </template>
        </v-breadcrumbs>
        <v-layout wrap>
            <v-spacer></v-spacer>
            <v-btn dark color="#D91E18">
                <v-icon dark>add</v-icon>
                Amber alert
            </v-btn>
            <v-btn dark color="#666666">
                <v-icon dark>add</v-icon>
                Missing child
            </v-btn>
        </v-layout>
        <v-layout>
            <v-flex xs12 sm12 md12 lg12 xl12>
                <div style="font-size: large; margin: 10px;">Public alerts (4)</div>
                <v-data-table
                    :headers="headers"
                    :items="alerts"
                    :search="search"
                >
                    <template v-slot:items="props">
                        <td>
                            <v-avatar
                                :tile=true
                                :size="64"
                                color="grey lighten-4"
                                style="margin: 5px;"
                            >
                                <img :src="props.item.icon" alt="avatar">
                            </v-avatar>
                        </td>
                        <td>
                            <span style="color: #3B5998;">{{ props.item.name }}</span></td>
                        <td class="text-xs-left">{{ props.item.type }}</td>
                        <td class="text-xs-left">{{ props.item.duration }}</td>
                        <td class="text-xs-left">{{ props.item.radius }}</td>
                        <td class="text-xs-left">{{ props.item.location }}</td>
                    </template>
                    <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                        Your search for "{{ search }}" found no results.
                    </v-alert>
                </v-data-table>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
export default {
    data() {
        return {
            linkItems: [
                {
                    text: 'Home',
                    disabled: false,
                    href: '/dashboard',
                },
                {
                    text: 'Alerts',
                    disabled: true,
                    href: '/alerts',
                },
            ],
            search: '',
            headers: [
                {
                    text: '',
                    sortable: false,
                    value: 'icon'
                },
                {
                    text: 'NAME',
                    value: 'name'
                },
                {
                    text: 'TYPE',
                    value: 'type'
                },
                {
                    text: 'DURATION',
                    value: 'duration'
                },
                {
                    text: 'RADIUS',
                    value: 'radius'
                },
                {
                    text: 'LOCATION',
                    value: 'location'
                }
            ],
            alerts: [
                {
                    icon: 'https://vuetifyjs.com/apple-touch-icon-180x180.png',
                    name: 'Child 1',
                    type: 'AMBER ALERT',
                    duration: '1 day',
                    radius: '5km',
                    location: 'Athens, Greece',
                },
                {
                    icon: 'https://vuetifyjs.com/apple-touch-icon-180x180.png',
                    name: 'Child 1',
                    type: 'AMBER ALERT',
                    duration: '1 day',
                    radius: '5km',
                    location: 'Athens, Greece',
                },
                {
                    icon: 'https://vuetifyjs.com/apple-touch-icon-180x180.png',
                    name: 'Child 1',
                    type: 'AMBER ALERT',
                    duration: '1 day',
                    radius: '5km',
                    location: 'Athens, Greece',
                },
                {
                    icon: 'https://vuetifyjs.com/apple-touch-icon-180x180.png',
                    name: 'Child 1',
                    type: 'AMBER ALERT',
                    duration: '1 day',
                    radius: '5km',
                    location: 'Athens, Greece',
                },
            ]
        };
    },
    methods: {
        loadCase(caseObject) {
            this.$router.push({
                name: 'case',
                params: { caseObjectProp: caseObject }
            });
        },
        getUserType(user) {
            return user !== 'Anonymous' && user !== 'Police';
        }
    }
};
</script>

<style scoped>
    .blueName {
        color: #3B5998
    }

    .tile_background {
        height: 165px;
        background-color: #C3C3C3;
        background-image: url("../assets/logo.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    .tile_background_tags {
        position: relative;
        top: calc(100% - 30px);
        padding: 5px;
    }

    .tile_background_tag_left {
        color: #ffffff;
        font-weight: bold;
        text-align: left;
    }

    .tile_background_tag_right {
        color: #ffffff;
        font-weight: bold;
        text-align: right;
    }

    .hasColor {
        color: cornflowerblue;
    }

    .clickable_card {
        overflow: hidden;
    }

    .clickable_card:hover .tile_background {
        transform: scale(1.02);
    }

    .clickable_card:hover {
        cursor: pointer;
    }
</style>
