<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-dialog v-model="dialogFeedback" persistent max-width="900px" scrollable @keydown.esc="cancel()">
        <template v-slot:activator="{ on }">
            <v-btn dark color="red" v-on="on">
                Missing
            </v-btn>
        </template>
        <v-card>
            <v-card-title primary-title>
                <div>
                    <div v-if="isEditMode" class="headline">Update Fact</div>
                    <div v-else-if="isViewMode" class="headline">Fact: {{ feedbackObject.id }}</div>
                    <div v-else class="headline">Missing Report</div>
                    <a @click="goToCase()" style="color: blue;">Case #{{ caseId }} - {{ fullName }}</a>
                </div>
            </v-card-title>
            <v-card-text>
                <v-form ref="form">
                    <v-layout row wrap>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-layout v-if="!isViewMode" row wrap>
                                <v-flex xs12 sm10 md10 lg10 xl10>
                                    <v-text-field
                                        ref="addressField"
                                        v-model="place"
                                        :rules="[rules.address, rules.required]"
                                        label="Address"
                                        hint="Type the address and then hit enter"
                                        persistent-hint
                                        prepend-icon="pin_drop"
                                        class="textField"
                                        @change="validateForm()"
                                        @keyup.enter.native="triggerPlaceChangeEvent(place)"/>
                                </v-flex>
                                <v-flex xs12 sm2 md2 lg2 xl2>
                                    <v-btn dark color="primary" @click="triggerPlaceChangeEvent(place)">Find address</v-btn>
                                </v-flex>
                                <v-flex xs12 sm12 md12 lg12 xl12 style="margin: 0px 10px 0px 10px">
                                    <gmap-map :center="center" :zoom="18" :options="mapOptions"
                                              style="width:100%;  height: 230px; margin-bottom: 5px;">
                                        <gmap-marker v-for="(m, index) in markers" :key="index" :position="m.position" :clickable="false"
                                                     :draggable="false" @click="center=m.position"/>
                                    </gmap-map>
                                </v-flex>
                            </v-layout>
                            <v-layout v-else row wrap>
                                <v-flex xs12 sm12 md12 lg12 xl12>
                                    <v-text-field
                                        ref="addressField"
                                        v-model="place"
                                        :rules="[rules.address, rules.required]"
                                        label="Address"
                                        :class="{'disable-events': isViewMode, textField }"
                                        hint="Type the address and then hit enter"
                                        persistent-hint
                                        prepend-icon="pin_drop"/>
                                </v-flex>
                                <v-flex xs12 sm12 md12 lg12 xl12>
                                    <gmap-map :center="center" :zoom="18" :options="mapOptions"
                                              style="width:100%;  height: 230px; margin-bottom: 5px;">
                                        <gmap-marker v-for="(m, index) in markers" :key="index" :position="m.position" :clickable="true"
                                                     :draggable="false" @click="center=m.position" @dragend="drag"/>
                                    </gmap-map>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12 xl12 style="margin-top: 10px;">
                            <v-layout wrap>
                                <v-flex xs12 sm12 md6 lg6 xl6>
                                    <v-text-field v-model="feedbackObject.latitude" class="header-text-field-input"
                                                  label="Latitude" placeholder="-" disabled style="padding: 5px;"
                                                  prepend-icon="my_location"/>
                                </v-flex>
                                <v-flex xs12 sm12 md6 lg6 xl6>
                                    <v-text-field v-model="feedbackObject.longitude" class="header-text-field-input"
                                                  label="Longitude" placeholder="-" disabled style="padding: 5px;"
                                                  prepend-icon="my_location"/>
                                </v-flex>
                                <v-flex v-if="feedbackObject.feedback_image" xs12 sm12 md12 lg12 xl12>
                                    <v-img :src="feedbackObject.feedback_image" style="padding: 10px; margin-bottom: 15px;"/>
                                </v-flex>
                                <v-flex xs12 sm12 md6 lg6 xl6>
                                    <v-text-field v-model="feedbackObject.source" :class="{'disable-events': isViewMode}"
                                                  :rules="[rules.required]" label="Source" placeholder="source"
                                                  style="padding: 5px;" prepend-icon="user" @change="validateForm()"/>
                                </v-flex>
                                <v-flex xs12 sm12 md6 lg6 xl6>
                                    <v-select :items="feedbackStatuses" v-model="feedbackObject.feedback_status" :class="{'disable-events': isViewMode}"
                                              :rules="[rules.required]" label="Status" style="padding: 5px;"
                                              @change="validateForm()"/>
                                </v-flex>
                                <v-flex xs12 sm12 md6 lg6 xl6>
                                    <date-time-picker v-model="feedbackObject.date" label="Date and time of incident" prepend-icon="access_time"
                                                      :class="{'disable-events': isViewMode}" :rules="[rules.required]" @input="validateForm()"></date-time-picker>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3>
                                    <v-select :items="childStatuses" v-model="feedbackObject.child_status" :class="{'disable-events': isViewMode}"
                                              label="Child status" style="padding: 5px;"/>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3>
                                    <v-select :items="transportationChoices" v-model="feedbackObject.transportation" :class="{'disable-events': isViewMode}"
                                              label="Transportation" style="padding: 5px;"/>
                                </v-flex>
                                <v-flex xs12 sm12 md12 lg12 xl12>
                                    <v-textarea v-model="feedbackObject.comment" name="input-7-1" box label="Comment"
                                                rows="3" :class="{'disable-events': isViewMode}"
                                                placeholder="Describe the situation please..." auto-grow/>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn color="blue darken-1" flat @click="cancel()">Close</v-btn>
                <v-btn v-if="!isViewMode" :disabled="!isFormValid" color="red darken-1" flat @click="save()">Declare missing child</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { bus } from '../main';
import { CasesApi, FeedbacksApi } from '@/api';
import { DateTimePicker } from '@/components';
import { SET_SNACKBAR_STATUS } from '@/store/mutation-types';

export default {
    components: {
        DateTimePicker,
    },
    props: {
        caseId: { type: Number, default: null },
        fullName: { type: String, default: null },
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
                // disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: true,
                streetViewControl: true,
            },
            isViewMode: false,
            isEditMode: false,
            feedbackObject: {},
            isFormValid: false,
            place: null,
            dialogFeedback: false,
            rules: {
                required: value => !!value || 'Field is required',
                address: value => value && value.length > 5 && value.length < 250 || 'Address must be between 5 and 50 characters',
            },
            feedbackStatuses: [
                'pending', 'relevant', 'irrelevant', 'credible',
            ],
            childStatuses: [
                {
                    text: 'OK',
                    value: 'ok',
                },
                {
                    text: 'Appearance change (clothes, haircut, etc)',
                    value: 'appearance_change',
                },
                {
                    text: 'Terrified/Shocked',
                    value: 'shocked',
                },
                {
                    text: 'Injured/Sick/Intoxicated',
                    value: 'injured_sick',
                },
                {
                    text: 'Deceased',
                    value: 'deceased',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
            transportationChoices: [
                {
                    text: 'Foot',
                    value: 'foot',
                },
                {
                    text: 'Bus/Tram',
                    value: 'bus_tram',
                },
                {
                    text: 'Car/Motorcycle',
                    value: 'car_motorcycle',
                },
                {
                    text: 'Train',
                    value: 'train',
                },
                {
                    text: 'Metro/Subway',
                    value: 'metro_subway',
                },
                {
                    text: 'Bicycle/Scooter',
                    value: 'bicycle_scooter',
                },
                {
                    text: 'Ship/Aeroplane',
                    value: 'ship_aeroplane',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
        };
    },
    created() {
        bus.$off('view-feedback-dialog-event');
        bus.$on('view-feedback-dialog-event', (feedbackObject) => {
            if (this.caseId === null) {
                this.caseId = feedbackObject.case;
                this.fullName = feedbackObject.fullname;
            }
            this.isFormValid = true;
            this.feedbackObject = feedbackObject;
            this.isViewMode = true;
            this.place = this.feedbackObject.address;
            this.loadSearchField(this.feedbackObject.latitude, this.feedbackObject.longitude);
            this.dialogFeedback = true;
        });
        bus.$off('edit-feedback-dialog-event');
        bus.$on('edit-feedback-dialog-event', (feedbackObject) => {
            this.isFormValid = true;
            this.feedbackObject = feedbackObject;
            this.isEditMode = true;
            this.place = this.feedbackObject.address;
            this.loadSearchField(this.feedbackObject.latitude, this.feedbackObject.longitude);
            this.dialogFeedback = true;
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
            this.feedbackObject.address = this.currentPlace.formatted_address;
            this.feedbackObject.latitude = this.currentPlace.geometry.location.lat();
            this.feedbackObject.longitude = this.currentPlace.geometry.location.lng();
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
        loadSearchField(latitude, longitude) {
            this.markers = [];
            const marker = {
                lat: latitude,
                lng: longitude,
            };
            this.markers.push({ position: marker });
            this.center = marker;
            this.currentPlace = null;
        },
        validateForm() {
            this.isFormValid = !!(this.feedbackObject.address && this.feedbackObject.latitude && this.feedbackObject.longitude
                && this.feedbackObject.source && this.feedbackObject.feedback_status && this.feedbackObject.date) || this.isViewMode;
        },
        triggerPlaceChangeEvent(address) {
            if (address && address != null && address.length > 5) {
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ address }, (results, status) => {
                    if (status !== 'OK' || !results[0]) {
                        this.$store.commit(SET_SNACKBAR_STATUS, { message: 'Invalid address', color: 'error' });
                    }
                    results[0].formatted_address = address;
                    this.place = results[0].formatted_address;
                    this.setPlace(results[0]);
                    this.validateForm();
                });
            }
        },
        save() {
            this.dialogFeedback = false;
            this.feedbackObject.case = this.caseId;
            this.feedbackObject.is_main = true;
            this.createFeedback();
        },
        cancel() {
            this.clearForm();
        },
        clearForm() {
            this.dialogFeedback = false;
            this.isEditMode = false;
            this.isViewMode = false;
            this.feedbackObject = {};
            this.isFormValid = false;
            this.place = null;
            this.$refs.form.reset();
        },
        async createFeedback() {
            const { data: response } = await CasesApi.reportMissing(this.caseId);
            const { data: feedbackObject } = await FeedbacksApi.create(this.feedbackObject);
            this.clearForm();
            this.$router.push({ name: 'cases' });
        },
    },
};
</script>
