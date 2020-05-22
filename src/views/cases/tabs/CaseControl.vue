<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout v-if="isLoaded" row fill-height>
        <v-flex>
            <div style="height: 100%;">
                <v-layout row fill-height wrap style="overflow-y: hidden;">
                    <v-flex xs12 sm12 md12 lg8 xl8>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-card>
                                    <v-toolbar dense>
                                        <v-toolbar-title>
                                            <v-checkbox
                                                v-model="showAlerts"
                                                label="Show alerts"
                                                class="mt-3"
                                                @change="renderAlerts()"
                                            ></v-checkbox>
                                        </v-toolbar-title>
                                        <v-toolbar-title>
                                            <v-checkbox
                                                v-model="showFeedbacks"
                                                label="Show facts"
                                                class="mt-3"
                                                @change="renderFeedbacks()"
                                            ></v-checkbox>
                                        </v-toolbar-title>
                                        <v-toolbar-title>
                                            <v-checkbox
                                                v-model="showPlaces"
                                                label="Show POI"
                                                class="mt-3"
                                                @change="renderPlaces();renderSearchAreas();renderAlertAreas();"
                                            ></v-checkbox>
                                        </v-toolbar-title>
                                        <v-toolbar-title>
                                            <v-checkbox
                                                v-model="showVolunteers"
                                                label="Show volunteers"
                                                class="mt-3"
                                                @change="renderVolunteers()"
                                            ></v-checkbox>
                                        </v-toolbar-title>
                                    </v-toolbar>
                                </v-card>
                                <gmap-map :center="center" :zoom="zoom" :options="mapOptions" style="height: 350px;">
                                    <gmap-marker v-for="(m) in initFeedbackMarkers" :key="m.id" :position="m.position" :clickable="true" :draggable="false" @click="openWindow('initFeedback', m)"/>
                                    <gmap-marker v-for="(m) in feedbackMarkers" :key="m.id" :position="m.position" :clickable="true" :draggable="false" @click="openWindow('feedback', m)"/>
                                    <gmap-marker v-for="(m) in placeMarkers" :key="m.id" :position="m.position" :animation="m.animation" :clickable="true" :draggable="false" @click="openWindow('place', m)" :icon="m.icon"/>
                                    <gmap-marker v-for="(m) in volunteerMarkers" :key="m.id" :position="m.position" :animation="m.animation" :clickable="true" :draggable="false" @click="openWindow('volunteer', m)" :icon="m.icon"/>
                                    <gmap-circle v-for="(m) in alertMarkers" :key="m.id" :radius="m.radius" :center="m.position" :clickable="false" :draggable="false"
                                                 :options="{fillColor:'red', fillOpacity:0.5, strokeWidth:1, strokeColor:'red', strokePattern: 'gap' }"/>
                                    <gmap-circle v-for="(m) in placeMarkers" :key="m.id" :radius="m.radius" :center="m.position" :clickable="false" :draggable="false" :animation="m.animation" @click="openWindow('place', m)" :icon="m.icon"
                                                 :options="{fillColor:'blue', fillOpacity:0.5, strokeWidth:0.1, strokeColor:'blue', strokePattern: 'gap' }"/>
                                    <gmap-circle v-for="(m) in searchAreaMarkers" :key="m.id" :radius="m.radius" :center="m.position" :clickable="false" :draggable="false"
                                                 :options="{fillColor:'green', fillOpacity:0, strokeWidth:1, strokeColor:'green', strokePattern: 'dot' }"/>
                                    <gmap-circle v-for="(m) in alertAreaMarkers" :key="m.id" :radius="m.radius" :center="m.position" :clickable="false" :draggable="false"
                                                 :options="{fillColor:'red', fillOpacity:0, strokeWidth:1, strokeColor:'red', strokePattern: 'Dash' }"/>
                                    <gmap-info-window
                                        @closeclick="window_open=false"
                                        :opened="window_open"
                                        :position="infowindow"
                                        :options="{
                                            pixelOffset: {
                                                width: 0,
                                                height: -35
                                            }
                                        }"
                                    >
                                        <v-list two-line>
                                            <v-list-tile v-if="infoObject.type === 'volunteer'" avatar>
                                                <v-list-tile-avatar>
                                                    <v-icon v-if="infoObject.is_team_leader" color="primary">person</v-icon>
                                                    <v-icon v-else color="grey">person</v-icon>
                                                </v-list-tile-avatar>
                                                <v-list-tile-content>
                                                    <v-list-tile-title>{{ infoObject.first_name || " - " | title }} {{ infoObject.last_name || " - " | title }}</v-list-tile-title>
                                                    <v-list-tile-sub-title>{{ infoObject.team_name || ' - ' | title }}</v-list-tile-sub-title>
                                                </v-list-tile-content>
                                            </v-list-tile>
                                            <v-list-tile v-if="infoObject.type === 'place' || infoObject.type === 'feedback' || infoObject.type === 'initFeedback'" avatar>
                                                <v-list-tile-avatar >
                                                    <v-img v-if="infoObject.image" :src="getProperImagePath(infoObject.image)"></v-img>
                                                    <v-icon v-else-if="infoObject.feedback" color="primary">feedback</v-icon>
                                                    <v-icon v-else color="primary">my_location</v-icon>
                                                </v-list-tile-avatar>
                                                <v-list-tile-content>
                                                    <v-list-tile-title v-if="infoObject.feedback"><a :href="`/cases/${caseId}/feedbacks`" style="color: blue;">Fact: {{ infoObject.feedback }}</a></v-list-tile-title>
                                                    <v-list-tile-title v-else><a :href="`/cases/${caseId}/feedbacks`" style="color: blue;">
                                                        <span v-if="infoObject.feedback">Fact</span>
                                                        <span v-else>POI</span>
                                                        : {{ infoObject.id }}
                                                    </a></v-list-tile-title>
                                                    <v-list-tile-sub-title>{{ infoObject.address || " - " | title }}</v-list-tile-sub-title>
                                                    <v-list-tile-sub-title v-if="infoObject.type === 'initFeedback'">{{ caseObject.disappearance_date | formatDateTime }}</v-list-tile-sub-title>
                                                    <v-list-tile-sub-title v-else>{{ (infoObject.description || infoObject.comment) || " - " | title }}</v-list-tile-sub-title>
                                                </v-list-tile-content>
                                            </v-list-tile>
                                        </v-list>
                                    </gmap-info-window>
                                </gmap-map>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs12 sm6>
                                <v-toolbar dense flat>
                                    <v-toolbar-title>Places of Interest (POIS)</v-toolbar-title>
                                </v-toolbar>
                                <v-card flat>
                                    <v-list v-if="places.length > 0" two-line style="height:376px; overflow-y: scroll;">
                                        <div v-for="place in places" :key="place.id">
                                            <v-list-tile>
                                                <v-list-tile-content>
                                                    <v-list-tile-title>{{ place.address || ' - ' | title }}</v-list-tile-title>
                                                    <v-list-tile-sub-title><v-chip small color="primary"><v-icon>label</v-icon>{{ place.tag | customTitle("_") }}</v-chip> <v-chip small label><v-icon>share</v-icon>{{ place.source | customTitle("_") }}</v-chip></v-list-tile-sub-title>
                                                </v-list-tile-content>
                                                <v-list-tile-action v-if="showPlaces">
                                                    <v-btn icon ripple @click="centerMarker(showPlaces, place.latitude, place.longitude)">
                                                        <v-icon color="grey lighten-1">info</v-icon>
                                                    </v-btn>
                                                </v-list-tile-action>
                                            </v-list-tile>
                                            <v-divider></v-divider>
                                        </div>
                                    </v-list>
                                    <v-parallax v-else dark style="background-color: #C3C3C3; height:376px;">
                                        <v-layout align-center column justify-center>
                                            <h1 class="display-2 font-weight-thin mb-3">Case points of interest</h1>
                                            <h4 class="subheading">No POIs in this case yet...</h4>
                                        </v-layout>
                                    </v-parallax>
                                </v-card>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-toolbar dense flat>
                                    <v-toolbar-title>Volunteers</v-toolbar-title>
                                </v-toolbar>
                                <v-card flat>
                                    <v-list v-if="volunteers.length > 0" two-line style="height:376px; overflow-y: scroll;">
                                        <div v-for="volunteer in volunteers" :key="volunteer.id">
                                            <v-list-tile>
                                                <v-list-tile-content>
                                                    <v-list-tile-title>{{ volunteer.first_name || ' - ' | title}} {{ volunteer.last_name || ' - ' | title }}</v-list-tile-title>
                                                    <v-list-tile-sub-title>Team: {{ volunteer.team_name || ' - ' | title }} <v-chip v-if="volunteer.is_team_leader" small label>Leader</v-chip></v-list-tile-sub-title>
                                                </v-list-tile-content>
                                                <v-list-tile-action v-if="showVolunteers">
                                                    <v-btn icon ripple @click="centerMarker(showVolunteers, volunteer.latitude, volunteer.longitude)">
                                                        <v-icon color="grey lighten-1">info</v-icon>
                                                    </v-btn>
                                                </v-list-tile-action>
                                            </v-list-tile>
                                            <v-divider></v-divider>
                                        </div>
                                    </v-list>
                                    <v-parallax v-else dark style="background-color: #C3C3C3; height:376px;">
                                        <v-layout align-center column justify-center>
                                            <h1 class="display-2 font-weight-thin mb-3">Case volunteers</h1>
                                            <h4 class="subheading">No volunteers have aceepted invites for this case yet...</h4>
                                        </v-layout>
                                    </v-parallax>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg4 xl4 class="">
                        <feed></feed>
                    </v-flex>
                </v-layout>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import { dates, filters, fonts } from '@/utils/mixins';
import { UsersApi, AlertsApi, FeedbacksApi, CasesApi, PlacesApi } from '@/api';
import Feed from '@/components/Feed.vue';
import { SET_REFRESH_CONTROL, SET_REFRESH_FEED } from '@/store/mutation-types';


export default {
    components: {
        feed: Feed,
    },
    mixins: [dates, filters, fonts],
    data() {
        return {
            timeoutFun: null,
            infowindow: { lat: 10, lng: 10.0 },
            window_open: false,

            showAlerts: false,
            showFeedbacks: false,
            showPlaces: false,
            showVolunteers: false,
            center: {
                lat: 45.508,
                lng: -73.587,
            },
            zoom: 12,
            initFeedbackMarkers: [],
            feedbackMarkers: [],
            alertMarkers: [],
            volunteerMarkers: [],
            userObject: {},
            placeMarkers: [],
            searchAreaMarkers: [],
            alertAreaMarkers: [],
            place: null,
            places: [],
            volunteers: [],
            currentPlace: null,
            infoObject: {},
            mapOptions: {
                zoomControl: true,
                mapTypeControl: true,
                streetViewControl: true,
                // disableDefaultUI: true,
            },
            caseId: null,
            caseObject: {},
            alerts: [],
            feedbacks: [],
            isLoaded: false,
            poi_icon: require('../../../assets/poi_image.png'),
            volunteer_icon: require('../../../assets/volunteer_icon.jpeg'),
        };
    },
    computed: {
        ...mapGetters(['refreshControl']),
        ...mapGetters(['refreshFeed']),
    },
    mounted() {
        // if (this.userObject.role === 'network_manager') {
        //     this.showAlerts = false;
        //     this.showFeedbacks = true;
        //     this.showPlaces = true;
        //     this.showVolunteers = true;
        // } else {
        //     this.showAlerts = true;
        //     this.showFeedbacks = true;
        //     this.showPlaces = true;
        //     this.showVolunteers = false;
        // }
        // this.render();
    },
    async created() {
        this.$store.commit(SET_REFRESH_CONTROL, true);
        this.$store.commit(SET_REFRESH_FEED, true);
        console.log('AAAARG');
        console.log(this.refreshControl);
        console.log(this.refreshFeed);
        const { data: userObject } = await UsersApi.get();
        this.userObject = userObject;
        console.log(userObject.role);
        if (this.userObject.role === 'case_manager') {
            this.showAlerts = true;
            this.showFeedbacks = true;
        }
        if (this.userObject.role === 'network_manager') {
            this.showPlaces = true;
            this.showVolunteers = true;
        }
        this.caseId = this.$route.params.id;
        const { data: caseObject } = await CasesApi.get(this.caseId);
        this.caseObject = caseObject;
        await this.loadAlerts();
        await this.loadFeedbacks();
        await this.loadPlaces();
        await this.loadVolunteers();
        this.geolocate();
        this.render();
        this.reloadAll();
        this.isLoaded = true;
    },
    methods: {
        async reloadAll() {
            if (this.refreshControl === false) clearTimeout(this.timeoutFun);
            if (this.refreshControl) {
                console.log('REFRESH CONTROL');
                await this.loadAlerts();
                await this.loadFeedbacks();
                await this.loadPlaces();
                await this.loadVolunteers();
                this.geolocate();
                this.render();
                this.timeoutFun = setTimeout(this.reloadAll, 60000);
            }
        },
        getProperImagePath(image) {
            return `${process.env.VUE_APP_BACKEND}/media/${image}`;
        },
        openWindow(markerType, marker) {
            this.window_open = true;
            this.infowindow = marker.position;
            this.infoObject = marker.instance;
            this.infoObject.type = markerType;
            this.center = marker.position;
        },
        async loadVolunteers() {
            const { data: volunteers } = await CasesApi.getVolunteers(this.caseId);
            volunteers.forEach((volunteer) => {
                if (volunteer.has_accept_invitation) {
                    this.volunteers.push(volunteer);
                }
            });
        },
        async loadPlaces() {
            const { data: places } = await PlacesApi.all({ caseId: this.caseId });
            this.places = places;
        },
        async loadFeedbacks() {
            const { data: feedbacks } = await FeedbacksApi.all({ caseId: this.caseId });
            this.feedbacks = feedbacks;
        },
        async loadAlerts() {
            const { data: alerts } = await AlertsApi.all({ caseId: this.caseId, is_active: true });
            this.alerts = alerts;
        },
        geolocate() {
            const initFeedback = this.feedbacks.pop();
            if (initFeedback.latitude && initFeedback.longitude) {
                const position = {
                    lat: initFeedback.latitude,
                    lng: initFeedback.longitude,
                };
                this.initFeedbackMarkers.push({ instance: initFeedback, position });
                this.center = position;
            }
        },
        centerMarker(isEnabled, lat, lng) {
            if (isEnabled && lat !== null && lng !== null) {
                const position = {
                    lat,
                    lng,
                };
                this.center = position;
                this.zoom = 18;
            }
        },
        render() {
            this.renderVolunteers();
            this.renderPlaces();
            this.renderFeedbacks();
            this.renderAlerts();
            this.renderSearchAreas();
            this.renderAlertAreas();
        },
        renderVolunteers() {
            if (this.showVolunteers) {
                this.volunteers.forEach((volunteer, index) => {
                    if (volunteer.latitude && volunteer.longitude) {
                        const position = {
                            lat: volunteer.latitude,
                            lng: volunteer.longitude,
                        };
                        const icon = {
                            url: this.volunteer_icon,
                            // eslint-disable-next-line no-undef
                            scaledSize: new google.maps.Size(32, 32),
                        };
                        // eslint-disable-next-line no-undef
                        const animation = google.maps.Animation.DROP;

                        setTimeout(() => {
                            this.volunteerMarkers.push({
                                instance: volunteer,
                                position,
                                icon,
                                animation,
                            });
                        }, 200 * index);
                    }
                });
            } else {
                this.volunteerMarkers = [];
            }
        },
        renderPlaces() {
            if (this.showPlaces) {
                this.placeMarkers = [];
                this.places.forEach((place, index) => {
                    if (place.latitude && place.longitude) {
                        const position = {
                            lat: place.latitude,
                            lng: place.longitude,
                        };
                        const icon = {
                            url: this.poi_icon,
                            // eslint-disable-next-line no-undef
                            scaledSize: new google.maps.Size(32, 32),
                        };
                        // eslint-disable-next-line no-undef
                        const animation = google.maps.Animation.DROP;
                        console.log(place);
                        const radius = place.radius * 1000;
                        setTimeout(() => {
                            this.placeMarkers.push({
                                instance: place,
                                position,
                                icon,
                                animation,
                                radius,
                            });
                        }, 200 * index);
                    }
                });
            } else {
                this.placeMarkers = [];
            }
        },
        renderFeedbacks() {
            if (this.showFeedbacks) {
                this.feedbackMarkers = [];
                this.feedbacks.forEach((feedback) => {
                    if (feedback.latitude && feedback.longitude) {
                        const position = {
                            lat: feedback.latitude,
                            lng: feedback.longitude,
                        };
                        console.log('Feedback');
                        console.log(feedback);
                        this.feedbackMarkers.push({ instance: feedback, position });
                    }
                });
            } else {
                this.feedbackMarkers = [];
            }
        },
        renderAlerts() {
            if (this.showAlerts) {
                this.alertMarkers = [];
                this.alerts.forEach((alert) => {
                    if (alert.latitude && alert.longitude) {
                        const position = {
                            lat: alert.latitude,
                            lng: alert.longitude,
                        };
                        const radius = alert.radius * 1000;
                        this.alertMarkers.push({ instance: alert, position, radius });
                    }
                });
            } else {
                this.alertMarkers = [];
            }
        },
        renderSearchAreas() {
            if (this.showPlaces) {
                this.searchAreaMarkers = [];
                this.places.forEach((place) => {
                    if (place.data.search_area.latitude && place.data.search_area.longitude) {
                        const position = {
                            lat: place.data.search_area.latitude,
                            lng: place.data.search_area.longitude,
                        };
                        const radius = place.data.search_area.radius * 1000;
                        this.searchAreaMarkers.push({ instance: place.data.search_area, position, radius });
                    }
                });
            } else {
                this.searchAreaMarkers = [];
            }
        },
        renderAlertAreas() {
            if (this.showPlaces) {
                this.alertAreaMarkers = [];
                this.places.forEach((place) => {
                    if (place.data.alert_area.latitude && place.data.alert_area.longitude) {
                        const position = {
                            lat: place.data.alert_area.latitude,
                            lng: place.data.alert_area.longitude,
                        };
                        const radius = place.data.alert_area.radius * 1000;
                        this.alertAreaMarkers.push({ instance: place.data.alert_area, position, radius });
                    }
                });
            } else {
                this.alertAreaMarkers = [];
            }
        },
    },
};
</script>
