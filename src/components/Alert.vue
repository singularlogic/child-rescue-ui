<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-dialog v-model="dialogAlert" persistent max-width="900px">
        <template v-slot:activator="{ on }">
            <v-btn dark color="red" v-on="on" @click="setUp()">
                CREATE ALERT
            </v-btn>
        </template>
        <v-card>
            <v-card-title primary-title>
                <div>
                    <div class="headline">New Alert</div>
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
                                    ref="autocomplete" :value="place"
                                    :rules="[rules.required]"
                                    @place_changed="triggerPlaceChangeEvent"
                                    @keypress.enter="$event.preventDefault()"/>
                                </v-flex>
                                <v-flex xs12 sm12 md12 lg12 xl12>
                                    <v-layout row wrap>
                                        <v-flex xs12 sm12 md12 lg12 xl12>
                                            <alert-map></alert-map>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 sm12 md12 lg12 xl12 style="margin-top: 10px;">
                                    <v-layout wrap>
                                        <v-flex xs12 sm12 md6 lg6 xl6>
                                            <v-text-field v-model="alertObject.latitude" class="header-text-field-input"
                                                          label="Latitude" placeholder="-" disabled
                                                          style="padding: 5px;"
                                                          prepend-icon=""></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm12 md6 lg6 xl6>
                                            <v-text-field v-model="alertObject.longitude"
                                                          class="header-text-field-input"
                                                          label="Longitude" placeholder="-" disabled
                                                          style="padding: 5px;"
                                                          prepend-icon=""></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm12 md6 lg6 xl6>
                                            <v-text-field v-model="alertObject.radius" suffix="km"
                                                          label="Radius" placeholder="Set radius in km"
                                                          style="padding: 5px;"
                                                          prepend-icon="panorama_fish_eye" @change="validateForm()"
                                                          :rules="[rules.required]"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm12 md6 lg6 xl6>
                                            <v-text-field v-model.number="alertDuration" type="number" suffix="H"
                                                          max="240" min="1"
                                                          label="Duration" placeholder="Set alert duration in hours"
                                                          style="padding: 5px;"
                                                          prepend-icon="access_time" @change="validateForm()"
                                                          :rules="[rules.duration, rules.required]"></v-text-field>
                                        </v-flex>
                                        <!--<v-flex xs12 sm12 md4 lg4 xl4>-->
                                        <!--<v-menu v-model="startMenu" :close-on-content-click="false" :nudge-right="40" lazy-->
                                        <!--transition="scale-transition" offset-y full-width min-width="290px">-->
                                        <!--<template v-slot:activator="{ on }">-->
                                        <!--<v-text-field v-model="alertObject.start" label="Start date"-->
                                        <!--prepend-icon="event" readonly v-on="on" style="padding: 5px;"-->
                                        <!--:rules="[rules.required]" @change="validateForm()">-->
                                        <!--</v-text-field>-->
                                        <!--</template>-->
                                        <!--<v-date-picker v-model="alertObject.start"-->
                                        <!--@input="startMenu = false"></v-date-picker>-->
                                        <!--</v-menu>-->
                                        <!--</v-flex>-->
                                        <!--<v-flex xs12 sm12 md4 lg4 xl4>-->
                                        <!--<v-menu ref="startTimeMenu" v-model="startTimeMenu" :close-on-content-click="false"-->
                                        <!--:nudge-right="40" :return-value.sync="alertObject.start_time" lazy-->
                                        <!--transition="scale-transition" offset-y full-width max-width="290px"-->
                                        <!--min-width="290px">-->
                                        <!--<template v-slot:activator="{ on }">-->
                                        <!--<v-text-field v-model="alertObject.start_time" label="Start time"-->
                                        <!--prepend-icon="access_time" readonly v-on="on"-->
                                        <!--:rules="[rules.required]" style="padding: 5px;" @change="validateForm()">-->
                                        <!--</v-text-field>-->
                                        <!--</template>-->
                                        <!--<v-time-picker v-if="startTimeMenu" v-model="alertObject.start_time"-->
                                        <!--format="24hr"-->
                                        <!--full-width-->
                                        <!--@click:minute="$refs.startTimeMenu.save(alertObject.start_time)">-->
                                        <!--</v-time-picker>-->
                                        <!--</v-menu>-->
                                        <!--</v-flex>-->
                                        <!--<v-flex xs12 sm12 md4 lg4 xl4>-->
                                        <!--<v-checkbox v-model="alertObject.is_active"-->
                                        <!--:label="`Alert is active`" style="padding: 5px;" @change="validateForm()">-->
                                        <!--</v-checkbox>-->
                                        <!--</v-flex>-->
                                        <!--<v-flex xs12 sm12 md4 lg4 xl4>-->
                                        <!--<v-menu v-model="endMenu" :close-on-content-click="false" :nudge-right="40" lazy-->
                                        <!--transition="scale-transition" offset-y full-width min-width="290px">-->
                                        <!--<template v-slot:activator="{ on }">-->
                                        <!--<v-text-field v-model="alertObject.end" label="End date"-->
                                        <!--prepend-icon="event" readonly v-on="on" style="padding: 5px;"-->
                                        <!--:rules="[rules.required]" @change="validateForm()">-->
                                        <!--</v-text-field>-->
                                        <!--</template>-->
                                        <!--<v-date-picker v-model="alertObject.end"-->
                                        <!--@input="endMenu = false"></v-date-picker>-->
                                        <!--</v-menu>-->
                                        <!--</v-flex>-->
                                        <!--<v-flex xs12 sm12 md4 lg4 xl4>-->
                                        <!--<v-menu ref="endTimeMenu" v-model="endTimeMenu" :close-on-content-click="false"-->
                                        <!--:nudge-right="40" :return-value.sync="alertObject.end_time" lazy-->
                                        <!--transition="scale-transition" offset-y full-width max-width="290px"-->
                                        <!--min-width="290px">-->
                                        <!--<template v-slot:activator="{ on }">-->
                                        <!--<v-text-field v-model="alertObject.end_time" label="End time"-->
                                        <!--prepend-icon="access_time" readonly v-on="on"-->
                                        <!--style="padding: 5px;" :rules="[rules.required]" @change="validateForm()">-->
                                        <!--</v-text-field>-->
                                        <!--</template>-->
                                        <!--<v-time-picker v-if="endTimeMenu" v-model="alertObject.end_time" format="24hr"-->
                                        <!--full-width-->
                                        <!--@click:minute="$refs.endTimeMenu.save(alertObject.end_time)">-->
                                        <!--</v-time-picker>-->
                                        <!--</v-menu>-->
                                        <!--</v-flex>-->
                                        <v-flex xs12 sm12 md12>
                                            <v-textarea name="input-7-1" v-model="alertObject.description" box
                                                        label="Comment"
                                                        ref="alertObjectDescription"
                                                        placeholder="Describe the situation please..." auto-grow
                                                        rows="4"
                                                        :rules="[rules.required]" @change="validateForm()">
                                            </v-textarea>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <!--<v-flex xs12 sm12 md4 lg4 xl4>-->
                        <!--<v-card>-->
                        <!--<v-img :src="getImagePath(alertObject.image)"></v-img>-->
                        <!--</v-card>-->
                        <!--</v-flex>-->
                    </v-layout>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="gray darken-1" flat @click="cancel()">Close</v-btn>
                <v-btn color="blue darken-1" :disabled="!isFormValid" flat @click="save()">
                    <span v-if="alertObject.id && alertObject.id !== null">Update alert</span>
                    <span v-else>Create alert</span>
                </v-btn>
                <deactivate-alert v-if="alertObject.id && alertObject.id !== null"></deactivate-alert>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { bus } from '../main';
import AlertMap from './AlertMap';
import moment from 'moment';

import { mapGetters, mapMutations, mapActions } from 'vuex';
import * as R from 'ramda';
import DeactivateAlert from './DeactivateAlert';

export default {
    components: {
        'alert-map': AlertMap,
        'deactivate-alert': DeactivateAlert,
    },
    props: {
        caseId: null,
        fullName: null,
    },
    data() {
        return {
            baseUrl: process.env.VUE_APP_BACKEND,
            isFormValid: false,
            alertDuration: null,
            startMenu: false,
            startTimeMenu: false,
            endMenu: false,
            endTimeMenu: false,
            place: null,
            dialogAlert: false,
            rules: {
                required: value => !!value || 'Field is required',
                duration: value => value && value > 0 && value < 241 || 'Duration must be between 1 to 240 hours',
            }
        };
    },
    computed: {
        ...mapGetters('alert_module', {
            getAlert: 'getAlert',
            getAlertStructure: 'getAlertStructure',
        }),
        ...mapGetters('case_module', {
            getCase: 'getCase',
        }),
        alertObject: {
            get() {
                if (this.getAlert === null) {
                    let object = R.clone(this.getAlertStructure);
                    if (object.description && (object.description === null || object.description === '')) {
                        object.description = this.getCase.default_message;
                    }
                    // this.updateAlertMutation(object);
                    return object;

                    // return R.clone(this.getAlertStructure);
                } else {
                    let object = R.clone(this.getAlert);
                    if (object.description && (object.description === null || object.description === '')) {
                        object.description = this.getCase.default_message;
                    }
                    // this.updateAlertMutation(object);
                    return object;
                }
            },
            set(value) {
                this.updateAlertMutation(value);
            },
        },
    },
    mounted() {
        bus.$emit('enable-alert-geolocation-event');
    },
    created() {
        bus.$off('close-alert-dialog-event');
        bus.$on('close-alert-dialog-event', () => {
            this.cancel();
        });

        bus.$off('update-alert-coords-event');
        bus.$on('update-alert-coords-event', () => {
            this.alertObject.latitude = this.getAlert.latitude;
            this.alertObject.longitude = this.getAlert.longitude;
        });

        bus.$off('update-alert-location-event');
        bus.$on('update-alert-location-event', () => {
            this.alertObject.address = this.getAlert.address;
            this.alertObject.latitude = this.getAlert.latitude;
            this.alertObject.longitude = this.getAlert.longitude;
        });

        bus.$off('edit-alert-dialog-event');
        bus.$on('edit-alert-dialog-event', (alert) => {
            this.isFormValid = true;
            this.alertObject = alert;
            this.place = this.alertObject.address;
            this.alertDuration = moment(this.alertObject.end)
                .diff(moment(this.alertObject.start));
            let hours = moment.duration(this.alertDuration)
                .hours();
            let days = moment.duration(this.alertDuration)
                .days();
            this.alertDuration = 24 * days + hours;

            bus.$emit('alert-load-auto-complete-event', {
                latitude: this.alertObject.latitude,
                longitude: this.alertObject.longitude
            });
            this.dialogAlert = true;
        });
    },
    methods: {
        ...mapMutations('generic_module', {
            showSnackbarMutation: 'showSnackbarMutation',
            hideSnackbarMutation: 'hideSnackbarMutation',
            showLoaderMutation: 'showLoaderMutation',
            hideLoaderMutation: 'hideLoaderMutation',
        }),
        ...mapMutations('alert_module', {
            clearAlertMutation: 'clearAlertMutation',
            updateAlertMutation: 'updateAlertMutation',
            addToAlertsMutation: 'addToAlertsMutation',
            replaceToAlertsMutation: 'replaceToAlertsMutation',
        }),
        ...mapActions('alert_module', {
            createAlertAction: 'createAlertAction',
            updateAlertAction: 'updateAlertAction',
        }),
        setUp() {
            this.alertObject.description = this.getCase.default_message;
        },
        validateForm() {
            this.isFormValid = !!(this.alertObject.address && this.alertObject.latitude && this.alertObject.longitude
                && this.alertObject.radius && this.alertDuration && this.alertObject.description);
        },
        triggerPlaceChangeEvent(place) {
            this.updateAlertMutation(this.alertObject);
            this.place = place.formatted_address;
            bus.$emit('alert-auto-complete-event', place);
            this.validateForm();
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
            this.dialogAlert = false;
            this.clearForm();
        },
        clearForm() {
            this.clearAlertMutation();
            this.isFormValid = false;
            this.place = null;
            bus.$emit('alert-clear-auto-complete-event');
            this.$refs.form.reset();
        },
        getImagePath(path) {
            if (this.baseUrl && this.baseUrl.length > 1) {
                return this.baseUrl + path;
            } else {
                return path;
            }
        },
        createAlert() {
            this.alertObject.is_active = true;
            this.alertObject.start = moment()
                .toISOString();
            this.alertObject.end = moment(this.alertObject.start)
                .add(this.alertDuration, 'hours')
                .toISOString();
            this.showLoaderMutation();
            this.createAlertAction({ alertObject: this.alertObject })
                .then((response) => {
                    if (response.status === 201) {
                        this.hideLoaderMutation();
                        this.clearForm();
                        this.addToAlertsMutation(response.data);
                        bus.$emit('reload-alerts-event');
                    } else {
                        this.hideLoaderMutation();
                    }
                })
                .catch((error) => {
                    this.hideLoaderMutation();
                    if (error.response) {
                        this.showSnackbarMutation({
                            message: error.response,
                            status: 'error'
                        });
                    } else {
                        this.showSnackbarMutation({
                            message: 'Network error',
                            status: 'error'
                        });
                    }
                    this.clearForm();
                    setTimeout(() => {
                        this.hideSnackbarMutation();
                    }, 3000);
                });
        },
        updateAlert() {
            this.alertObject.is_active = true;
            this.alertObject.start = moment(this.alertObject.start)
                .toISOString();
            this.alertObject.end = moment(this.alertObject.start)
                .add(this.alertDuration, 'hours')
                .toISOString();
            this.showLoaderMutation();
            this.updateAlertAction({ alertObject: this.alertObject })
                .then((response) => {
                    if (response.status === 200) {
                        this.hideLoaderMutation();
                        this.clearForm();
                        this.replaceToAlertsMutation(response.data);
                        bus.$emit('reload-alerts-event');
                    } else {
                        this.hideLoaderMutation();
                    }
                })
                .catch((error) => {
                    this.hideLoaderMutation();
                    if (error.response) {
                        this.showSnackbarMutation({
                            message: error.response,
                            status: 'error'
                        });
                    } else {
                        this.showSnackbarMutation({
                            message: 'Network error',
                            status: 'error'
                        });
                    }
                    this.clearForm();
                    setTimeout(() => {
                        this.hideSnackbarMutation();
                    }, 3000);
                });
        },
    }
};
</script>

<style scoped>

    /*.search-location {*/
    /*display: block;*/
    /*width: 60vw;*/
    /*margin: 0 auto;*/
    /*margin-top: 5vw;*/
    /*font-size: 20px;*/
    /*font-weight: 400;*/
    /*outline: none;*/
    /*height: 30px;*/
    /*line-height: 30px;*/
    /*text-align: center;*/
    /*border-radius: 10px;*/
    /*}*/
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
