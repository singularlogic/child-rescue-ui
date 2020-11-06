<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-dialog v-model="dialogPlace" persistent max-width="700px" @keydown.esc="cancel()">
        <template v-slot:activator="{ on }">
            <v-btn dark color="primary" v-on="on" @click="setUp()">
                {{ $t('place.add_place') }}
            </v-btn>
        </template>
        <v-card>
            <v-toolbar flat>
                <v-toolbar-title>
                    <span v-if="isEditMode">{{ $t('place.update_alert') }}</span>
                    <span v-else-if="isViewMode">{{ $t('place.alert') }}: {{ alertObject.id }}</span>
                    <span v-else>{{ $t('place.provide_alert') }}</span>
                    <span>&nbsp;</span>
                    <v-icon color="black">forward</v-icon>
                    <span @click="goToCase()" style="color: grey;"><b> {{ fullName }}</b></span>
                </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-layout v-if="!isViewMode && !isEditMode" row wrap>
                                <v-flex xs12 sm10 class="mb-2 ml-2">
                                    <v-text-field
                                        ref="addressField"
                                        v-model="place"
                                        :label="$t('place.address')"
                                        :hint="$t('place.address_hint')"
                                        persistent-hint
                                        prepend-icon="pin_drop"
                                        :rules="[rules.address, rules.required]"
                                        @change="validateForm()"
                                        @keyup.enter.native="triggerPlaceChangeEvent(place)"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm1 class="mt-2">
                                    <v-btn dark color="primary" @click="triggerPlaceChangeEvent(place)">{{ $t('place.find_address') }}</v-btn>
                                </v-flex>
                                <v-flex xs12>
                                    <gmap-map :center="center" :zoom="18" :options="mapOptions" style="height: 330px;">
                                        <gmap-circle v-for="(m) in markers" :key="m.id" :radius="m.radius" :center="m.position" :clickable="false" :draggable="false"
                                                     :options="{fillColor:'red', fillOpacity:0.1, strokeWidth:1, strokeColor:'red', strokePattern: 'gap' }"/>
                                    </gmap-map>
                                </v-flex>
                            </v-layout>
                            <v-layout v-else row wrap>
                                <v-flex xs12 class="mb-2 mx-2">
                                    <v-text-field
                                        ref="addressField"
                                        v-model="place"
                                        :class="{'disable-events': isViewMode || isEditMode }"
                                        :label="$t('place.address')"
                                        :hint="$t('place.address_hint')"
                                        persistent-hint
                                        prepend-icon="pin_drop"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <gmap-map :center="center" :zoom="18" :options="mapOptions" style="height: 330px;">
                                        <gmap-circle v-for="(m) in markers" :key="m.id" :radius="m.radius" :center="m.position" :clickable="false" :draggable="false"
                                                     :options="{fillColor:'red', fillOpacity:0.1, strokeWidth:1, strokeColor:'red', strokePattern: 'gap' }"/>
                                    </gmap-map>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 style="margin-top: 10px;">
                            <v-layout wrap>
                                <v-flex xs12 sm12 md6>
                                    <v-text-field v-model="alertObject.radius" suffix="km"
                                                  :label="$t('place.radius')" :placeholder="$t('place.radius_placeholder')"
                                                  style="padding: 5px;"
                                                  prepend-icon="360" @change="validateForm();" @input="loadSearchField(alertObject)"
                                                  :class="{'disable-events': isViewMode || isEditMode }"
                                                  :rules="[rules.required]"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md6>
                                    <v-text-field v-model.number="alertDuration" type="number" suffix="H"
                                                  max="240" min="1"
                                                  :label="$t('place.duration')" :placeholder="$t('place.duration_placeholder')"
                                                  style="padding: 5px;"
                                                  :class="{'disable-events': isViewMode || isEditMode }"
                                                  prepend-icon="access_time" @change="validateForm()"
                                                  :rules="[rules.duration, rules.required]"></v-text-field>
                                </v-flex>
                                <v-flex xs12 class="mx-2">
                                    <v-textarea name="input-7-1" v-model="alertObject.description" box
                                                :label="$t('place.alert_message')"
                                                ref="alertObjectDescription"
                                                :placeholder="$t('place.alert_message_placeholder')" auto-grow
                                                rows="4"
                                                :class="{'disable-events': isViewMode || isEditMode }"
                                                :rules="[rules.required]" @change="validateForm()">
                                    </v-textarea>
                                </v-flex>
                                <v-flex xs12 class="mx-2" style="margin-top: -20px;">
                                    <v-checkbox
                                        v-model="checkbox"
                                        :rules="[v => !!v || $t('place.agree')]"
                                        :label="$t('place.alert_message')"
                                        required
                                    ></v-checkbox>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
            <v-card-actions style="margin-top: -50px;" class="mx-2">
                <v-spacer></v-spacer>
                <v-btn color="gray darken-1" flat @click="cancel()">{{ $t('place.close') }}</v-btn>
                <v-btn v-if="!isViewMode && !isEditMode" :disabled="!valid" color="blue darken-1" flat @click="save()">
                    <span>{{ $t('place.save') }}</span>
                </v-btn>
                <deactivate-alert v-if="isEditMode" :alert-id="alertObject.id"></deactivate-alert>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import moment from 'moment';
import { bus } from '../main';
import { AlertsApi } from '@/api';
import DeactivateAlert from './DeactivateAlert.vue';

export default {
    components: {
        'deactivate-alert': DeactivateAlert,
    },
    props: {
        caseId: { type: [String, Number], default: null },
        caseAlertMessage: { type: String, default: null },
        fullName: { type: String, default: null },
    },
    data() {
        return {
            center: {
                lat: 45.508,
                lng: -73.587,
            },
            valid: true,
            checkbox: false,
            markers: [],
            places: [],
            currentPlace: null,
            mapOptions: {
                // disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: true,
                streetViewControl: true,
            },
            isViewMode: false,
            isEditMode: false,
            alertObject: {},
            isFormValid: false,
            alertDuration: null,
            place: null,
            dialogPlace: false,
            rules: {
                required: value => !!value || this.$t('place.rules_required'),
                address: value => value && value.length > 5 && value.length < 250 || this.$t('place.rules_address'),
                duration: value => value && value > 0 && value < 241 || this.$t('place.rules_duration'),
            },
        };
    },
    created() {
        bus.$off('close-alert-dialog-event');
        bus.$on('close-alert-dialog-event', () => {
            this.cancel();
        });

        bus.$off('view-alert-dialog-event');
        bus.$on('view-alert-dialog-event', (alertObject) => {
            if (this.caseId === null) {
                this.caseId = alertObject.case;
                this.fullName = alertObject.fullname;
            }
            this.isViewMode = true;
            this.isFormValid = true;
            this.alertObject = alertObject;
            this.place = this.alertObject.address;
            this.alertDuration = moment(this.alertObject.end)
                .diff(moment(this.alertObject.start));
            const hours = moment.duration(this.alertDuration)
                .hours();
            const days = moment.duration(this.alertDuration)
                .days();
            this.alertDuration = 24 * days + hours;

            this.loadSearchField(this.alertObject);
            this.dialogAlert = true;
        });

        bus.$off('edit-alert-dialog-event');
        bus.$on('edit-alert-dialog-event', (alertObject) => {
            this.isEditMode = true;
            this.isFormValid = true;
            this.alertObject = alertObject;
            this.place = this.alertObject.address;
            this.alertDuration = moment(this.alertObject.end)
                .diff(moment(this.alertObject.start));
            const hours = moment.duration(this.alertDuration)
                .hours();
            const days = moment.duration(this.alertDuration)
                .days();
            this.alertDuration = 24 * days + hours;

            this.loadSearchField(this.alertObject);
            this.dialogAlert = true;
        });
    },
    methods: {
        goToCase() {
            if (this.$store.state.role === 'facility_manager') {
                this.$router.push({
                    name: 'manage_facility_child',
                    params: { id: this.caseId },
                });
            } else {
                this.$router.push({ name: 'info', params: { id: this.caseId } });
            }
        },
        setPlace(place) {
            this.markers = [];
            this.currentPlace = place;
            this.alertObject.address = this.currentPlace.formatted_address;
            this.alertObject.latitude = this.currentPlace.geometry.location.lat();
            this.alertObject.longitude = this.currentPlace.geometry.location.lng();
            this.addMarker();
        },
        addMarker() {
            if (this.currentPlace) {
                const position = {
                    lat: this.currentPlace.geometry.location.lat(),
                    lng: this.currentPlace.geometry.location.lng(),
                };
                const radius = this.alertObject.radius * 1000;
                this.markers.push({ instance: this.alertObject, position, radius });
                this.places.push(this.currentPlace);
                this.center = position;
                this.currentPlace = null;
            }
        },
        loadSearchField(alertObject) {
            this.markers = [];
            const position = {
                lat: alertObject.latitude,
                lng: alertObject.longitude,
            };
            const radius = this.alertObject.radius * 1000;
            this.markers.push({ instance: this.alertObject, position, radius });
            this.center = position;
            this.currentPlace = null;
        },
        setUp() {
            this.alertObject.description = this.caseAlertMessage;
        },
        validateForm() {
            this.isFormValid = !!(this.alertObject.address && this.alertObject.latitude && this.alertObject.longitude
                && this.alertObject.radius && this.alertDuration && this.alertObject.description);
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
                    this.validateForm();
                });
            }
        },
        save() {
            this.dialogAlert = false;
            this.alertObject.case = this.caseId;
            if (this.alertObject.id && this.alertObject.id !== null) {
                this.updateAlert();
            } else {
                this.createAlert();
            }
        },
        cancel() {
            this.clearForm();
        },
        clearForm() {
            this.dialogAlert = false;
            this.isEditMode = false;
            this.isViewMode = false;
            this.alertObject = {};
            this.isFormValid = false;
            this.place = null;
            this.$refs.form.reset();
        },
        async createAlert() {
            this.alertObject.is_active = true;
            this.alertObject.start = moment()
                .toISOString();
            this.alertObject.end = moment(this.alertObject.start)
                .add(this.alertDuration, 'hours')
                .toISOString();
            const { data: alertObject } = await AlertsApi.create(this.alertObject);
            this.clearForm();
            bus.$emit('reload-alerts-event');
            this.$router.push({ name: 'alerts' });
        },
        async updateAlert() {
            this.alertObject.is_active = true;
            this.alertObject.start = moment(this.alertObject.start)
                .toISOString();
            this.alertObject.end = moment(this.alertObject.start)
                .add(this.alertDuration, 'hours')
                .toISOString();
            const { data: alertObject } = await AlertsApi.edit(this.alertObject);
            this.clearForm();
            bus.$emit('reload-alerts-event');
            this.$router.push({ name: 'alerts' });
        },
    },
};
</script>
