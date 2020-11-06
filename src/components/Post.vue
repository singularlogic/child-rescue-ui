<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-card class="my-2 mx-4 pt-2" style="border-radius: 10px;">
        <v-list-tile avatar>
            <v-list-tile-avatar>
                <v-icon v-if="postObject.role==='volunteer'" large color="blue lighten-2">person</v-icon>
                <v-icon v-else large color="green darken-2">admin_panel_settings</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title class="subheading font-weight-bold">{{ postObject.name | title }} <v-icon small label outline>keyboard_arrow_right</v-icon>{{ postObject.tag | title }}</v-list-tile-title>
                <v-list-tile-title v-if="postObject.address && postObject.image">at <span class="subheading font-weight-bold">{{ postObject.address | title }}</span></v-list-tile-title>
                <v-list-tile-sub-title class="grey--text">
                    {{ postObject.created_at | formatDateTime }} ·
                    <v-icon v-if="postObject.is_visible_to_volunteers" small label outline>public</v-icon>
                    <v-icon v-else color="grey" small label outline>people</v-icon>
                </v-list-tile-sub-title>
            </v-list-tile-content>
        </v-list-tile>
        <div v-if="postObject.description" class='body-1 mx-4 my-2 pb-2'>{{ postObject.description || "-" | title}}</div>
        <a v-if="postObject.image" :href="postObject.image" target="_blank" class="mb-2 pb-2">
            <v-img :contain="postObject.image !== null ? false : true" :src="postObject.image" style="max-height: 230px;" class="white--text align-end mb-2 pb-2"></v-img>
        </a>
        <gmap-map v-if="postObject.address && !postObject.image" :center="center" :zoom="18" :options="mapOptions" class="py-2 px-4"
                  style="width:100%; height: 200px;">
            <gmap-marker v-for="(m, index) in markers" :key="index" :position="m.position" :clickable="false"
                         :draggable="false" @click="center=m.position"/>
            <gmap-circle v-for="(m) in markers" :key="m.id" :radius="m.radius" :center="m.position" :clickable="false" :draggable="false"
                         :options="{fillColor:'red', fillOpacity:0.1, strokeWidth:1, strokeColor:'red', strokePattern: 'gap' }"/>
        </gmap-map>
        <v-list-tile v-if="postObject.address && !postObject.image" avatar style="background: #828282; color: #E7F3FF;" class="pb-2">
            <v-list-tile-avatar>
                <v-icon large color="#E7F3FF">location_on</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title class="subheading">Address</v-list-tile-title>
                <v-list-tile-title class="subheading font-weight-bold">{{ postObject.address | title }}</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
    </v-card>
</template>

<script>
import { dates, filters, fonts } from '@/utils/mixins';

export default {
    mixins: [dates, filters, fonts],
    props: {
        postObject: { type: [Object], default: null, required: true },
    },
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
                scrollwheel: false,
                zoomControl: false,
                mapTypeControl: false,
                streetViewControl: false,
            },
            place: null,
        };
    },
    created() {
        this.geolocate();
    },
    methods: {
        setPlace(place) {
            this.markers = [];
            this.currentPlace = place;
            this.postObject.address = this.currentPlace.formatted_address;
            this.postObject.latitude = this.currentPlace.geometry.location.lat();
            this.postObject.longitude = this.currentPlace.geometry.location.lng();
            this.addMarker();
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
        },
        geolocate() {
            if (this.postObject.latitude && this.postObject.longitude) {
                const marker = {
                    lat: this.postObject.latitude,
                    lng: this.postObject.longitude,
                };
                this.markers.push({ position: marker });
                this.center = marker;
            }
        },
    },
};
</script>
