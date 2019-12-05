<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout v-if="isLoaded" row class="user">
        <v-flex xs12>
            <v-card>
                <v-toolbar color="white" flat>
                    <router-link to="/users/" v-slot="{ href, route, navigate}">
                        <v-btn :href="href" @click="navigate" icon><v-icon>arrow_back</v-icon></v-btn>
                    </router-link>
                    <div>
                        <div class="title">User details</div>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn @click="editView()" color="primary"><v-icon left>edit</v-icon>Edit</v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-form ref="userForm" v-model="valid" lazy-validation>
                        <v-list two-line>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="primary">business</v-icon>
                                </v-list-tile-action>
                                <v-layout v-if="user.role!=='volunteer'">
                                    <v-flex xs12 sm6 md6 lg6 xl6>
                                        <v-list-tile-content>
                                            <v-list-tile-sub-title>Role</v-list-tile-sub-title>
                                            <v-list-tile-title>{{ (user.role || '') | customTitle('_') }}</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6 lg6 xl6>
                                        <v-list-tile-content>
                                            <v-list-tile-sub-title>Facility</v-list-tile-sub-title>
                                            <v-list-tile-title>{{ user.facility_name || ' - ' | title }}</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-flex>
                                </v-layout>
                                <v-layout v-else>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-list-tile-content>
                                            <v-list-tile-sub-title>Role</v-list-tile-sub-title>
                                            <v-list-tile-title>{{ (user.role || '') | customTitle('_') }}</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile>
                            <v-divider inset></v-divider>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="primary">email</v-icon>
                                </v-list-tile-action>
                                <v-layout>
                                    <v-flex xs12 sm6 md6 lg6 xl6>
                                        <v-list-tile-content>
                                            <v-list-tile-sub-title>Email</v-list-tile-sub-title>
                                            <v-list-tile-title>{{ user.email }}</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-flex>
                                    <v-flex>
                                        <v-list-tile-content>
                                            <v-list-tile-sub-title>Phone</v-list-tile-sub-title>
                                            <v-list-tile-title>{{ (user.phone || 'XXXXXXXXXX') | phoneFormat() }}</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile>
                            <v-divider inset></v-divider>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="primary">account_circle</v-icon>
                                </v-list-tile-action>
                                <v-layout>
                                    <v-flex xs12 sm6 md6 lg6 xl6>
                                        <v-list-tile-content>
                                            <v-list-tile-sub-title>First name</v-list-tile-sub-title>
                                            <v-list-tile-title>{{ user.first_name || '' | title }}</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-flex>
                                    <v-flex>
                                        <v-list-tile-content>
                                            <v-list-tile-sub-title>Last name</v-list-tile-sub-title>
                                            <v-list-tile-title>{{ user.last_name || '' | title }}</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile>
                            <v-divider inset></v-divider>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="primary">location_city</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-sub-title>City</v-list-tile-sub-title>
                                    <v-list-tile-title>{{ user.city || ' - ' }}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-divider inset></v-divider>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="primary">pin_drop</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-sub-title>Address</v-list-tile-sub-title>
                                    <v-list-tile-title>{{ user.address || ' - ' }}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                        <v-layout v-if="user.address" row>
                            <v-flex offset-sm1 mr-4>
                                <gmap-map :center="center" :zoom="18" :options="mapOptions"
                                          style="width:100%;  height: 230px;">
                                    <gmap-marker v-for="(m, index) in markers" :key="index" :position="m.position" :clickable="false"
                                                 :draggable="false" @click="center=m.position"/>
                                </gmap-map>
                            </v-flex>
                        </v-layout>
                        <v-list three-line>
                            <v-list-tile @click="">
                                <v-list-tile-action>
                                    <v-icon color="primary">description</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-sub-title>Description</v-list-tile-sub-title>
                                    <v-list-tile-title>{{ user.description || ' - ' }}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import { dates, filters, fonts } from '@/utils/mixins';
import { UsersApi } from '@/api';

export default {
    components: {},
    mixins: [dates, filters, fonts],
    props: {
        id: {
            type: String,
            required: false,
            default: null,
        },
    },
    data() {
        return {
            valid: true,
            isLoaded: false,
            user: {},
            center: {
                lat: 45.508,
                lng: -73.587,
            },
            markers: [],
            places: [],
            currentPlace: null,
            mapOptions: {
                disableDefaultUI: true,
            },
            place: null,
        };
    },
    async created() {
        if (this.id != null) {
            this.loadUser();
        }
        this.isLoaded = true;
    },
    methods: {
        async loadUser() {
            const { data: user } = await UsersApi.getUser(this.id);
            this.user = user;
            this.place = this.user.address;
            this.geolocate();
        },
        geolocate() {
            if (this.user.latitude && this.user.longitude) {
                const marker = {
                    lat: this.user.latitude,
                    lng: this.user.longitude,
                };
                this.markers.push({ position: marker });
                this.center = marker;
            }
        },
        editView() {
            this.$router.push({ name: 'user_edit', params: { id: String(this.id) } });
        },
    },
};
</script>

<style lang="scss">
.user {
}
</style>
