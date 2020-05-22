<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>
        <v-card v-if="isLoaded">
            <v-toolbar v-if="$caseManagerAndAbove.includes($store.state.role) && (caseObject.status==='active' || caseObject.status==='inactive')" dense flat color="white">
                <v-spacer></v-spacer>
                <v-btn @click="openAddPlaceDialog()" color="primary" dark>{{ $t('places.add_place') }}</v-btn>
            </v-toolbar>
            <v-data-table :headers="headers" :items="places" :search="search" :pagination.sync="pagination" height="500px;">
                <template v-slot:items="props">
                    <tr>
                        <td class="text-xs-left">{{ props.item.id }}</td>
                        <td class="text-xs-left">{{ props.item.address || ' - ' | title }}</td>
                        <td class="text-xs-left">{{ props.item.tag || ' - ' | customTitle('_') }}</td>
                        <td class="text-xs-left">{{ props.item.source || ' - ' | title }}</td>
                        <td class="text-xs-left">{{ props.item.description || ' - ' | title | truncate(30) }}</td>
                        <td class="text-xs-left">{{ props.item.evaluation.toFixed(2) || ' - '  }}</td>
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
                    {{ $t('places.no_results') }}
                </v-alert>
            </v-data-table>
        </v-card>
        <v-dialog v-model="editPlaceDialog" width="700">
            <v-card>
                <v-toolbar flat color="white">
                    <v-toolbar-title v-if="place.id">{{ $t('places.update_place') }}</v-toolbar-title>
                    <v-toolbar-title v-else>{{ $t('places.new_place') }}</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="mt-0 pt-0">
                    <v-form ref="placeForm" v-model="valid" lazy-validation @submit.prevent>
                        <v-layout row wrap>
                            <v-flex xs12 sm6 class='px-2'>
                                <v-select :items="tags" v-model="place.tag" :label="$t('places.select_tag')" prepend-icon="label"/>
                            </v-flex>
                            <v-flex xs12 sm6 class='px-2'>
                                <v-select :items="sources" v-model="place.source" :label="$t('places.select_source')" prepend-icon="label"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs12 sm6 class='px-2'>
                                <v-checkbox
                                    v-model="place.is_searched"
                                    :label="$t('places.is_searched')"
                                    class="mt-3"
                                    prepend-icon="label"
                                ></v-checkbox>
                            </v-flex>
                            <v-flex xs12 sm6 class='px-2'>
                                <v-text-field v-model="place.radius" :label="$t('places.set_radius')" prepend-icon="label" @input="triggerPlaceChangeEvent()"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs12 class='px-2'>
                                <v-textarea ref="descriptionField"
                                            autofocus counter flat
                                            v-model="place.description"
                                            box
                                            :placeholder="$t('places.description')"
                                            prepend-icon="description"
                                            class="my-0 py-0"></v-textarea>
                            </v-flex>
                            <v-flex xs12 sm9 class='pl-2'>
                                <v-text-field
                                    ref="addressField"
                                    v-model="address"
                                    :hint="$t('places.address_hint')"
                                    :label="$t('places.address')"
                                    persistent-hint
                                    prepend-icon="pin_drop"
                                    class="textField"
                                    @keyup.enter.native="triggerPlaceChangeEvent()"/>
                            </v-flex>
                            <v-flex xs12 sm2 class='pl-4 mt-2'>
                                <v-btn dark color="primary" @click="triggerPlaceChangeEvent()">{{ $t('places.find_address') }}</v-btn>
                            </v-flex>
                            <v-flex v-if="showMap" xs12 sm12 md12 lg12 xl12 class="ml-4 mr-2" my-1>
                                <gmap-map :center="center" :zoom="18" :options="mapOptions"
                                          style="width:100%;  height: 230px; margin-bottom: 5px;">
                                    <!-- <gmap-marker v-for="(m, index) in markers" :key="index" :position="m.position" :clickable="false"
                                                 :draggable="false" @click="center=m.position"/> -->
                                    <gmap-circle v-for="(m) in markers" :key="m.id" :radius="m.radius" :center="m.position" :clickable="false" :draggable="false"
                                                 :options="{fillColor:'red', fillOpacity:0.1, strokeWidth:1, strokeColor:'red', strokePattern: 'gap' }"/>
                                </gmap-map>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="" flat @click="editPlaceDialog=false;">{{ $t('places.close') }}</v-btn>
                    <v-btn color="primary" flat @click="validate()">
                        <span v-if="place.id">{{ $t('places.update_place') }}</span>
                        <span v-else>{{ $t('places.create_place') }}</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="removePlaceDialog" width="500">
            <v-card>
                <v-toolbar flat color="white">
                    <v-toolbar-title>{{ $t('places.remove_place_title') }}</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text>
                    <v-list two-line>
                        <v-list-tile>
                            <v-layout>
                                <v-flex xs12 sm4 md4 lg4 xl4>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>{{ $t('places.address') }}</v-list-tile-sub-title>
                                        <v-list-tile-title>{{ (place.address || '') | title }}</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-flex>
                                <v-flex xs12 sm4 md4 lg4 xl4>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>{{ $t('places.tag') }}</v-list-tile-sub-title>
                                        <v-list-tile-title>{{ (place.tag || '') }}</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-flex>
                                <v-flex xs12 sm4 md4 lg4 xl4>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>{{ $t('places.source') }}</v-list-tile-sub-title>
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
                    <v-btn color="" flat @click="removePlaceDialog = false; place={};">{{ $t('places.cancel') }}</v-btn>
                    <v-btn color="error" flat @click="removePlace()">{{ $t('places.remove') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import * as R from 'ramda';
import { bus } from '../../../main';
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
                // disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: true,
                streetViewControl: true,
            },
            showMap: false,
            address: null,
            valid: true,
            place: {
                is_searched: false,
            },
            places: [],
            search: '',
            pagination: { sortBy: 'start', descending: true, rowsPerPage: 10 },
            headers: [
                {
                    text: 'ID',
                    value: 'id',
                    width: '5%',
                },
                {
                    text: this.$t('places.address'),
                    value: 'address',
                    width: '15%',
                },
                {
                    text: this.$t('places.tag'),
                    value: 'tag',
                    width: '5%',
                },
                {
                    text: this.$t('places.source'),
                    value: 'source',
                    width: '10%',
                },
                {
                    text: this.$t('places.description'),
                    align: 'left',
                    value: 'description',
                    width: '30%',
                },
                {
                    text: this.$t('places.evaluation'),
                    value: 'evaluation',
                    width: '5%',
                },
                {
                    text: this.$t('places.is_searched'),
                    value: 'is_searched',
                    width: '5%',
                },
                {
                    align: 'center',
                    sortable: false,
                    text: this.$t('places.actions'),
                    value: 'name',
                    width: '5%',
                },
            ],
            tags: [
                {
                    text: this.$t('places.tags.asylum_related'),
                    value: 'asylum_related',
                },
                {
                    text: this.$t('places.tags.romance_related'),
                    value: 'romance_related',
                },
                {
                    text: this.$t('places.tags.health_related'),
                    value: 'health_related',
                },
                {
                    text: this.$t('places.tags.transport_related'),
                    value: 'transport_related',
                },
                {
                    text: this.$t('places.tags.isolation_related'),
                    value: 'isolation_related',
                },
                {
                    text: this.$t('places.tags.streets_related'),
                    value: 'streets_related',
                },
                {
                    text: this.$t('places.tags.social_related'),
                    value: 'social_related',
                },
                {
                    text: this.$t('places.tags.family_related'),
                    value: 'family_related',
                },
                {
                    text: this.$t('places.tags.education_related'),
                    value: 'education_related',
                },
                {
                    text: this.$t('places.tags.other'),
                    value: 'other',
                },
            ],
            sources: [
                {
                    text: this.$t('places.sources.testimonials'),
                    value: 'testimonials',
                },
                {
                    text: this.$t('places.sources.facts'),
                    value: 'facts',
                },
                {
                    text: this.$t('places.sources.analytics'),
                    value: 'analytics',
                },
                {
                    text: this.$t('places.sources.social_media'),
                    value: 'social_media',
                },
                {
                    text: this.$t('places.sources.other'),
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
            console.log(places);
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
            this.place = {};
            this.markers = [];
            this.address = null;
            this.place.address = null;
            this.place.latitude = null;
            this.place.longitude = null;
            this.place.is_searched = false;
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
            const radius = this.place.radius * 1000;
            this.markers.push({ position, radius });
            this.center = position;
        },
        reset() {
            this.$refs.placeForm.reset();
            this.clearPlace();
            this.showMap = false;
        },
        openAddPlaceDialog(originalPlace) {
            if (originalPlace !== undefined) {
                const place = R.clone(originalPlace);
                this.place = place;
                this.address = this.place.address;
                this.showMap = true;
                this.triggerPlaceChangeEvent();
                this.editPlaceDialog = true;
            } else {
                this.reset();
                this.editPlaceDialog = true;
            }
        },
        validate() {
            if (this.$refs.placeForm.validate()) {
                this.updatePlace();
            }
        },
        async updatePlace() {
            console.log(this.place);
            if (this.place.id) {
                await PlacesApi.update(this.place);
            } else {
                this.place.case = this.caseId;
                await PlacesApi.create(this.place);
            }
            this.editPlaceDialog = false;
            this.$store.commit(SET_SNACKBAR_STATUS, { message: this.$t('places.create_success'), color: 'green' });
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
