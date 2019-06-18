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
    name: 'FeedbackMap',
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
        ...mapGetters('feedback_module', {
            getFeedback: 'getFeedback',
        }),
        feedbackObject: {
            get() {
                return this.getFeedback;
            },
            set(value) {
                this.updateFeedbackMutation(value);
            },
        },
    },
    created() {
        bus.$off('feedback-clear-auto-complete-event');
        bus.$on('feedback-clear-auto-complete-event', () => {
            navigator.geolocation.getCurrentPosition((position) => {
                this.center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
            });
        });
        bus.$off('enable-feedback-geolocation-event');
        bus.$on('enable-feedback-geolocation-event', () => {
            this.geolocate();
        });
        bus.$off('feedback-auto-complete-event');
        bus.$on('feedback-auto-complete-event', (place) => {
            this.updateSearchField(place);
        });
        bus.$off('feedback-load-auto-complete-event');
        bus.$on('feedback-load-auto-complete-event', (data) => {
            // this.updateSearchField(place);
            this.loadSearchField(data.latitude, data.longitude);
        });
    },
    methods: {
        ...mapMutations('feedback_module', {
            fetchFeedbackAddressMutation: 'fetchFeedbackAddressMutation',
            fetchFeedbackAddressCoordinatesMutation: 'fetchFeedbackAddressCoordinatesMutation',
        }),
        ...mapMutations('generic_module', {
            showSnackbarMutation: 'showSnackbarMutation',
            hideSnackbarMutation: 'hideSnackbarMutation',
            showLoaderMutation: 'showLoaderMutation',
            hideLoaderMutation: 'hideLoaderMutation',
        }),
        setPlace(place) {
            if (place.types[0] === 'street_address') {
                this.markers = [];
                this.currentPlace = place;
                this.fetchFeedbackAddressMutation(this.currentPlace);
            } else {
                this.showSnackbarMutation({ message: "Please choose a valid street address!", status: 'error' });
                setTimeout(() => this.hideSnackbarMutation(), 2000);
            }
        },
        drag(location) {
            const coordinates = {
                lat: location.latLng.lat(),
                lng: location.latLng.lng(),
            };
            this.fetchFeedbackAddressCoordinatesMutation(coordinates);
            bus.$emit('update-feedback-coords-event');
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
            bus.$emit('update-feedback-location-event');
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
            if (this.feedbackObject.latitude && this.feedbackObject.longitude) {
                const marker = {
                    lat: this.feedbackObject.latitude,
                    lng: this.feedbackObject.longitude,
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
        },
    },
};
</script>
