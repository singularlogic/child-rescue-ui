<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>
        <v-card v-if="isLoaded">
            <v-toolbar v-if="$caseManagerAndAbove.includes($store.state.role) && caseObject.status!='closed'" dense flat color="white">
                <v-spacer></v-spacer>
                <v-btn @click="openAddPlaceDialog()" color="primary" dark>Add place</v-btn>
            </v-toolbar>
            <v-data-table :headers="headers" :items="places" :search="search" :pagination.sync="pagination" height="500px;">
                <template v-slot:items="props">
                    <tr>
                        <td class="text-xs-left">{{ props.item.id }}</td>
                        <td class="text-xs-left">{{ props.item.address || ' - ' | title }}</td>
                        <td class="text-xs-left">{{ props.item.tag || ' - ' | title }}</td>
                        <td class="text-xs-left">{{ props.item.source || ' - ' | title }}</td>
                        <td class="text-xs-left">{{ props.item.description || ' - ' | title }}</td>
                        <td class="text-xs-left">{{ props.item.evaluation || ' - ' | title }}</td>
                        <td class="text-xs-left">
                            <v-icon v-if="props.item.is_searched" color="green">check</v-icon>
                            <v-icon v-else color="error">close</v-icon>
                        </td>
                        <td class="justify-center layout px-0">
                            <template v-if="$caseManagerAndAbove.includes($store.state.role) && caseObject.status!='closed'">
                                <v-icon
                                    small
                                    class="mr-2"
                                    @click.stop="openAddPlaceDialog(props.item)"
                                >edit</v-icon>
                                <v-icon
                                    small
                                    class="mr-2"
                                    @click.stop="openRemovePlaceDialog(props.item)"
                                >delete</v-icon>
                            </template>
                        </td>
                    </tr>
                </template>
                <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                    Your search for "{{ search }}" found no results.
                </v-alert>
            </v-data-table>
        </v-card>
        <v-dialog v-model="editPlaceDialog" width="700">
            <v-card>
                <v-toolbar flat color="white">
                    <v-toolbar-title v-if="place.id">Update place</v-toolbar-title>
                    <v-toolbar-title v-else>New place</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="mt-0 pt-0">
                    <v-form ref="placeForm" v-model="valid" lazy-validation @submit.prevent>
                        <v-layout row wrap>
                            <v-flex xs12 sm6 class='px-2'>
                                <v-select :items="tags" v-model="place.tag" label="Select tag" prepend-icon="label"/>
                            </v-flex>
                            <v-flex xs12 sm6 class='px-2'>
                                <v-select :items="sources" v-model="place.source" label="Select source" prepend-icon="label"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs12 class='px-2'>
                                <v-textarea ref="descriptionField"
                                            autofocus counter flat
                                            v-model="place.description"
                                            box placeholder="Description..."
                                            prepend-icon="description"
                                            class="my-0 py-0"></v-textarea>
                            </v-flex>
                            <v-flex xs12 sm9 class='pl-2'>
                                <v-text-field
                                    ref="addressField"
                                    v-model="address"
                                    label="Address"
                                    hint="Type the address and then hit enter"
                                    persistent-hint
                                    prepend-icon="pin_drop"
                                    class="textField"
                                    @keyup.enter.native="triggerPlaceChangeEvent()"/>
                            </v-flex>
                            <v-flex xs12 sm2 class='pl-4 mt-2'>
                                <v-btn dark color="primary" @click="triggerPlaceChangeEvent()">Find address</v-btn>
                            </v-flex>
                            <v-flex v-if="showMap" xs12 sm12 md12 lg12 xl12 class="ml-4 mr-2" my-1>
                                <gmap-map :center="center" :zoom="18" :options="mapOptions"
                                          style="width:100%;  height: 230px; margin-bottom: 5px;">
                                    <gmap-marker v-for="(m, index) in markers" :key="index" :position="m.position" :clickable="false"
                                                 :draggable="false" @click="center=m.position"/>
                                </gmap-map>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="" flat @click="editPlaceDialog=false;">Close</v-btn>
                    <v-btn color="primary" flat @click="validate()">
                        <span v-if="place.id">Update place</span>
                        <span v-else>Create place</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="removePlaceDialog" width="500">
            <v-card>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Remove place from the case</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text>
                    <v-list two-line>
                        <v-list-tile>
                            <v-layout>
                                <v-flex xs12 sm4 md4 lg4 xl4>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>Address</v-list-tile-sub-title>
                                        <v-list-tile-title>{{ (place.address || '') | title }}</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-flex>
                                <v-flex xs12 sm4 md4 lg4 xl4>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>Tag</v-list-tile-sub-title>
                                        <v-list-tile-title>{{ (place.tag || '') }}</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-flex>
                                <v-flex xs12 sm4 md4 lg4 xl4>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>Source</v-list-tile-sub-title>
                                        <v-list-tile-title>{{ (place.source || ' - ') }}</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-flex>
                            </v-layout>
                        </v-list-tile>
                    </v-list>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="" flat @click="removePlaceDialog = false; place={};">Cancel</v-btn>
                    <v-btn color="error" flat @click="removePlace()">Remove</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import * as R from 'ramda';
import { dates, filters, fonts } from '@/utils/mixins';
import { CasesApi, PlacesApi } from '@/api';
import { SET_SNACKBAR_STATUS } from '@/store/mutation-types';

export default {
    components: {},
    mixins: [dates, filters, fonts],
    data() {
        return {
            editPlaceDialog: false,
            removePlaceDialog: false,
            caseId: null,
            caseObject: {},
            isLoaded: false,
            center: {
                lat: 45.508,
                lng: -73.587,
            },
            markers: [],
            mapOptions: {
                disableDefaultUI: true,
            },
            showMap: false,
            address: null,
            valid: true,
            place: {},
            places: [],
            search: '',
            pagination: { sortBy: 'start', descending: true, rowsPerPage: 10 },
            headers: [
                {
                    text: 'ID',
                    value: 'id',
                    width: '10%',
                },
                {
                    text: 'Address',
                    value: 'address',
                    width: '25%',
                },
                {
                    text: 'Tag',
                    value: 'tag',
                    width: '15%',
                },
                {
                    text: 'Source',
                    value: 'source',
                    width: '10%',
                },
                {
                    text: 'Description',
                    align: 'left',
                    value: 'description',
                    width: '5%',
                },
                {
                    text: 'Evaluation',
                    value: 'evaluation',
                },
                {
                    text: 'Is searched',
                    value: 'is_searched',
                },
                {
                    align: 'center',
                    sortable: false,
                    text: 'Actions',
                    value: 'name',
                    width: '5%',
                },
            ],
            tags: [
                {
                    text: 'Hobby related',
                    value: 'hobby_related',
                },
                {
                    text: 'Family related',
                    value: 'family_related',
                },
                {
                    text: 'Education related',
                    value: 'education_related',
                },
                {
                    text: 'Probable destination',
                    value: 'probable_destination',
                },
                {
                    text: 'Checked-in recently/multiply',
                    value: 'checked_in',
                },
                {
                    text: 'Social event',
                    value: 'social_event',
                },
                {
                    text: 'Fact',
                    value: 'fact',
                },
                {
                    text: 'Other POI',
                    value: 'other',
                },
            ],
            sources: [
                {
                    text: 'Testimonials',
                    value: 'testimonials',
                },
                {
                    text: 'Facts',
                    value: 'facts',
                },
                {
                    text: 'Analytics',
                    value: 'analytics',
                },
                {
                    text: 'Social media',
                    value: 'social_media',
                },
                {
                    text: 'Other',
                    value: 'other',
                },
            ],
        };
    },
    async created() {
        this.caseId = this.$route.params.id;
        await this.loadPlaces();
        const { data: caseObject } = await CasesApi.get(this.caseId);
        this.caseObject = caseObject;
        this.isLoaded = true;
    },
    methods: {
        async loadPlaces() {
            const { data: places } = await PlacesApi.all({ caseId: this.caseId });
            this.places = places;
        },
        triggerPlaceChangeEvent() {
            if (this.address && this.address != null && this.address.length >= 3) {
                // eslint-disable-next-line no-undef
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ address: this.address }, (results, status) => {
                    if (status !== 'OK' || !results[0]) {
                        this.showMap = false;
                        this.clearPlace();
                        this.$store.commit(SET_SNACKBAR_STATUS, { message: 'Invalid address', color: 'error' });
                    } else {
                        results[0].formatted_address = this.address;
                        this.setPlace(results[0]);
                        this.showMap = true;
                    }
                });
            }
        },
        clearPlace() {
            this.markers = [];
            this.address = null;
            this.place.address = null;
            this.place.latitude = null;
            this.place.longitude = null;
        },
        setPlace(data) {
            this.markers = [];
            this.place.address = data.formatted_address;
            this.place.latitude = data.geometry.location.lat();
            this.place.longitude = data.geometry.location.lng();
            const position = {
                lat: data.geometry.location.lat(),
                lng: data.geometry.location.lng(),
            };
            this.markers.push({ position });
            this.center = position;
        },
        reset() {
            this.$refs.placeForm.reset();
            this.clearPlace();
            this.showMap = false;
        },
        openAddPlaceDialog(place) {
            this.reset();
            this.editPlaceDialog = true;
            if (place) {
                this.place = place;
                this.address = this.place.address;
                this.showMap = true;
            } else {
                this.place = {};
            }
        },
        validate() {
            if (this.$refs.placeForm.validate()) {
                this.updatePlace();
            }
        },
        async updatePlace() {
            if (this.place.id) {
                await PlacesApi.update(this.place);
            } else {
                this.place.case = this.caseId;
                await PlacesApi.create(this.place);
            }
            this.editPlaceDialog = false;
            this.$store.commit(SET_SNACKBAR_STATUS, { message: 'Place created successfully!', color: 'green' });
            this.loadPlaces();
        },
        openRemovePlaceDialog(place) {
            this.removePlaceDialog = true;
            this.place = place;
        },
        async removePlace() {
            await PlacesApi.delete(this.place.id);
            this.removePlaceDialog = false;
            this.place = {};
            this.loadPlaces();
        },
    },
};
</script>

<style scoped>
    .blueName {
        color: #3B5998
    }
</style>
