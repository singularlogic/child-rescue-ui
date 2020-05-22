<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout v-if="isLoaded" row class="user">
        <v-flex xs12>
            <v-card>
                <v-toolbar color="white" flat>
                    <v-icon>edit</v-icon>
                    <div class="mx-2">
                        <div class="title">{{ $t('user.edit_user') }}</div>
                        <div class="caption grey--text">{{ $t('user.required_fields') }}</div>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn v-if="id" @click="presentView()" color="" dark>
                        <span>{{ $t('user.cancel') }}</span>
                    </v-btn>
                    <v-btn v-else @click="presentListView()" color="" dark>
                        <span>{{ $t('user.cancel') }}</span>
                    </v-btn>
                    <v-btn @click="validate()" color="primary" dark>
                        <span v-if="id">{{ $t('user.update') }}</span>
                        <span v-else>{{ $t('user.save') }}</span>
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
                                                  :label="$t('user.star_role')" item-text="text" item-value="value" :hint="$t('user.select_role')"
                                                  style="margin-right:5px;">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs12 sm6 v-if="user.role!=='facility_manager'">
                                        <v-select :items="organizationFacilities" v-model="user.facility" :rules="[rules.required]"
                                                  :label="$t('user.star_facility')" :item-text="facilityTemplate" item-value="id" :hint="$t('user.facility_hint')"
                                                  style="margin-left:5px;">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs12 sm6 v-else>
                                        <v-select :items="organizationHostingFacilities" v-model="user.facility" :rules="[rules.required]"
                                                  :label="$t('user.star_facility')" :item-text="facilityTemplate" item-value="id" :hint="$t('user.hosting_facility_hint')"
                                                  style="margin-left:5px;">
                                        </v-select>
                                    </v-flex>
                                </v-layout>
                                <v-layout v-else>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-select :items="roleOptions" v-model="user.role" :rules="[rules.required]"
                                                  :label="$t('user.star_role')" item-text="text" item-value="value" :hint="$t('user.role_hint')"
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
                                        <v-text-field style="margin-right: 5px;" v-if="!isViewMode" clearable v-model="user.email" :label="$t('user.star_email')" :rules="[rules.required, rules.email]"></v-text-field>
                                    </v-flex>
                                    <v-flex>
                                        <v-text-field style="margin-left: 5px;" v-if="!isViewMode" clearable v-model="user.phone" mask="phone" placeholder="(XXX) XXX XXXX" :label="$t('user.phone')" :rules="[rules.phone]"></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile>
                            <v-list-tile v-if="!id">
                                <v-list-tile-action>
                                    <v-icon color="primary">lock</v-icon>
                                </v-list-tile-action>
                                <v-layout>
                                    <v-flex xs12 sm6 md6 lg6 xl6>
                                        <v-text-field style="margin-right: 5px;" type="password" v-if="!isViewMode" clearable v-model="user.password" :label="$t('user.star_password')" :rules="[rules.required, rules.password]" counter></v-text-field>
                                    </v-flex>
                                    <v-flex>
                                        <v-text-field style="margin-left: 5px;" type="password" v-if="!isViewMode" clearable v-model="repeatPassword" :label="$t('user.star_repeat_password')" :rules="[rules.required, rules.repeatPassword]"></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="primary">account_circle</v-icon>
                                </v-list-tile-action>
                                <v-layout>
                                    <v-flex xs12 sm6 md6 lg6 xl6>
                                        <v-text-field style="margin-right: 5px;" v-if="!isViewMode" clearable v-model="user.first_name" :label="$t('user.star_first_name')" :rules="[rules.required, rules.name]" counter></v-text-field>
                                    </v-flex>
                                    <v-flex>
                                        <v-text-field style="margin-left: 5px;" v-if="!isViewMode" clearable v-model="user.last_name" :label="$t('user.star_last_name')" :rules="[rules.required, rules.name]" counter></v-text-field>
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
                                    :label="$t('user.city')"
                                    :hint="$t('user.city_hint')"
                                    persistent-hint></v-text-field>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="primary">pin_drop</v-icon>
                                </v-list-tile-action>
                                <v-text-field
                                    ref="addressField"
                                    v-model="place"
                                    :label="$t('user.address')"
                                    :hint="$t('userr.address_hint')"
                                    persistent-hint
                                    @keyup.enter.native="triggerPlaceChangeEvent(place)"></v-text-field>
                                <v-btn dark outline color="primary" style="margin-top: 0px;" @click="triggerPlaceChangeEvent(place)">{{ $t('user.find_address') }}</v-btn>
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
                                    :label="$t('user.description')"
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
                // disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: true,
                streetViewControl: true,
            },
            place: null,
            rules: {
                required: value => !!value || this.$t('user.rules_required'),
                city: value => (value && value.length > 5 && value.length < 50) || this.$t('user.rules_city'),
                address: value => (value && value.length > 5 && value.length < 120) || this.$t('user.rules_address'),
                name: value => (value && value.length >= 3 && value.length <= 50) || this.$t('user.rules_name'),
                phone: value => ((value && value.length === 10) || (!value)) || this.$t('user.rules_phone'),
                email: value => (value && /.+@.+/.test(value)) || this.$t('user.rules_email'),
                password: value => (value && value.length >= 6 && value.length <= 20) || this.$t('user.rules_password'),
                repeatPassword: value => (value && value === this.user.password) || this.$t('user.rules_repeat_password'),
            },
            organizationFacilities: [],
            organizationHostingFacilities: [],
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
            await this.loadUser();
        }
        await this.loadOrganizationFacilities();
        await this.loadOrganizationHostingFacilities();
        this.isLoaded = true;
    },
    methods: {
        facilityTemplate(item) {
            return `[${item.id}] ${item.name}`;
        },
        async validate() {
            if (this.$refs.userForm.validate()) {
                await this.save();
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
        },
        async loadOrganizationHostingFacilities() {
            const { data: facilities } = await FacilitiesApi.all({ is_hosting: true });
            this.organizationHostingFacilities = facilities;
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
                    this.$store.commit(SET_SNACKBAR_STATUS, { message: this.$t('user.update_success'), color: 'primary' });
                    this.$router.push({ name: 'user', params: { id: String(this.id) } });
                } else {
                    const { data: userObject } = await UsersApi.createUser(this.user);
                    this.$store.commit(SET_SNACKBAR_STATUS, { message: this.$t('user.create_success'), color: 'primary' });
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
