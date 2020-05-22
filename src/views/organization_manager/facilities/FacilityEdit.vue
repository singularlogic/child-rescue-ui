<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout v-if="isLoaded" row>
        <v-flex xs12>
            <v-card>
                <v-toolbar color="white" flat>
                    <v-icon>edit</v-icon>
                    <div class="mx-2">
                        <div class="title">{{ $t('facility.edit_facility') }}</div>
                        <div class="caption grey--text">{{ $t('facility.required_fields') }}</div>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn v-if="id" @click="presentView()" color="" dark>
                        <span>{{ $t('facility.cancel') }}</span>
                    </v-btn>
                    <v-btn v-else @click="presentListView()" color="" dark>
                        <span>{{ $t('facility.cancel') }}</span>
                    </v-btn>
                    <v-btn @click="validate()" color="primary" dark>
                        <span v-if="id">{{ $t('facility.update') }}</span>
                        <span v-else>{{ $t('facility.save') }}</span>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-form ref="facilityForm" v-model="valid" lazy-validation @submit.prevent>
                        <v-list two-line>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="primary">business</v-icon>
                                </v-list-tile-action>
                                <v-layout>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-text-field
                                            style="margin-right: 5px;"
                                            v-if="!isViewMode"
                                            clearable
                                            v-model="facility.name"
                                            :label="$t('facility.star_name')"
                                            :rules="[rules.required, rules.name]"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="primary">info</v-icon>
                                </v-list-tile-action>
                                <v-layout v-if="facility.supports_hosting">
                                    <v-flex xs12 sm6 md6 lg6 xl6>
                                        <v-select :items="isHostingOptions" v-model="facility.supports_hosting" :rules="[rules.required]"
                                                  :label="$t('facility.star_is_hosting')" item-text="text" item-value="value" :hint="$t('facility.is_hosting_hint')"
                                                  style="margin-right:5px;">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6 lg6 xl6>
                                        <v-text-field
                                            style="margin-left: 5px;"
                                            v-if="!isViewMode"
                                            type="number"
                                            v-model="facility.capacity"
                                            :label="$t('facility.star_capacity')"
                                            :rules="[rules.required, rules.capacity]"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout v-else>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-select :items="isHostingOptions" v-model="facility.supports_hosting" :rules="[rules.required]"
                                                  :label="$t('facility.star_is_hosting')" item-text="text" item-value="value" :hint="$t('facility.is_hosting_hint')"
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
                                        <v-text-field
                                            style="margin-right: 5px;"
                                            v-if="!isViewMode"
                                            clearable
                                            v-model="facility.email"
                                            :label="$t('facility.email')"
                                            :rules="[rules.email]"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex>
                                        <v-text-field
                                            style="margin-left: 5px;"
                                            v-if="!isViewMode"
                                            clearable
                                            v-model="facility.phone"
                                            mask="phone"
                                            placeholder="(XXX) XXX XXXX"
                                            :label="$t('facility.phone')"
                                            :rules="[rules.phone]"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="primary">pin_drop</v-icon>
                                </v-list-tile-action>
                                <v-text-field
                                    ref="addressField"
                                    v-model="place"
                                    :label="$t('facility.address')"
                                    :hint="$t('facility.address_hint')"
                                    persistent-hint
                                    @keyup.enter.native="triggerPlaceChangeEvent(place)"
                                ></v-text-field>
                                <v-btn
                                    dark
                                    outline
                                    color="primary" style="margin-top: 0px;"
                                    @click="triggerPlaceChangeEvent(place)"
                                >{{ $t('facility.find_address') }}</v-btn>
                            </v-list-tile>
                        </v-list>
                        <v-layout row>
                            <v-flex offset-sm1 mr-4>
                                <gmap-map
                                    :center="center"
                                    :zoom="18"
                                    :options="mapOptions"
                                    style="width:100%;  height: 230px;"
                                >
                                    <gmap-marker
                                        v-for="(m, index) in markers"
                                        :key="index"
                                        :position="m.position"
                                        :clickable="false"
                                        :draggable="false"
                                        @click="center=m.position"
                                    />
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
import { dates, filters } from '@/utils/mixins';
import { FacilitiesApi } from '@/api';
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
            facility: {},
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
                required: value => (!!value || value === false) || this.$t('facility.rules_required'),
                address: value => (value && value.length > 5 && value.length < 250) || this.$t('facility.address_rules'),
                name: value => (value && value.length >= 3 && value.length <= 20) || this.$t('facility.rules_name'),
                capacity: value => (value && value > 0 && value <= 1000) || this.$t('facility.rules_capacity'),
                phone: value => ((value && value.length === 10) || !value) || this.$t('facility.rules_phone'),
                email: value => ((value && /.+@.+/.test(value)) || !value) || this.$t('facility.rules_email'),
            },
            isHostingOptions: [
                {
                    text: 'True',
                    value: true,
                },
                {
                    text: 'False',
                    value: false,
                },
            ],
        };
    },
    async created() {
        if (this.id != null) {
            this.loadFacility();
        }
        this.isLoaded = true;
    },
    methods: {
        validate() {
            if (this.$refs.facilityForm.validate()) {
                this.save();
            }
        },
        reset() {
            this.$refs.facilityForm.reset();
        },
        setPlace(place) {
            this.markers = [];
            this.currentPlace = place;
            this.facility.address = this.currentPlace.formatted_address;
            this.facility.latitude = this.currentPlace.geometry.location.lat();
            this.facility.longitude = this.currentPlace.geometry.location.lng();
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
                // eslint-disable-next-line no-undef
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
        async loadFacility() {
            try {
                const { data: facility } = await FacilitiesApi.get(this.id);
                this.facility = facility;
                this.place = this.facility.address;
                this.geolocate();
            } catch (e) {
                console.log(e);
                this.$router.push({ name: 'facilities' });
            }
        },
        async save() {
            try {
                this.facility.organization = this.$store.state.organizationId;
                if (this.id) {
                    const { data: facilityObject } = await FacilitiesApi.update(this.facility);
                    this.$store.commit(SET_SNACKBAR_STATUS, { message: this.$t('facility.update_success'), color: 'primary' });
                    this.$router.push({ name: 'facility', params: { id: String(facilityObject.id) } });
                } else {
                    const { data: facilityObject } = await FacilitiesApi.create(this.facility);
                    this.$store.commit(SET_SNACKBAR_STATUS, { message: this.$t('facility.create_success'), color: 'primary' });
                    this.$router.push({ name: 'facility', params: { id: String(facilityObject.id) } });
                }
            } catch (e) {
                console.log(e);
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
        presentView() {
            this.$router.push({ name: 'facility', params: { id: String(this.id) } });
        },
        presentListView() {
            this.$router.push({ name: 'facilities' });
        },
    },
};
</script>

<style lang="scss">
</style>
