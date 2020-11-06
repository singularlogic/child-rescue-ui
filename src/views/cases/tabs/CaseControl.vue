<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded" style="padding: 10px;">
        <v-toolbar v-if="caseObject.status==='active' || caseObject.status==='inactive'">
            <v-chip v-if="caseObject.organization!==$store.state.organizationId" label dark color="indigo lighten-2">
                <v-icon left>folder_shared</v-icon>
                <b>{{caseObject.organization_name}}</b>
            </v-chip>
            <v-chip v-if="caseObject.amber_alert" label dark color="warning">
                <v-icon left>warning</v-icon>
                <b>{{ $t('case_info.amber_alert') }}</b>
            </v-chip>
            <v-chip v-if="caseObject.status === 'active'" label dark color="blue-grey darken-3">
                <v-icon left>person_search</v-icon>
                <b>Missing</b>
            </v-chip>
            <v-chip v-else-if="caseObject.presence_status === 'present'" label dark color="green">
                <v-icon left>person</v-icon>
                <b>Present</b>
            </v-chip>
            <v-chip v-else-if="caseObject.presence_status === 'not_present'" label dark color="#2FD1D4">
                <v-icon left>person</v-icon>
                <b>Not Present</b>
            </v-chip>
            <v-chip v-else-if="caseObject.presence_status === 'transit'" label dark color="#800080">
                <v-icon left>person</v-icon>
                <b>Not Present</b>
            </v-chip>
            <v-spacer></v-spacer>
            <v-btn flat v-if="caseObject.status==='active' || caseObject.status==='inactive'" @click="createPost()" color="primary" dark>
                {{ $t('feed.create_post') }}
                <v-icon right>cloud_upload</v-icon>
            </v-btn>
        </v-toolbar>
        <v-toolbar v-if="caseObject.status==='closed' && this.$store.state.role!=='facility_manager' && caseObject.organization===$store.state.organizationId">
            <v-chip label dark color="teal darken-5">
                <v-icon left>search_off</v-icon>
                <b>{{ caseObject.status | title }}</b>
            </v-chip>
        </v-toolbar>
        <br/>
        <v-layout>
            <v-flex sm8>
                <v-card color="grey lighten-5" class="mb-2" style="padding: 5px;">
                    <v-toolbar dense flat color="white">
                        <v-toolbar-title>
                            <v-checkbox
                                v-model="showAlertsModel"
                                :label="$t('case_control.show_alerts')"
                                class="mt-3 customClass"
                                @change="renderAlerts()"
                            ></v-checkbox>
                        </v-toolbar-title>
                        <v-toolbar-title>
                            <v-checkbox
                                v-model="showFeedbacksModel"
                                :label="$t('case_control.show_facts')"
                                class="mt-3 customClass"
                                @change="renderFeedbacks()"
                            ></v-checkbox>
                        </v-toolbar-title>
                        <v-toolbar-title>
                            <v-checkbox
                                v-model="showPlacesModel"
                                :label="$t('case_control.show_poi')"
                                class="mt-3 customClass"
                                @change="renderPlaces();"
                            ></v-checkbox>
                        </v-toolbar-title>
                        <v-toolbar-title>
                            <v-checkbox
                                v-model="showAnalyticsModel"
                                :label="$t('case_control.show_analytics')"
                                class="mt-3 customClass"
                                @change="renderSearchAreas();renderAlertAreas();"
                            ></v-checkbox>
                        </v-toolbar-title>
                        <v-toolbar-title>
                            <v-checkbox
                                v-model="showVolunteersModel"
                                :label="$t('case_control.show_volunteers')"
                                class="mt-3 customClass"
                                @change="renderVolunteers()"
                            ></v-checkbox>
                        </v-toolbar-title>
                    </v-toolbar>
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
                                        <v-list-tile-title v-if="infoObject.feedback"><a :href="`/cases/${caseId}/feedbacks`" style="color: blue;">{{ $t('case_control.fact') }}: {{ infoObject.feedback }}</a></v-list-tile-title>
                                        <v-list-tile-title v-else><a :href="`/cases/${caseId}/feedbacks`" style="color: blue;">
                                            <span v-if="infoObject.feedback">{{ $t('case_control.fact') }}</span>
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
                </v-card>
                <v-layout>
            <v-flex sm6 class="mr-2">
                <v-card color="grey lighten-5" class="mb-2" style="padding: 5px;">
                    <v-toolbar dense flat color="white">
                        <v-toolbar-title>{{ $t('case_control.pois') }}</v-toolbar-title>
                    </v-toolbar>
                    <v-list v-if="places.length > 0" two-line style="height:376px; overflow-y: scroll;">
                        <div v-for="place in places" :key="place.id">
                            <v-list-tile>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ place.address || ' - ' | title }}</v-list-tile-title>
                                    <v-list-tile-sub-title><v-chip small color="primary"><v-icon>label</v-icon>{{ place.tag | customTitle("_") }}</v-chip> <v-chip small label><v-icon>share</v-icon>{{ place.source | customTitle("_") }}</v-chip></v-list-tile-sub-title>
                                </v-list-tile-content>
                                <v-list-tile-action v-if="showPlacesModel">
                                    <v-btn icon ripple @click="centerMarker(showPlacesModel, place.latitude, place.longitude)">
                                        <v-icon color="grey lighten-1">info</v-icon>
                                    </v-btn>
                                </v-list-tile-action>
                            </v-list-tile>
                            <v-divider></v-divider>
                        </div>
                    </v-list>
                    <v-parallax v-else dark style="background-color: #C3C3C3; height:376px;">
                        <v-layout align-center column justify-center>
                            <h1 class="display-2 font-weight-thin mb-3">{{ $t('case_control.case_pois') }}</h1>
                            <h4 class="subheading">{{ $t('case_control.no_pois') }}</h4>
                        </v-layout>
                    </v-parallax>
                </v-card>
            </v-flex>
            <v-flex sm6 class="ml-2">
                <v-card color="grey lighten-5" class="mb-2" style="padding: 5px;">
                    <v-toolbar dense flat color="white">
                        <v-toolbar-title>{{ $t('case_control.volunteers') }}</v-toolbar-title>
                    </v-toolbar>
                    <v-list v-if="volunteers.length > 0" two-line style="height:376px; overflow-y: scroll;">
                        <div v-for="volunteer in volunteers" :key="volunteer.id">
                            <v-list-tile>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ volunteer.first_name || ' - ' | title}} {{ volunteer.last_name || ' - ' | title }}</v-list-tile-title>
                                    <v-list-tile-sub-title>{{ $t('case_control.team') }}: {{ volunteer.team_name || ' - ' | title }} <v-chip v-if="volunteer.is_team_leader" small label>{{ $t('case_control.leader') }}</v-chip></v-list-tile-sub-title>
                                </v-list-tile-content>
                                <v-list-tile-action v-if="showVolunteersModel">
                                    <v-btn icon ripple @click="centerMarker(showVolunteersModel, volunteer.latitude, volunteer.longitude)">
                                        <v-icon color="grey lighten-1">info</v-icon>
                                    </v-btn>
                                </v-list-tile-action>
                            </v-list-tile>
                            <v-divider></v-divider>
                        </div>
                    </v-list>
                    <v-parallax v-else dark style="background-color: #C3C3C3; height:376px;">
                        <v-layout align-center column justify-center>
                            <h1 class="display-2 font-weight-thin mb-3">{{ $t('case_control.case_volunteers') }}</h1>
                            <h4 class="subheading">{{ $t('case_control.no_volunteers') }}</h4>
                        </v-layout>
                    </v-parallax>
                </v-card>
            </v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm4>
                <feed></feed>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { bus } from '../../../main';
import { dates, filters, fonts } from '@/utils/mixins';
import { UsersApi, AlertsApi, FeedbacksApi, CasesApi, PlacesApi } from '@/api';
import Feed from '@/components/Feed.vue';
import { SET_REFRESH_CONTROL, SET_REFRESH_FEED, SET_SHOW_ALERTS, SET_SHOW_POI, SET_SHOW_ANALYTICS, SET_SHOW_VOLUNTEERS, SET_SHOW_FACTS } from '@/store/mutation-types';


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
        ...mapGetters(['showAlerts']),
        ...mapGetters(['showFacts']),
        ...mapGetters(['showPOI']),
        ...mapGetters(['showAnalytics']),
        ...mapGetters(['showVolunteers']),
        showAlertsModel: {
            get() {
                return this.showAlerts;
            },
            set(val) {
                this.$store.commit(SET_SHOW_ALERTS, val);
            },
        },
        showFeedbacksModel: {
            get() {
                return this.showFacts;
            },
            set(val) {
                this.$store.commit(SET_SHOW_FACTS, val);
            },
        },
        showPlacesModel: {
            get() {
                return this.showPOI;
            },
            set(val) {
                this.$store.commit(SET_SHOW_POI, val);
            },
        },
        showAnalyticsModel: {
            get() {
                return this.showAnalytics;
            },
            set(val) {
                this.$store.commit(SET_SHOW_ANALYTICS, val);
            },
        },
        showVolunteersModel: {
            get() {
                return this.showVolunteers;
            },
            set(val) {
                this.$store.commit(SET_SHOW_VOLUNTEERS, val);
            },
        },
    },
    async created() {
        this.$store.commit(SET_REFRESH_CONTROL, true);
        this.$store.commit(SET_REFRESH_FEED, true);
        const { data: userObject } = await UsersApi.get();
        this.userObject = userObject;
        if (this.userObject.role === 'case_manager') {
            this.$store.commit(SET_SHOW_ALERTS, true);
            this.$store.commit(SET_SHOW_FACTS, true);
        }
        if (this.userObject.role === 'network_manager') {
            this.$store.commit(SET_SHOW_POI, true);
            this.$store.commit(SET_SHOW_VOLUNTEERS, true);
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
    async destroyed () {
        await clearTimeout(this.timeoutFun);
    },
    async beforeDestroy() {
        await clearTimeout(this.timeoutFun);
    },
    methods: {
        async reloadAll() {
            if (this.$store.state.token === null || this.refreshControl === false) clearTimeout(this.timeoutFun);
            else if (this.refreshControl) {
                await this.loadAlerts();
                await this.loadFeedbacks();
                await this.loadPlaces();
                await this.loadVolunteers();
                this.geolocate();
                this.render();
                this.timeoutFun = setTimeout(this.reloadAll, 30000);
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
            this.volunteers = [];
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
                this.volunteerMarkers = [];
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
            if (this.showPOI) {
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
            if (this.showFacts) {
                this.feedbackMarkers = [];
                this.feedbacks.forEach((feedback) => {
                    if (feedback.latitude && feedback.longitude && feedback.feedback_status !== 'irrelevant' && feedback.feedback_status !== 'spam') {
                        const position = {
                            lat: feedback.latitude,
                            lng: feedback.longitude,
                        };
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
            if (this.showAnalytics) {
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
            if (this.showAnalytics) {
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
        createPost() {
            bus.$emit('create-post-event');
        }
    },
};
</script>

<style scoped>
.customClass >>> label {
    font-size: 15px;
}

</style>
