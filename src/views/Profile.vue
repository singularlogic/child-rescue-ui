<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout v-if="isLoaded" row class="organization">
        <v-flex xs12 mx-4 my-4>
            <v-card>
                <v-img src="https://cdn.vuetifyjs.com/images/lists/ali.png" height="200px">
                    <v-layout column fill-height>
                        <v-card-title>
                            <v-spacer></v-spacer>
                            <v-btn v-if="isViewMode" @click="toggleMode()" dark icon class="mr-3">
                                <v-icon>edit</v-icon>
                            </v-btn>
                            <v-btn v-if="!isViewMode" @click="cancel()" dark icon class="mr-3">
                                <v-icon>close</v-icon>
                            </v-btn>
                            <v-btn v-if="!isViewMode" @click="validate()" dark icon class="mr-3">
                                <v-icon>check</v-icon>
                            </v-btn>
                        </v-card-title>
                        <v-spacer></v-spacer>
                    </v-layout>
                </v-img>
                <v-form ref="userForm" v-model="valid" lazy-validation @submit.prevent>
                    <v-list two-line>
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <v-icon color="primary">group</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content v-if="isViewMode">
                                <v-list-tile-sub-title>First name</v-list-tile-sub-title>
                                <v-list-tile-title>{{ user.first_name }}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-text-field v-if="!isViewMode" ref="nameField" v-model="user.first_name" label="First name" class="mr-2" :rules="[rules.required, rules.name]"></v-text-field>
                            <v-list-tile-content v-if="isViewMode">
                                <v-list-tile-sub-title>Last name</v-list-tile-sub-title>
                                <v-list-tile-title>{{ user.last_name }}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-text-field v-if="!isViewMode" v-model="user.last_name" label="Last name" class="ml-2" :rules="[rules.required, rules.name]"></v-text-field>
                        </v-list-tile>
                        <v-divider v-if="isViewMode" inset></v-divider>
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <v-icon color="primary">phone</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content v-if="isViewMode">
                                <v-list-tile-sub-title>Phone number</v-list-tile-sub-title>
                                <v-list-tile-title>{{ (user.phone || 'XXXXXXXXXX') | phoneFormat() }}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-text-field style="margin-left: 5px;" v-if="!isViewMode" clearable v-model="user.phone" mask="phone" placeholder="(XXX) XXX XXXX" label="Phone" :rules="[rules.phone]"></v-text-field>
                        </v-list-tile>
                        <v-divider v-if="isViewMode" inset></v-divider>
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <v-icon color="primary">mail</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content v-if="isViewMode">
                                <v-list-tile-sub-title>Email</v-list-tile-sub-title>
                                <v-list-tile-title>{{ user.email }}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-text-field v-if="!isViewMode" v-model="user.email" label="Email" :rules="[rules.required, rules.email]"></v-text-field>
                        </v-list-tile>
                        <v-divider v-if="isViewMode" inset></v-divider>
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <v-icon color="primary">location_on</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content v-if="isViewMode">
                                <v-list-tile-sub-title>Address</v-list-tile-sub-title>
                                <v-list-tile-title>{{ user.address || ' - ' }}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-text-field
                                v-if="!isViewMode"
                                ref="addressField"
                                v-model="place"
                                label="Address"
                                hint="Type the address and then hit enter"
                                persistent-hint
                                :rules="[rules.required, rules.address]"
                                @keyup.enter.native="triggerPlaceChangeEvent(place)"></v-text-field>
                            <v-btn v-if="!isViewMode" dark outline color="primary" style="margin-top: 0px;" @click="triggerPlaceChangeEvent(place)">Find address</v-btn>
                        </v-list-tile>
                    </v-list>
                    <v-divider v-if="isViewMode" inset></v-divider>
                    <v-layout v-if="user.latitude!==null || !isViewMode" row>
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
                            <v-list-tile-content v-if="isViewMode">
                                <v-list-tile-sub-title>Description</v-list-tile-sub-title>
                                <v-list-tile-title>{{ user.description || ' - ' }}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-textarea
                                v-if="!isViewMode"
                                v-model="user.description"
                                rows="1" row-height="30px"
                                label="Description"
                                no-resize></v-textarea>
                        </v-list-tile>
                    </v-list>
                </v-form>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import { bus } from '../main';
import { dates, filters, fonts } from '@/utils/mixins';
import { UsersApi } from '@/api';
import { SET_SNACKBAR_STATUS } from '@/store/mutation-types';

export default {
    components: {},
    mixins: [dates, filters, fonts],
    data() {
        return {
            isLoaded: false,
            valid: true,
            isViewMode: true,
            user: null,
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
            rules: {
                required: value => !!value || 'Field is required',
                address: value => (value && value.length > 5 && value.length < 250) || 'Address must be between 5 and 50 characters',
                name: value => (value && value.length >= 3 && value.length <= 20) || 'Field must be between 3 and 20 characters',
                phone: value => ((value && value.length === 10) || (!value)) || 'Phone must have 10 characters',
                email: value => (value && /.+@.+/.test(value)) || 'E-mail must be valid',
            },
        };
    },
    created() {
        this.loadUser();
    },
    methods: {
        async loadUser() {
            const { data: user } = await UsersApi.get();
            this.user = user;
            this.isLoaded = true;
            this.place = this.user.address;
            this.geolocate();
        },
        toggleMode() {
            this.isViewMode = !this.isViewMode;
            if (!this.isViewMode) {
                this.$nextTick(() => {
                    this.$refs.nameField.focus();
                });
            }
        },
        validate() {
            if (this.$refs.userForm.validate()) {
                this.save();
            }
        },
        setPlace(place) {
            this.markers = [];
            this.currentPlace = place;
            this.user.address = this.currentPlace.formatted_address;
            this.user.latitude = this.currentPlace.geometry.location.lat();
            this.user.longitude = this.currentPlace.geometry.location.lng();
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
        triggerPlaceChangeEvent(address) {
            if (address && address != null && address.length > 5) {
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ address }, (results, status) => {
                    if (status !== 'OK' || !results[0]) {
                        throw new Error(status);
                    }
                    results[0].formatted_address = address;
                    this.place = results[0].formatted_address;
                    this.setPlace(results[0]);
                });
            }
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
        async save() {
            const { data: user } = await UsersApi.edit(this.user);
            this.user = user;
            bus.$emit('reload-layout-event');
            this.toggleMode();
            this.$store.commit(SET_SNACKBAR_STATUS, { message: 'User updated successfully!', color: 'primary' });
        },
        cancel() {
            this.loadUser();
            this.toggleMode();
        },
    },
};
</script>

<style lang="scss">
.organization {
    .editable {
        border: 2px solid #F4B350;
    }
}
</style>
