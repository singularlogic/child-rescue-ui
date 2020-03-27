<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-dialog v-model="dialogFeedback" persistent max-width="900px" scrollable @keydown.esc="cancel()">
        <v-card>
            <v-card-title primary-title>
                <div>
                    <div v-if="isEditMode" class="headline">Update Fact</div>
                    <div v-else-if="isViewMode" class="headline">Fact: {{ feedbackObject.id }}</div>
                    <div v-else class="headline">Provide Fact</div>
                    <a @click="goToCase()" style="color: blue;">Case #{{ caseId }} - {{ fullName }}</a>
                </div>
                <v-spacer></v-spacer>
                <v-btn color="info" @click="downloadWithCSS">Download</v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="mt-2 py-0">
                <v-form ref="form">
                    <v-layout row wrap>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-layout v-if="!isViewMode" row wrap>
                                <v-flex xs12 sm10>
                                    <v-text-field
                                        ref="addressField"
                                        v-model="place"
                                        :rules="[rules.address, rules.required]"
                                        label="Address"
                                        hint="Type the address and then hit enter"
                                        persistent-hint
                                        :class="{'disable-events': isViewMode || feedbackObject.id!=null}"
                                        prepend-icon="pin_drop"
                                        @change="validateForm()"
                                        @keyup.enter.native="triggerPlaceChangeEvent(place)"/>
                                </v-flex>
                                <v-flex xs12 sm2 md2 lg2 xl2>
                                    <v-btn dark color="primary" @click="triggerPlaceChangeEvent(place)">Find address</v-btn>
                                </v-flex>
                                <v-flex xs12 class="mx-2 my-2">
                                    <gmap-map :center="center" :zoom="18" :options="mapOptions" style="height: 330px;">
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
                                        hint="Type the address and then hit enter"
                                        :class="{'disable-events': isViewMode || feedbackObject.id!=null}"
                                        persistent-hint
                                        prepend-icon="pin_drop"/>
                                </v-flex>
                                <v-flex xs12 class="mx-2 my-2">
                                    <gmap-map :center="center" :zoom="18" :options="mapOptions" style="height: 330px;">
                                        <gmap-marker v-for="(m, index) in markers" :key="index" :position="m.position" :clickable="true"
                                                     :draggable="false" @click="center=m.position"/>
                                    </gmap-map>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex v-if="feedbackObject.feedback_image" xs12 class="my-2 mx-2" ref="content_image">
                            <div ref="feedbackImage">
                                <v-img :src="feedbackObject.feedback_image" height="350px"/>
                            </div>
                        </v-flex>
                        <v-flex xs12 sm12 md6>
                            <v-text-field v-model="feedbackObject.source" :class="{'disable-events': isViewMode || feedbackObject.id!=null}" class="px-2 py-2"
                                          :rules="[rules.required]" label="Source" placeholder="Source" prepend-icon="person" @change="validateForm()"/>
                        </v-flex>
                        <v-flex xs12 sm12 md6>
                            <date-time-picker v-model="feedbackObject.date" label="Date and time of incident" prepend-icon="access_time"
                                              :class="{'disable-events': isViewMode || feedbackObject.id!=null}" class="px-2 py-0" :rules="[rules.required]" @input="validateForm()"></date-time-picker>
                        </v-flex>
                        <v-flex xs12 sm12 md3>
                            <v-select :items="feedbackStatuses" v-model="feedbackObject.feedback_status" :class="{'disable-events': isViewMode}" class="px-2 py-2"
                                      :rules="[rules.required]" label="Status" @change="validateForm()"/>
                        </v-flex>
                        <v-flex xs12 sm12 md6>
                            <v-select :items="childStatuses" v-model="feedbackObject.child_status" :class="{'disable-events': isViewMode}" class="px-2 py-2" label="Child status"/>
                        </v-flex>
                        <v-flex xs12 sm12 md3>
                            <v-select :items="transportationChoices" v-model="feedbackObject.transportation" :class="{'disable-events': isViewMode}" class="px-2 py-2" label="Transportation"/>
                        </v-flex>
                        <v-flex xs12 sm6>
                            <v-textarea v-model="feedbackObject.comment" name="input-7-1" box label="Comment"
                                        rows="3" :class="{'disable-events': isViewMode || feedbackObject.id!=null}" class="mx-1"
                                        placeholder="Describe the situation please..." auto-grow/>
                        </v-flex>
                        <v-flex xs12 sm6>
                            <v-textarea v-model="feedbackObject.note" name="input-7-1" box label="Note"
                                        rows="3" :class="{'disable-events': isViewMode}" class="mx-1"
                                        placeholder="Keep notes..." auto-grow/>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="my-0">
                <v-spacer/>
                <v-btn color="blue darken-1" flat @click="cancel()">Close</v-btn>
                <v-btn v-if="!isViewMode" :disabled="!isFormValid" color="blue darken-1" flat @click="save()">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { bus } from '../main';
import { UsersApi, FeedbacksApi, PlacesApi } from '@/api';
import { DateTimePicker } from '@/components';
import { SET_SNACKBAR_STATUS } from '@/store/mutation-types';

export default {
    components: {
        DateTimePicker,
    },
    props: {
        caseId: { type: [String, Number], default: null },
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
                disableDefaultUI: true,
            },
            isViewMode: false,
            isEditMode: false,
            feedbackObject: {},
            isFormValid: false,
            place: null,
            dialogFeedback: false,
            rules: {
                required: value => !!value || 'Field is required',
                address: value => (value && value.length > 5 && value.length < 250) || 'Address must be between 5 and 50 characters',
            },
            feedbackStatuses: [
                {
                    text: 'Pending',
                    value: 'pending',
                },
                {
                    text: 'Relevant',
                    value: 'relevant',
                },
                {
                    text: 'Irrelevant',
                    value: 'irrelevant',
                },
                {
                    text: 'Credible',
                    value: 'credible',
                },
                {
                    text: 'Spam',
                    value: 'spam',
                },
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
        this.getUserName();
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
        bus.$off('create-feedback-dialog-event');
        bus.$on('create-feedback-dialog-event', () => {
            this.isFormValid = true;
            this.isEditMode = true;
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
        downloadWithCSS() {
            const doc = new jsPDF();
            doc.text('Feedback', 10, 10);
            doc.text(`ID: ${this.feedbackObject.id}`, 10, 20);
            doc.text(`Address: ${this.feedbackObject.address}`, 10, 30);
            doc.text(`Date: ${this.feedbackObject.date}`, 10, 40);
            doc.text(`Fullname: ${this.feedbackObject.fullname}`, 10, 50);
            doc.text(`Source: ${this.feedbackObject.source}`, 10, 60);
            doc.text(`Coords: ${this.feedbackObject.latitude} ${this.feedbackObject.latitude}`, 10, 70);
            doc.text(`Comment: ${this.feedbackObject.comment}`, 10, 80);
            doc.text(`Note: ${this.feedbackObject.note}`, 10, 90);
            if (this.feedbackObject.feedback_image) {
                const tempImage = new Image();
                tempImage.src = this.feedbackObject.feedback_image;
                const canvas = document.createElement('canvas');
                canvas.width = tempImage.naturalWidth;
                canvas.height = tempImage.naturalHeight;
                canvas.getContext('2d');
                html2canvas(this.$refs.feedbackImage, { canvas, useCORS: true }).then((canvas) => {
                    const img = canvas.toDataURL('image/png');
                    doc.addImage(img, 'PNG', 10, 100);
                    doc.save(`feedback_${this.feedbackObject.id}.pdf`);
                });
            }
        },
        async getUserName() {
            const { data: userObject } = await UsersApi.get();
            this.feedbackObject.source = `${userObject.last_name} ${userObject.first_name}`;
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
        async save() {
            this.dialogFeedback = false;
            this.feedbackObject.case = this.caseId;
            let feedbackObject = {};
            if (this.feedbackObject.id && this.feedbackObject.id !== null) {
                const { data: feedbackObjectResponse } = await FeedbacksApi.edit(this.feedbackObject);
                feedbackObject = feedbackObjectResponse;
            } else {
                const { data: feedbackObjectResponse } = await FeedbacksApi.create(this.feedbackObject);
                feedbackObject = feedbackObjectResponse;
            }
            const { data: places } = await PlacesApi.all({ caseId: this.caseId });
            const placeExists = places.filter(place => feedbackObject.id === place.feedback).length > 0;
            if (!placeExists && (feedbackObject.feedback_status === 'credible' || feedbackObject.feedback_status === 'relevant')) {
                const placeObject = { feedback: feedbackObject.id, case: feedbackObject.case, description: feedbackObject.comment, latitude: feedbackObject.latitude, longitude: feedbackObject.longitude, address: feedbackObject.address, tag: 'fact', source: 'facts' };
                const { data: newPlace } = await PlacesApi.create(placeObject);
                this.$store.commit(SET_SNACKBAR_STATUS, { message: 'POI created', color: 'primary' });
            }
            this.clearForm();
            bus.$emit('reload-feedbacks-event');
            this.$router.push({ name: 'feedbacks' });
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
    },
};
</script>
