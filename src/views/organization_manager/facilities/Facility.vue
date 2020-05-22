<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout v-if="isLoaded" row class="facility">
        <v-flex xs12 sm12>
            <v-card>
                <v-toolbar color="white" flat>
                    <router-link to="/facilities/" v-slot="{ href, route, navigate}">
                        <v-btn :href="href" @click="navigate" icon><v-icon>arrow_back</v-icon></v-btn>
                    </router-link>
                    <div class="title">{{ $t('facility.details') }}</div>
                    <v-spacer></v-spacer>
                    <v-btn @click="editView()" color="primary"><v-icon left>edit</v-icon>{{ $t('facility.edit') }}</v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-form ref="facilityForm" v-model="valid" lazy-validation>
                        <v-list two-line>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="primary">business</v-icon>
                                </v-list-tile-action>
                                <v-layout>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-list-tile-content>
                                            <v-list-tile-sub-title>{{ $t('facility.facility') }}</v-list-tile-sub-title>
                                            <v-list-tile-title>{{ facility.name | title }}</v-list-tile-title>
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
                                            <v-list-tile-sub-title>{{ $t('facility.email') }}</v-list-tile-sub-title>
                                            <v-list-tile-title>{{ facility.email || ' - ' }}</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-flex>
                                    <v-flex>
                                        <v-list-tile-content>
                                            <v-list-tile-sub-title>{{ $t('facility.phone') }}</v-list-tile-sub-title>
                                            <v-list-tile-title>{{ (facility.phone || 'XXXXXXXXXX') | phoneFormat() }}</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile>
                            <v-divider inset></v-divider>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="primary">info</v-icon>
                                </v-list-tile-action>
                                <v-layout v-if="facility.supports_hosting">
                                    <v-flex xs12 sm6 md6 lg6 xl6>
                                        <v-list-tile-content>
                                            <v-list-tile-sub-title>{{ $t('facility.is_hosting') }}</v-list-tile-sub-title>
                                            <v-list-tile-title>{{ String(facility.supports_hosting) | title }}</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-flex>
                                    <v-flex>
                                        <v-list-tile-content>
                                            <v-list-tile-sub-title>{{ $t('facility.capacity') }}</v-list-tile-sub-title>
                                            <v-list-tile-title>{{ facility.capacity }}</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-flex>
                                </v-layout>
                                <v-layout v-else>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-list-tile-content>
                                            <v-list-tile-title>{{ String(facility.supports_hosting) | title }}</v-list-tile-title>
                                            <v-list-tile-sub-title>{{ $t('facility.is_hosting') }}</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile>
                            <v-divider inset></v-divider>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="primary">pin_drop</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-sub-title>{{ $t('facility.address') }}</v-list-tile-sub-title>
                                    <v-list-tile-title>{{ facility.address || ' - ' }}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                        <v-layout v-if="facility.address" row>
                            <v-flex offset-sm1 mr-4>
                                <gmap-map :center="center" :zoom="18" :options="mapOptions"
                                          style="width:100%;  height: 230px;">
                                    <gmap-marker v-for="(m, index) in markers" :key="index" :position="m.position" :clickable="false"
                                                 :draggable="false" @click="center=m.position"/>
                                </gmap-map>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import { dates, filters, fonts } from '@/utils/mixins';
import { FacilitiesApi } from '@/api';

export default {
    components: {},
    mixins: [dates, filters, fonts],
    props: {
        id: {
            type: String,
            required: true,
            default: null,
        },
    },
    data() {
        return {
            valid: true,
            isLoaded: false,
            isLoadedSuccessfully: false,
            facility: {},
            center: {
                lat: 45.508,
                lng: -73.587,
            },
            markers: [],
            places: [],
            currentPlace: null,
            mapOptions: {
                // disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: true,
                streetViewControl: true,
            },
            place: null,
        };
    },
    async created() {
        this.loadFacility();
    },
    methods: {
        async loadFacility() {
            try {
                const { data: facility } = await FacilitiesApi.get(this.id);
                this.facility = facility;
                this.place = this.facility.address;
                this.geolocate();
                this.isLoaded = true;
            } catch (e) {
                console.log(e);
                this.$router.push({ name: 'facilities' });
            }
        },
        geolocate() {
            if (this.facility.latitude && this.facility.longitude) {
                const marker = {
                    lat: this.facility.latitude,
                    lng: this.facility.longitude,
                };
                this.markers.push({ position: marker });
                this.center = marker;
            }
        },
        editView() {
            this.$router.push({ name: 'facility_edit', params: { id: String(this.id) } });
        },
    },
};
</script>

<style lang="scss">
.facility {
}
</style>
