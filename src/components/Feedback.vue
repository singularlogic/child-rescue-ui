<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-dialog v-model="dialogFeedback" persistent max-width="900px" scrollable>
        <template v-slot:activator="{ on }">
            <v-btn dark color="green" v-on="on">
                Provide Fact
            </v-btn>
        </template>
        <v-card>
            <v-card-title primary-title>
                <div>
                    <div class="headline">New Fact</div>
                    <span class="grey--text">Case #{{ caseId }} - {{ fullName }}</span>
                </div>
            </v-card-title>
            <v-card-text>
                <v-form ref="form">
                    <v-layout row wrap>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-layout row wrap>
                                <v-flex xs12 sm12 md12 lg12 xl12>
                                    <gmap-autocomplete class="customInputField glowing-border" autofocus
                                                       ref="autocomplete" :types="['geocode']" :value="place"
                                                       :rules="[rules.required]"
                                                       @place_changed="triggerPlaceChangeEvent"/>
                                </v-flex>
                                <v-flex xs12 sm12 md12 lg12 xl12>
                                    <v-layout row wrap>
                                        <v-flex xs12 sm12 md12 lg12 xl12>
                                            <feedback-map></feedback-map>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12 xl12 style="margin-top: 10px;">
                            <v-layout wrap>
                                <v-flex xs12 sm12 md6 lg6 xl6>
                                    <v-text-field v-model="feedbackObject.latitude" class="header-text-field-input"
                                                  label="Latitude" placeholder="-" disabled style="padding: 5px;"
                                                  prepend-icon=""></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md6 lg6 xl6>
                                    <v-text-field v-model="feedbackObject.longitude" class="header-text-field-input"
                                                  label="Longitude" placeholder="-" disabled style="padding: 5px;"
                                                  prepend-icon=""></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12 lg12 xl12 v-if="feedbackObject.feedback_image">
                                    <v-img :src="getImagePath(feedbackObject.feedback_image)" style="padding: 10px; margin-bottom: 15px;"></v-img>
                                </v-flex>
                                <v-flex xs12 sm12 md6 lg6 xl6>
                                    <v-text-field v-model="feedbackObject.source" class="header-text-field-input"
                                                  label="Source" placeholder="source" style="padding: 5px;"
                                                  :rules="[rules.required]" prepend-icon="" @change="validateForm()">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md6 lg6 xl6>
                                    <v-select :items="feedbackStatuses" v-model="feedbackObject.feedback_status"
                                              label="Status" style="padding: 5px;" :rules="[rules.required]"
                                              @change="validateForm()">
                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3>
                                    <v-menu v-model="dateMenu" :close-on-content-click="false" :nudge-right="40" lazy
                                            transition="scale-transition" offset-y full-width min-width="290px">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="feedbackObject.date" label="Date of incident"
                                                          prepend-icon="event" readonly v-on="on" style="padding: 5px;"
                                                          :rules="[rules.required]" @change="validateForm()">
                                            </v-text-field>
                                        </template>
                                        <v-date-picker v-model="feedbackObject.date"
                                                       @input="dateMenu = false"></v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3>
                                    <v-menu ref="timeMenu" v-model="timeMenu" :close-on-content-click="false"
                                            :nudge-right="40" :return-value.sync="feedbackObject.time" lazy
                                            transition="scale-transition" offset-y full-width max-width="290px"
                                            min-width="290px">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="feedbackObject.time" label="Time of incident"
                                                          prepend-icon="access_time" readonly v-on="on"
                                                          style="padding: 5px;" :rules="[rules.required]"
                                                          @change="validateForm()">
                                            </v-text-field>
                                        </template>
                                        <v-time-picker v-if="timeMenu" v-model="feedbackObject.time" format="24hr"
                                                       full-width
                                                       @click:minute="$refs.timeMenu.save(feedbackObject.time)">
                                        </v-time-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3>
                                    <v-select :items="childStatuses" v-model="feedbackObject.child_status"
                                              label="Child status" style="padding: 5px;">
                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm12 md3 lg3 xl3>
                                    <v-select :items="transportationChoices" v-model="feedbackObject.transportation"
                                              label="Transportation" style="padding: 5px;">
                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm12 md12 lg12 xl12>
                                    <v-textarea name="input-7-1" v-model="feedbackObject.comment" box label="Comment"
                                                placeholder="Describe the situation please..." auto-grow>
                                    </v-textarea>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="cancel()">Close</v-btn>
                <v-btn color="blue darken-1" :disabled="!isFormValid" flat @click="save()">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { bus } from '../main';
import FeedbackMap from './FeedbackMap';

import { mapGetters, mapMutations, mapActions } from 'vuex';
import * as R from 'ramda';

export default {
    components: {
        'feedback-map': FeedbackMap,
    },
    props: {
        caseId: null,
        fullName: null,
    },
    data() {
        return {
            baseUrl: process.env.VUE_APP_BACKEND,
            isFormValid: false,
            dateMenu: false,
            timeMenu: false,
            place: null,
            dialogFeedback: false,
            rules: {
                required: value => !!value || 'Field is required',
            },
            feedbackStatuses: [
                'pending', 'relevant', 'irrelevant', 'credible',
            ],
            childStatuses: [
                'ok', 'dead', 'initial', 'wounded'
            ],
            transportationChoices: ['foot', 'bus', 'car', 'train', 'other']
        };
    },
    computed: {
        ...mapGetters('feedback_module', {
            getFeedback: 'getFeedback',
            getFeedbackStructure: 'getFeedbackStructure',
        }),
        feedbackObject: {
            get() {
                if (this.getFeedback === null) {
                    return R.clone(this.getFeedbackStructure);
                } else {
                    return R.clone(this.getFeedback);
                }
            },
            set(value) {
                this.updateFeedbackMutation(value);
            },
        },
    },
    mounted() {
        bus.$emit('enable-feedback-geolocation-event');
    },
    created() {
        bus.$off('update-feedback-coords-event');
        bus.$on('update-feedback-coords-event', () => {
            this.feedbackObject.latitude = this.getFeedback.latitude;
            this.feedbackObject.longitude = this.getFeedback.longitude;
        });

        bus.$off('update-feedback-location-event');
        bus.$on('update-feedback-location-event', () => {
            this.feedbackObject.address = this.getFeedback.address;
            this.feedbackObject.latitude = this.getFeedback.latitude;
            this.feedbackObject.longitude = this.getFeedback.longitude;
        });

        bus.$off('edit-feedback-dialog-event');
        bus.$on('edit-feedback-dialog-event', (feedback) => {
            this.isFormValid = true;
            this.feedbackObject = feedback;
            this.place = this.feedbackObject.address;
            bus.$emit('feedback-load-auto-complete-event', {
                latitude: this.feedbackObject.latitude,
                longitude: this.feedbackObject.longitude
            });
            this.dialogFeedback = true;
        });
    },
    methods: {
        ...mapMutations('generic_module', {
            showSnackbarMutation: 'showSnackbarMutation',
            hideSnackbarMutation: 'hideSnackbarMutation',
            showLoaderMutation: 'showLoaderMutation',
            hideLoaderMutation: 'hideLoaderMutation',
        }),
        ...mapMutations('feedback_module', {
            clearFeedbackMutation: 'clearFeedbackMutation',
            updateFeedbackMutation: 'updateFeedbackMutation',
            addToFeedbacksMutation: 'addToFeedbacksMutation',
            replaceToFeedbacksMutation: 'replaceToFeedbacksMutation',
        }),
        ...mapActions('feedback_module', {
            createFeedbackAction: 'createFeedbackAction',
            updateFeedbackAction: 'updateFeedbackAction',
        }),

        validateForm() {
            this.isFormValid = !!(this.feedbackObject.address && this.feedbackObject.latitude && this.feedbackObject.longitude
                && this.feedbackObject.source && this.feedbackObject.feedback_status && this.feedbackObject.date
                && this.feedbackObject.time);
        },
        getImagePath(path) {
            if (this.baseUrl && this.baseUrl.length > 1) {
                return this.baseUrl + path;
            } else {
                return path;
            }
        },
        triggerPlaceChangeEvent(place) {
            this.place = place.formatted_address;
            bus.$emit('feedback-auto-complete-event', place);
            this.validateForm();
        },
        save() {
            this.dialogFeedback = false;
            this.feedbackObject.case = this.caseId;
            if (this.feedbackObject.id && this.feedbackObject.id !== null) {
                this.updateFeedback();
            } else {
                this.createFeedback();
            }
        },
        cancel() {
            this.dialogFeedback = false;
            this.clearForm();
        },
        clearForm() {
            this.clearFeedbackMutation();
            this.isFormValid = false;
            this.place = null;
            bus.$emit('feedback-clear-auto-complete-event');
            this.$refs.form.reset();
        },
        createFeedback() {
            this.showLoaderMutation();
            this.createFeedbackAction({ feedbackObject: this.feedbackObject })
                .then((response) => {
                    if (response.status === 201) {
                        this.hideLoaderMutation();
                        this.clearForm();
                        this.addToFeedbacksMutation(response.data);
                        bus.$emit('reload-feedbacks-event');
                    } else {
                        this.hideLoaderMutation();
                    }
                })
                .catch((error) => {
                    this.hideLoaderMutation();
                    if (error.response) {
                        this.showSnackbarMutation({ message: error.response, status: 'error' });
                    } else {
                        this.showSnackbarMutation({ message: "Network error", status: 'error' });
                    }
                    this.clearForm();
                    setTimeout(() => {
                        this.hideSnackbarMutation();
                    }, 3000);
                });
        },
        updateFeedback() {
            this.showLoaderMutation();
            this.updateFeedbackAction({ feedbackObject: this.feedbackObject })
                .then((response) => {
                    if (response.status === 200) {
                        this.hideLoaderMutation();
                        this.clearForm();
                        this.replaceToFeedbacksMutation(response.data);
                        bus.$emit('reload-feedbacks-event');
                    } else {
                        this.hideLoaderMutation();
                    }
                })
                .catch((error) => {
                    this.hideLoaderMutation();
                    if (error.response) {
                        this.showSnackbarMutation({ message: error.response, status: 'error' });
                    } else {
                        this.showSnackbarMutation({ message: "Network error", status: 'error' });
                    }
                    this.clearForm();
                    setTimeout(() => {
                        this.hideSnackbarMutation();
                    }, 3000);
                });
        }
    }
};
</script>

<style scoped>
    .customInputField {
        font-size: 14px;
        width: 100%;
        height: 40px;
    }

    .glowing-border {
        border: 2px solid #F4B350;
        border-radius: 7px;
    }

    .glowing-border:focus {
        outline: none;
        border-color: #F4B350;
        box-shadow: 0 0 2px #F4B350;
    }

    input {
        font-size: 14px;
        padding: 5px 5px 5px 5px;
        display: block;
        width: 300px;
        border: none;
        border-bottom: 1px solid #757575;
    }

    input:focus {
        outline: none;
    }

    label {
        color: #000000;
        font-size: 14px;
        font-weight: normal;
        position: absolute;
        pointer-events: none;
        left: 5px;
        top: -20px;
        transition: 0.2s ease all;
        -moz-transition: 0.2s ease all;
        -webkit-transition: 0.2s ease all;
    }

    input:focus ~ label {
        top: -20px;
        font-size: 14px;
        color: #00ACC1;
    }

    input:focus ~ .bar:before, input:focus ~ .bar:after {
        width: 50%;
    }

    input:focus ~ .highlight {
        -webkit-animation: inputHighlighter 0.3s ease;
        -moz-animation: inputHighlighter 0.3s ease;
        animation: inputHighlighter 0.3s ease;
    }

    @-webkit-keyframes inputHighlighter {
        from {
            background: #F4B350;
        }
        to {
            width: 0;
            background: transparent;
        }
    }

    @-moz-keyframes inputHighlighter {
        from {
            background: #F4B350;
        }
        to {
            width: 0;
            background: transparent;
        }
    }

    @keyframes inputHighlighter {
        from {
            background: #F4B350;
        }
        to {
            width: 0;
            background: transparent;
        }
    }
</style>
