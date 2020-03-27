<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-card class="my-2 mx-4">
        <v-toolbar dense flat>
            <span v-if="postObject.role==='volunteer'" class="green--text">{{ postObject.name | title }}</span>
            <span v-else class="blue--text">{{ postObject.name | title }}</span>
            <v-spacer></v-spacer>
            <span class="grey--text caption">{{ postObject.created_at | formatDateTime }}</span>
        </v-toolbar>
        <v-img v-if="postObject.image" :contain="postObject.image !== null ? false : true" :src="postObject.image" style="max-height: 230px;" class="white--text align-end">
            <v-toolbar flat dense color="rgba(0, 0, 0, 0.2)">
                <v-icon v-if="postObject.is_visible_to_volunteers" color="green" small label outline>visibility</v-icon>
                <v-icon v-else color="grey" small label outline>visibility_off</v-icon>
                &nbsp;
                <v-chip color="secondary" small label outline>#{{ postObject.tag }}</v-chip>
                <v-btn v-if="postObject.role==='volunteer'" icon><v-icon color="green">note_add</v-icon></v-btn>
            </v-toolbar>
        </v-img>
        <gmap-map v-if="postObject.latitude" :center="center" :zoom="18" :options="mapOptions" class="py-2 px-2"
                  style="width:100%; height: 230px;">
            <gmap-marker v-for="(m, index) in markers" :key="index" :position="m.position" :clickable="false"
                         :draggable="false" @click="center=m.position"/>
            <gmap-circle v-for="(m) in markers" :key="m.id" :radius="m.radius" :center="m.position" :clickable="false" :draggable="false"
                         :options="{fillColor:'red', fillOpacity:0.1, strokeWidth:1, strokeColor:'red', strokePattern: 'gap' }"/>
        </gmap-map>
        <v-divider v-if="postObject.description"></v-divider>
        <v-card-title v-if="postObject.description">
            <div class='caption font-weight-light mx-2 my-0'>{{ postObject.description || "-" | title}}</div>
        </v-card-title>
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
