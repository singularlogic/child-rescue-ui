<template>
    <v-layout>
        <v-flex>
            <br>
            <gmap-map :center="center" :zoom="18" :options="mapOptions"
                      style="width:100%;  height: 230px; margin-bottom: 5px;">
                <gmap-marker v-for="(m, index) in markers" :key="index" :position="m.position" :clickable="true"
                             :draggable="false" @click="center=m.position" @dragend="drag"/>
            </gmap-map>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { bus } from '../main';
import { gmapApi } from 'vue2-google-maps';

export default {
    name: 'AlertMap',
    data() {
        return {
            center: {
                lat: 45.508,
                lng: -73.587,
            },
            markers: [],
            places: [],
            currentPlace: null,
            autocomplete: null,
            mapOptions: {
                disableDefaultUI: true,
            },
        };
    },
    computed: {
        google: gmapApi,
        ...mapGetters('alert_module', {
            getAlert: 'getAlert',
        }),
        alertObject: {
            get() {
                return this.getAlert;
            },
            set(value) {
                this.updateAlertMutation(value);
            },
        },
    },
    created() {
        bus.$off('alert-clear-auto-complete-event');
        bus.$on('alert-clear-auto-complete-event', () => {
            navigator.geolocation.getCurrentPosition((position) => {
                this.center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
            });
        });
        bus.$off('enable-alert-geolocation-event');
        bus.$on('enable-alert-geolocation-event', () => {
            this.geolocate();
        });
        bus.$off('alert-auto-complete-event');
        bus.$on('alert-auto-complete-event', (place) => {
            this.updateSearchField(place);
        });
        bus.$off('alert-load-auto-complete-event');
        bus.$on('alert-load-auto-complete-event', (data) => {
            // this.updateSearchField(place);
            this.loadSearchField(data.latitude, data.longitude);
        });
    },
    methods: {
        ...mapMutations('alert_module', {
            fetchAlertAddressMutation: 'fetchAlertAddressMutation',
            fetchAlertAddressCoordinatesMutation: 'fetchAlertAddressCoordinatesMutation',
        }),
        ...mapMutations('generic_module', {
            showSnackbarMutation: 'showSnackbarMutation',
            hideSnackbarMutation: 'hideSnackbarMutation',
            showLoaderMutation: 'showLoaderMutation',
            hideLoaderMutation: 'hideLoaderMutation',
        }),
        setPlace(place) {
            this.markers = [];
                this.currentPlace = place;
                this.fetchAlertAddressMutation(this.currentPlace);
            // if (place.types[0] === 'street_address') {
            //     this.markers = [];
            //     this.currentPlace = place;
            //     this.fetchAlertAddressMutation(this.currentPlace);
            // } else {
            //     this.showSnackbarMutation('Please choose a valid street address!');
            //     setTimeout(() => this.hideSnackbarMutation(), 2000);
            // }
        },
        drag(location) {
            const coordinates = {
                lat: location.latLng.lat(),
                lng: location.latLng.lng(),
            };
            this.fetchAlertAddressCoordinatesMutation(coordinates);
            bus.$emit('update-alert-coords-event', coordinates);
        },
        addMarker() {
            if (this.currentPlace) {
                const marker = {
                    lat: this.currentPlace.geometry.location.lat(),
                    lng: this.currentPlace.geometry.location.lng(),
                };
                this.markers.push({ position: marker });
                this.places.push(this.currentPlace);
                this.center = marker;
                this.currentPlace = null;
            }
            bus.$emit('update-alert-location-event');
        },
        updateSearchField(place) {
            this.setPlace(place);
            this.addMarker();
        },
        loadSearchField(latitude, longitude) {
            this.markers = [];
            const marker = {
                lat: latitude,
                lng: longitude,
            };
            this.markers.push({ position: marker });
            // this.places.push(this.currentPlace);
            this.center = marker;
            this.currentPlace = null;
        },
        geolocate() {
            if (this.alertObject) {
                if (this.alertObject.latitude && this.alertObject.longitude) {
                    const marker = {
                        lat: this.alertObject.latitude,
                        lng: this.alertObject.longitude,
                    };
                    this.markers.push({ position: marker });
                    this.center = marker;
                } else {
                    navigator.geolocation.getCurrentPosition((position) => {
                        this.center = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                    });
                }
            }
        },
    },
};
</script>
