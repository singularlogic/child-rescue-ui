<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-dialog v-model="dialogAlert" persistent max-width="900px" @keydown.esc="cancel()">
        <template v-slot:activator="{ on }">
            <v-btn flat dark color="primary" v-on="on" @click="setUp()">
                {{ $t('alert.create_alert') }}
                <v-icon right>add_alert</v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-toolbar flat>
                <v-toolbar-title>
                    <span v-if="isEditMode">{{ $t('alert.update_alert') }}</span>
                    <span v-else-if="isViewMode">{{ $t('alert.alert') }} [{{ alertObject.id }}]</span>
                    <span v-else>{{ $t('alert.provide_alert') }}</span>
                    <span>&nbsp;</span>
                    <v-icon color="black">forward</v-icon>
                    <span @click="goToCase()" style="color: grey;"><b> {{ fullName || ' - ' | title }} &nbsp;&nbsp;</b></span>
                </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-form ref="form" v-model="isFormValid" lazy-validation>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-layout v-if="!isViewMode && !isEditMode" row wrap>
                                <v-flex xs12 sm10 class="mb-2 ml-1">
                                    <v-text-field
                                        ref="addressField"
                                        v-model="place"
                                        :label="$t('alert.address')"
                                        :hint="$t('alert.address_hint')"
                                        persistent-hint
                                        prepend-icon="pin_drop"
                                        :rules="[rules.address, rules.required]"
                                        @change="validateForm()"
                                        @keyup.enter.native="triggerPlaceChangeEvent(place)"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm1 class="mt-2">
                                    <v-btn color="primary" style="margin-top: 4px;" @click="triggerPlaceChangeEvent(place)">{{ $t('alert.find_address') }}</v-btn>
                                </v-flex>
                                <v-flex xs12 class="mx-2 my-2">
                                    <gmap-map :center="center" :zoom="18" :options="mapOptions"
                                              style="height: 330px;">
                                        <gmap-circle v-for="(m) in markers" :key="m.id" :radius="m.radius" :center="m.position" :clickable="false" :draggable="false"
                                                     :options="{fillColor:'red', fillOpacity:0.1, strokeWidth:1, strokeColor:'red', strokePattern: 'gap' }"/>
                                    </gmap-map>
                                </v-flex>
                            </v-layout>
                            <v-layout v-else row wrap>
                                <v-flex xs12>
                                    <v-text-field
                                        ref="addressField"
                                        v-model="place"
                                        :label="$t('alert.address')"
                                        :class="{'disable-events': isViewMode || isEditMode }"
                                        :hint="$t('alert.address_hint')"
                                        persistent-hint
                                        prepend-icon="pin_drop"></v-text-field>
                                </v-flex>
                                <v-flex xs12 class="mx-2 my-2">
                                    <gmap-map :center="center" :zoom="18" :options="mapOptions"
                                              style="height: 330px;">
                                        <gmap-circle v-for="(m) in markers" :key="m.id" :radius="m.radius" :center="m.position" :clickable="false" :draggable="false"
                                                     :options="{fillColor:'red', fillOpacity:0.1, strokeWidth:1, strokeColor:'red', strokePattern: 'gap' }"/>
                                    </gmap-map>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout wrap>
                                <v-flex xs12 sm12 md6>
                                    <v-text-field v-model="alertObject.radius" suffix="km"
                                                  :label="$t('alert.radius')" :placeholder="$t('alert.radius_placeholder')"
                                                  style="padding: 5px;"
                                                  prepend-icon="360" @change="validateForm();" @input="loadSearchField(alertObject)"
                                                  :class="{'disable-events': isViewMode || isEditMode }"
                                                  :rules="[rules.required]"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md6>
                                    <v-text-field v-model.number="alertDuration" type="number" suffix="H"
                                                  min="1"
                                                  :label="$t('alert.duration')" :placeholder="$t('alert.duration_placeholder')"
                                                  style="padding: 5px;"
                                                  :class="{'disable-events': isViewMode || isEditMode }"
                                                  prepend-icon="access_time" @change="validateForm()"
                                                  :rules="[rules.duration, rules.required]"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-textarea name="input-7-1" v-model="alertObject.description" box
                                                :label="$t('alert.alert_message')"
                                                ref="alert-object-description"
                                                :placeholder="$t('alert.alert_message_placeholder')" auto-grow
                                                rows="4"
                                                :class="{'disable-events': isViewMode || isEditMode }"
                                                :rules="[rules.required]" @change="validateForm()">
                                    </v-textarea>
                                </v-flex>
                                <v-flex v-if="!isViewMode && !isEditMode" xs12 style="margin-top: 0px;">
                                    <v-checkbox
                                        v-model="checkbox"
                                        :rules="[v => !!v || this.$t('alert.agree')]"
                                        :label="$t('alert.disclaimer')"
                                        required
                                    ></v-checkbox>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat @click="cancel()">{{ $t('alert.close') }}</v-btn>
                <v-btn v-if="!isViewMode && !isEditMode" :disabled="!isFormValid" color="primary" flat @click="validate();">
                    <span>{{ $t('alert.preview') }}</span>
                </v-btn>
                <deactivate-alert v-if="isEditMode" :alert-id="alertObject.id"></deactivate-alert>
            </v-card-actions>
        </v-card>
        <v-dialog v-model="previewAlert" max-width="850px">
            <v-card>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <span>{{ caseObject.custom_name }}</span>
                        <v-spacer></v-spacer>
                        <div style="font-size: 14px;">Missing from: {{ caseObject.disappearance_date | formatDateTime }}</div>
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs5>
                            <v-img :src="getImagePath(caseObject.profile_photo)" height="343px"></v-img>
                        </v-flex>
                        <v-flex xs7>
                            <v-list dense subheader three-line class="ml-3">
                                <v-list-tile>
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ $t('case.eye_color') }}</v-list-tile-title>
                                        <v-list-tile-sub-title>{{ caseObject.eye_color || '-' }}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ $t('case.hair_color') }}</v-list-tile-title>
                                        <v-list-tile-sub-title>{{ caseObject.hair_color || '-'  }}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ $t('case.haircut') }}</v-list-tile-title>
                                        <v-list-tile-sub-title>{{ caseObject.haircut || '-'  }}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-list-tile>
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ $t('case.height') }}</v-list-tile-title>
                                        <v-list-tile-sub-title>{{ caseObject.height || '-'  }}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ $t('case.weight') }}</v-list-tile-title>
                                        <v-list-tile-sub-title>{{ caseObject.weight || '-'  }}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ $t('case.stature') }}</v-list-tile-title>
                                        <v-list-tile-sub-title>{{ caseObject.stature || '-'  }}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ $t('case.body_type') }}</v-list-tile-title>
                                        <v-list-tile-sub-title>{{ caseObject.body_type || '-'  }}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </v-list>
                            <br/>
                            <v-textarea name="input-7-1" v-model="alertObject.description" box
                                :label="$t('alert.alert_message')" class="ml-3"
                                :placeholder="$t('alert.alert_message_placeholder')" readonly
                                rows="7">
                            </v-textarea>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="previewAlert=false;">{{ $t('alert.close') }}</v-btn>
                    <v-btn v-if="!isViewMode && !isEditMode" :disabled="!isFormValid" color="blue lighten-2" flat @click="save(true)">
                        <span>{{ $t('alert.send_to_volunteers') }}</span>
                    </v-btn>
                    <v-btn v-if="!isViewMode && !isEditMode" :disabled="!isFormValid" color="blue darken-2" flat @click="save()">
                        <span>{{ $t('alert.send') }}</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-dialog>
</template>

<script>
import moment from 'moment';
import { bus } from '../main';
import { CasesApi, AlertsApi } from '@/api';
import DeactivateAlert from './DeactivateAlert.vue';
import { dates, filters, fonts } from '@/utils/mixins';

export default {
    components: {
        'deactivate-alert': DeactivateAlert,
    },
    mixins: [dates, filters, fonts],
    props: {
        caseId: { type: [String, Number], default: null },
        caseAlertMessage: { type: String, default: null },
        fullName: { type: String, default: null },
    },
    data() {
        return {
            caseObject: {},
            center: {
                lat: 45.508,
                lng: -73.587,
            },
            previewAlert: false,
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
            dialogAlert: false,
            rules: {
                required: value => !!value || this.$t('alert.rules_required'),
                address: value => value && value.length > 5 && value.length < 250 || this.$t('alert.rules_address'),
                duration: value => value && value > 0 || this.$t('alert.rules_duration'),
            },
        };
    },
    created() {
        // this.$nextTick(() => {
        //     this.$nextTick(() => {
        //         // this.$refs.nameField.focus();
        //         this.isFormValid = false;
        //     });
        // });
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
            this.isFormValid = false;
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
        bus.$off('copy-alert-dialog-event');
        bus.$on('copy-alert-dialog-event', (alertObject) => {
            this.isEditMode = false;
            this.isFormValid = true;
            this.alertObject = alertObject;
            this.place = this.alertObject.address;
            this.triggerPlaceChangeEvent(this.place);
            this.alertDuration = moment(this.alertObject.end)
                .diff(moment(this.alertObject.start));
            const hours = moment.duration(this.alertDuration)
                .hours();
            const days = moment.duration(this.alertDuration)
                .days();
            this.alertDuration = 24 * days + hours;

            this.loadSearchField(this.alertObject);
            this.alertObject.id = null;
            this.dialogAlert = true;
        });
    },
    methods: {
        validate() {
            if (this.$refs.form.validate()) {
                this.openPreview();
            }
        },
        getImagePath(path) {
            if (path === null) {
                return require('../assets/images/default_photo.png');
            }
            return path;
        },
        async openPreview() {
            await this.getCase();
            this.previewAlert = true;
        },
        async getCase() {
            const { data: caseObject } = await CasesApi.get(this.caseId);
            this.caseObject = caseObject;
        },
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
                && this.alertObject.radius && this.alertDuration && this.alertObject.description && this.checkbox );
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
        save(volunteersOnly=false) {
            this.dialogAlert = false;
            this.alertObject.volunteersOnly = volunteersOnly;
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
