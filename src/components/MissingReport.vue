<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-dialog v-model="dialogFeedback" persistent max-width="900px" scrollable @keydown.esc="cancel()">
        <template v-slot:activator="{ on }">
            <v-btn dark color="red" v-on="on">
                {{ $t('missing_report.missing') }}
            </v-btn>
        </template>
        <v-card>
            <v-card-title primary-title>
                <div>
                    <div v-if="isEditMode" class="headline">{{ $t('missing_report.update_fact') }}</div>
                    <div v-else-if="isViewMode" class="headline">Fact: {{ feedbackObject.id }}</div>
                    <div v-else class="headline">{{ $t('missing_report.missing_report') }}</div>
                    <a @click="goToCase()" style="color: blue;">{{ $t('missing_report.case') }} #{{ caseId }} - {{ fullName }}</a>
                    <br/>
                    <span style="font-size: small;">{{ $t('case.required_fields') }}</span>
                </div>
            </v-card-title>
            <v-card-text style="margin-top: -30px;">
                <v-form ref="form">
                    <v-layout row wrap>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-layout v-if="!isViewMode" row wrap>
                                <v-flex xs12 sm10 md10 lg10 xl10>
                                    <v-text-field
                                        ref="addressField"
                                        v-model="place"
                                        :rules="[rules.address, rules.required]"
                                        :label="$t('missing_report.star_address')"
                                        :hint="$t('missing_report.address_hint')"
                                        persistent-hint
                                        prepend-icon="pin_drop"
                                        class="textField"
                                        style="margin-left:5px; margin-bottom: 5px;"
                                        @change="validateForm()"
                                        @keyup.enter.native="triggerPlaceChangeEvent(place)"/>
                                </v-flex>
                                <v-flex xs12 sm2 md2 lg2 xl2>
                                    <v-btn dark color="primary" style="margin-top: 12px;" @click="triggerPlaceChangeEvent(place)">{{ $t('missing_report.find_address') }}</v-btn>
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
                                        :class="{'disable-events': isViewMode, textField }"
                                        :label="$t('missing_report.address')"
                                        :hint="$t('missing_report.address_hint')"
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
                                <v-flex v-if="feedbackObject.feedback_image" xs12 sm12 md12 lg12 xl12>
                                    <v-img :src="feedbackObject.feedback_image" style="padding: 10px; margin-bottom: 15px;"/>
                                </v-flex>
                                <v-flex xs12 sm12 md6 lg6 xl6>
                                    <v-text-field v-model="feedbackObject.source" :class="{'disable-events': isViewMode}"
                                                  :rules="[rules.required]" :label="$t('missing_report.star_source')"
                                                  style="padding: 5px;" prepend-icon="account_box" @change="validateForm()"/>
                                </v-flex>
                                <v-flex xs12 sm12 md6 lg6 xl6>
                                    <v-select :items="feedbackStatuses" v-model="feedbackObject.feedback_status" :class="{'disable-events': isViewMode}"
                                              :rules="[rules.required]" :label="$t('missing_report.star_status')" style="padding: 5px;"
                                              @change="validateForm()"/>
                                </v-flex>
                                <v-flex xs12 sm12 md6 lg6 xl6>
                                    <date-time-picker v-model="feedbackObject.date" :label="$t('missing_report.star_datetime')" prepend-icon="access_time" style="margin-left: 5px;"
                                                      :class="{'disable-events': isViewMode}" :rules="[rules.required]" @input="validateForm()"></date-time-picker>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3>
                                    <v-select :items="childStatuses" v-model="feedbackObject.child_status" :class="{'disable-events': isViewMode}"
                                              :label="$t('missing_report.child_status')" style="padding: 5px; margin-top:7px;"/>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3>
                                    <v-select :items="transportationChoices" v-model="feedbackObject.transportation" :class="{'disable-events': isViewMode}"
                                              :label="$t('missing_report.transportation')" style="padding: 5px; margin-top:7px;"/>
                                </v-flex>
                                <v-flex xs12 sm12 md12 lg12 xl12>
                                    <v-textarea v-model="feedbackObject.comment" name="input-7-1" box :label="$t('missing_report.comment')"
                                                rows="3" :class="{'disable-events': isViewMode}" style="padding: 5px 5px;"
                                                :placeholder="$t('missing_report.comment_placeholder')" auto-grow/>
                                </v-flex>
                                <v-flex xs12 sm12 md3>
                                    <v-select :items="mobileOptions"
                                              v-model="caseObject.has_mobile_phone"
                                              :label="$t('case.has_mobile')"
                                              style="padding: 5px 10px;">
                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm12 md3>
                                    <v-select :items="moneyOptions"
                                              v-model="caseObject.has_money_or_credit"
                                              :label="$t('case.has_money')"
                                              style="padding: 5px 10px;">
                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm12 md3>
                                    <v-select :items="booleanOptions"
                                              v-model="caseObject.has_area_knowledge"
                                              :label="$t('case.has_area_knowledge')"
                                              style="padding: 5px 10px;">
                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm12 md3>
                                    <v-select :items="booleanOptions"
                                              v-model="caseObject.clothing_with_scent"
                                              :label="$t('case.scent')"
                                              style="padding: 5px 10px;">
                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm12 md3>
                                    <v-select :items="booleanOptions"
                                              v-model="caseObject.is_first_time_missing"
                                              :label="$t('case.first_time_miss')"
                                              style="padding: 5px 10px;">
                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm12 md9>
                                    <v-textarea name="input-7-1"
                                                v-model="caseObject.transit_country" box
                                                :label="$t('case.transit_country')"
                                                :placeholder="$t('case.transit_country_placeholder')"
                                                auto-grow
                                                rows="2"
                                                style="padding: 5px 10px;"
                                                counter maxlength="1000">
                                    </v-textarea>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn color="blue darken-1" flat @click="cancel()">{{ $t('missing_report.close') }}</v-btn>
                <v-btn v-if="!isViewMode" :disabled="!isFormValid" color="red darken-1" flat @click="save()">{{ $t('missing_report.declare_missing_child') }}</v-btn>
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
            caseObject: {},
            isFormValid: false,
            place: null,
            dialogFeedback: false,
            rules: {
                required: value => !!value || this.$t('missing_report.rules_required'),
                address: value => value && value.length > 5 && value.length < 250 || this.$t('missing_report.rules_address'),
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
                    text: this.$t('missing_report.appearance_change'),
                    value: 'appearance_change',
                },
                {
                    text: this.$t('missing_report.shocked'),
                    value: 'shocked',
                },
                {
                    text: this.$t('missing_report.injured_sick'),
                    value: 'injured_sick',
                },
                {
                    text: this.$t('missing_report.deceased'),
                    value: 'deceased',
                },
                {
                    text: this.$t('missing_report.unknown'),
                    value: null,
                },
            ],
            transportationChoices: [
                {
                    text: this.$t('missing_report.foot'),
                    value: 'foot',
                },
                {
                    text: this.$t('missing_report.bus_tram'),
                    value: 'bus_tram',
                },
                {
                    text: this.$t('missing_report.car_motorcycle'),
                    value: 'car_motorcycle',
                },
                {
                    text: this.$t('missing_report.train'),
                    value: 'train',
                },
                {
                    text: this.$t('missing_report.metro_subway'),
                    value: 'metro_subway',
                },
                {
                    text: this.$t('missing_report.bicycle_scooter'),
                    value: 'bicycle_scooter',
                },
                {
                    text: this.$t('missing_report.ship_aeroplane'),
                    value: 'ship_aeroplane',
                },
                {
                    text: this.$t('missing_report.unknown'),
                    value: null,
                },
            ],
            booleanOptions: [
                {
                    text: this.$t('case.yes_no_choice.yes'),
                    value: 'yes',
                },
                {
                    text: this.$t('case.yes_no_choice.no'),
                    value: 'no',
                },
                {
                    text: this.$t('case.yes_no_choice.unknown'),
                    value: null,
                },
            ],
            mobileOptions: [
                {
                    text: this.$t('case.mobile_choice.yes'),
                    value: 'yes',
                },
                {
                    text: this.$t('case.mobile_choice.deactivated'),
                    value: 'deactivated',
                },
                {
                    text: this.$t('case.mobile_choice.abductor'),
                    value: 'abductor',
                },
                {
                    text: this.$t('case.mobile_choice.no'),
                    value: 'no',
                },
                {
                    text: this.$t('case.mobile_choice.unknown'),
                    value: null,
                },
            ],
            moneyOptions: [
                {
                    text: this.$t('case.money_choice.yes'),
                    value: 'yes',
                },
                {
                    text: this.$t('case.money_choice.probably_yes'),
                    value: 'probably_yes',
                },
                {
                    text: this.$t('case.money_choice.probably_no'),
                    value: 'probably_no',
                },
                {
                    text: this.$t('case.money_choice.no'),
                    value: 'no',
                },
                {
                    text: this.$t('case.money_choice.unknown'),
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
        async save() {
            this.dialogFeedback = false;
            this.feedbackObject.case = this.caseId;
            this.feedbackObject.is_main = true;
            await this.createFeedback();
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
            const { data: feedbackObject } = await FeedbacksApi.create(this.feedbackObject);
            const { data: response } = await CasesApi.reportMissing(this.caseId, this.caseObject);
            this.clearForm();
            this.$router.push({ name: 'cases' });
        },
    },
};
</script>
