<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout v-if="isLoaded" row class="user">
        <v-flex xs12>
            <v-card>
                <v-toolbar color="white" flat>
                    <v-icon>edit</v-icon>
                    <div class="mx-2">
                        <div class="title">Edit user</div>
                        <div class="caption grey--text">* fields are required</div>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn v-if="id" @click="presentView()" color="" dark>
                        <span>Cancel</span>
                    </v-btn>
                    <v-btn v-else @click="presentListView()" color="" dark>
                        <span>Cancel</span>
                    </v-btn>
                    <v-btn @click="validate()" color="primary" dark>
                        <span v-if="id">Update</span>
                        <span v-else>Save</span>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-form ref="userForm" v-model="valid" lazy-validation @submit.prevent>
                        <v-list two-line>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="primary">business</v-icon>
                                </v-list-tile-action>
                                <v-layout v-if="user.role!=='volunteer'">
                                    <v-flex xs12 sm6 md6 lg6 xl6>
                                        <v-select :items="roleOptions" v-model="user.role" :rules="[rules.required]"
                                                  label="* Role" item-text="text" item-value="value" hint="Select the user role."
                                                  style="margin-right:5px;">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6 lg6 xl6>
                                        <v-select :items="organizationFacilities" v-model="user.facility" :rules="[rules.required]"
                                                  label="* Facility" :item-text="facilityTemplate" item-value="id" hint="Choose a facility for the user."
                                                  style="margin-left:5px;">
                                        </v-select>
                                    </v-flex>
                                </v-layout>
                                <v-layout v-else>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-select :items="roleOptions" v-model="user.role" :rules="[rules.required]"
                                                  label="* Role" item-text="text" item-value="value" hint="Select the user role."
                                                  style="margin-right:5px;">
                                        </v-select>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="primary">email</v-icon>
                                </v-list-tile-action>
                                <v-layout>
                                    <v-flex xs12 sm6 md6 lg6 xl6>
                                        <v-text-field style="margin-right: 5px;" v-if="!isViewMode" clearable v-model="user.email" label="* Email" :rules="[rules.required, rules.email]"></v-text-field>
                                    </v-flex>
                                    <v-flex>
                                        <v-text-field style="margin-left: 5px;" v-if="!isViewMode" clearable v-model="user.phone" mask="phone" placeholder="(XXX) XXX XXXX" label="Phone" :rules="[rules.phone]"></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile>
                            <v-list-tile v-if="!id">
                                <v-list-tile-action>
                                    <v-icon color="primary">lock</v-icon>
                                </v-list-tile-action>
                                <v-layout>
                                    <v-flex xs12 sm6 md6 lg6 xl6>
                                        <v-text-field style="margin-right: 5px;" type="password" v-if="!isViewMode" clearable v-model="user.password" label="* Password" :rules="[rules.required, rules.password]" counter></v-text-field>
                                    </v-flex>
                                    <v-flex>
                                        <v-text-field style="margin-left: 5px;" type="password" v-if="!isViewMode" clearable v-model="repeatPassword" label="* Repeat password" :rules="[rules.required, rules.repeatPassword]"></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="primary">account_circle</v-icon>
                                </v-list-tile-action>
                                <v-layout>
                                    <v-flex xs12 sm6 md6 lg6 xl6>
                                        <v-text-field style="margin-right: 5px;" v-if="!isViewMode" clearable v-model="user.first_name" label="* First name" :rules="[rules.required, rules.name]" counter></v-text-field>
                                    </v-flex>
                                    <v-flex>
                                        <v-text-field style="margin-left: 5px;" v-if="!isViewMode" clearable v-model="user.last_name" label="* Last name" :rules="[rules.required, rules.name]" counter></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="primary">location_city</v-icon>
                                </v-list-tile-action>
                                <v-text-field
                                    ref="cityField"
                                    v-model="user.city"
                                    label="City"
                                    hint="Type the city"
                                    persistent-hint></v-text-field>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="primary">pin_drop</v-icon>
                                </v-list-tile-action>
                                <v-text-field
                                    ref="addressField"
                                    v-model="place"
                                    label="Address"
                                    hint="Type the address and then hit enter"
                                    persistent-hint
                                    @keyup.enter.native="triggerPlaceChangeEvent(place)"></v-text-field>
                                <v-btn dark outline color="primary" style="margin-top: 0px;" @click="triggerPlaceChangeEvent(place)">Find address</v-btn>
                            </v-list-tile>
                        </v-list>
                        <v-layout row>
                            <v-flex offset-sm1 mr-4>
                                <gmap-map :center="center" :zoom="18" :options="mapOptions"
                                          style="width:100%;  height: 230px;">
                                    <gmap-marker v-for="(m, index) in markers" :key="index" :position="m.position" :clickable="false"
                                                 :draggable="false" @click="center=m.position"/>
                                </gmap-map>
                            </v-flex>
                        </v-layout>
                        <br/>
                        <v-list three-line>
                            <v-list-tile @click="">
                                <v-list-tile-action>
                                    <v-icon color="primary">description</v-icon>
                                </v-list-tile-action>
                                <v-textarea
                                    v-if="!isViewMode"
                                    v-model="user.description"
                                    counter
                                    label="Description"
                                    rows="2" row-height="30px"
                                    no-resize></v-textarea>
                            </v-list-tile>
                        </v-list>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import { dates, filters } from '@/utils/mixins';
import { UsersApi, FacilitiesApi } from '@/api';
import { SET_SNACKBAR_STATUS } from '@/store/mutation-types';

export default {
    components: {},
    mixins: [dates, filters],
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
            isViewMode: false,
            user: {},
            repeatPassword: null,
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
                city: value => (value && value.length > 2 && value.length < 250) || 'City must be between 5 and 50 characters',
                address: value => (value && value.length > 5 && value.length < 250) || 'Address must be between 5 and 50 characters',
                name: value => (value && value.length >= 3 && value.length <= 20) || 'Field must be between 3 and 20 characters',
                phone: value => ((value && value.length === 10) || (!value)) || 'Phone must have 10 characters',
                email: value => (value && /.+@.+/.test(value)) || 'E-mail must be valid',
                password: value => (value && value.length >= 6 && value.length <= 20) || 'Password must be between 6 and 20 characters',
                repeatPassword: value => (value && value === this.user.password) || 'Passwords must match!',
            },
            organizationFacilities: [],
            roleOptions: [
                {
                    text: 'Coordinator',
                    value: 'coordinator',
                },
                {
                    text: 'Case Manager',
                    value: 'case_manager',
                },
                {
                    text: 'Facility Manager',
                    value: 'facility_manager',
                },
                {
                    text: 'Network Manager',
                    value: 'network_manager',
                },
                {
                    text: 'Volunteer',
                    value: 'volunteer',
                },
            ],
        };
    },
    async created() {
        if (this.id != null) {
            this.loadUser();
        }
        this.isLoaded = true;
        this.loadOrganizationFacilities();
    },
    methods: {
        facilityTemplate(item) {
            return `[${item.id}] ${item.name}`;
        },
        validate() {
            if (this.$refs.userForm.validate()) {
                this.save();
            }
        },
        reset() {
            this.$refs.userForm.reset();
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
        async loadOrganizationFacilities() {
            const { data: facilities } = await FacilitiesApi.all();
            this.organizationFacilities = facilities;
            this.isLoaded = true;
        },
        async loadUser() {
            const { data: user } = await UsersApi.getUser(this.id);
            this.user = user;
            this.place = this.user.address;
            this.geolocate();
        },
        async save() {
            if (this.user.role === 'volunteer') {
                this.user.facility = null;
            }
            this.user.organization = this.$store.state.organizationId;
            try {
                if (this.id) {
                    const { data: userObject } = await UsersApi.updateUser(this.user);
                    this.$store.commit(SET_SNACKBAR_STATUS, { message: 'User updated successfully!', color: 'primary' });
                    this.$router.push({ name: 'user', params: { id: String(this.id) } });
                } else {
                    const { data: userObject } = await UsersApi.createUser(this.user);
                    this.$store.commit(SET_SNACKBAR_STATUS, { message: 'User created successfully!', color: 'primary' });
                    this.$router.push({ name: 'user', params: { id: String(userObject.id) } });
                }
            } catch (e) {
                console.log(e);
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
        presentView() {
            this.$router.push({ name: 'user', params: { id: String(this.id) } });
        },
        presentListView() {
            this.$router.push({ name: 'users' });
        },
    },
};
</script>

<style lang="scss">
.user {
}
</style>
