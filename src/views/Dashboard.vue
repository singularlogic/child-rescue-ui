<template>
    <div v-if="isLoaded">
        <v-layout justify-space-around align-center wrap v-if="role === 'organization_manager'" style="padding: 10px;">
            <v-flex xs12>
                <v-toolbar>
                    <v-flex sm2>
                        <v-menu v-model="startDateMenu" :close-on-content-click="false" :nudge-right="40" lazy transition="scale-transition" offset-y min-width="190px">
                            <template v-slot:activator="{ on }">
                                <v-text-field v-model="startDate" class="dateFilter"
                                                :label="$t('dashboard.start_date')"
                                                prepend-icon="event" readonly v-on="on"
                                                clearable>
                                </v-text-field>
                            </template>
                            <v-date-picker v-model="startDate" @input="startDateMenu = false"></v-date-picker>
                        </v-menu>
                    </v-flex>
                    <v-flex sm2>
                        <v-menu v-model="endDateMenu" :close-on-content-click="false" :nudge-right="40" lazy transition="scale-transition" offset-y min-width="190px">
                            <template v-slot:activator="{ on }">
                                <v-text-field v-model="endDate" class="dateFilter"
                                                :label="$t('dashboard.end_date')"
                                                prepend-icon="event" readonly v-on="on"
                                                clearable>
                                </v-text-field>
                            </template>
                            <v-date-picker v-model="endDate" @input="endDateMenu = false"></v-date-picker>
                        </v-menu>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-btn flat dark color="#F4B350" @click="loadSelectedCases()">
                        {{ $t('dashboard.apply_filter') }}
                        <v-icon right dark>filter_alt</v-icon>
                    </v-btn>
                    <v-btn flat dark color="purple darken-3" @click="downloadPDF()">
                        {{ $t('dashboard.download') }}
                        <v-icon right dark>cloud_download</v-icon>
                    </v-btn>
                </v-toolbar>
                <br/>
            </v-flex>
            <v-flex sm12 style="margin: 5px;">
                <v-card style="background-color: #fafafa;">
                    <v-layout justify-space-around align-center wrap>
                        <v-flex class="mr-1">
                            <v-toolbar flat>
                                <v-toolbar-title>{{ $t('dashboard.total_cases_label') }}:</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-toolbar-title>{{ totalCases }}</v-toolbar-title>
                            </v-toolbar>
                        </v-flex>
                        <v-flex class="mr-1">
                            <v-toolbar flat>
                                <v-toolbar-title>{{ $t('dashboard.active_cases_label') }}:</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-toolbar-title>{{ activeCases }}</v-toolbar-title>
                            </v-toolbar>
                        </v-flex>
                        <v-flex class="mr-1">
                            <v-toolbar flat>
                                <v-toolbar-title>{{ $t('dashboard.closed_cases_label') }}:</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-toolbar-title>{{ closedCases }}</v-toolbar-title>
                            </v-toolbar>
                        </v-flex>
                        <v-flex>
                            <v-toolbar flat>
                                <v-toolbar-title>{{ $t('dashboard.archived_cases_label') }}:</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-toolbar-title>{{ archivedCases }}</v-toolbar-title>
                            </v-toolbar>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex sm4>
                <v-card style="margin: 5px;">
                    <v-toolbar flat>
                        <v-toolbar-title>{{ $t('dashboard.male_vs_female') }}</v-toolbar-title>
                    </v-toolbar>
                    <v-divider></v-divider>
                    <apexchart ref="gender" :height="320" type="bar" :stacked="true" :options="getOptions(['Gender'])" :series="getGenderColumnChartData()"/>
                </v-card>
            </v-flex>
            <v-flex sm4>
                <v-card style="margin: 5px;">
                    <v-toolbar flat>
                        <v-toolbar-title>{{ $t('dashboard.refugee_vs_local') }}</v-toolbar-title>
                    </v-toolbar>
                    <v-divider></v-divider>
                    <apexchart ref="nationality" :height="320" type="bar" :stacked="true" :options="getOptions(['Nationality'])" :series="getRefugeeColumnChartData()"/>
                </v-card>
            </v-flex>
            <v-flex sm4>
                <v-card style="margin: 5px;">
                    <v-toolbar flat>
                        <v-toolbar-title>{{ $t('dashboard.age_groups') }}</v-toolbar-title>
                    </v-toolbar>
                    <v-divider></v-divider>
                    <apexchart ref="age" :height="320" type="bar" :stacked="true" :options="getOptions(['Age'])" :series="getAgeGroupsColumnChartData()"/>
                </v-card>
            </v-flex>
            <v-flex sm4>
                <v-card style="margin: 5px;">
                    <v-toolbar flat>
                        <v-toolbar-title>{{ $t('dashboard.disappearance_type') }}</v-toolbar-title>
                    </v-toolbar>
                    <v-divider></v-divider>
                    <apexchart ref="disappearance_type" :height="320" type="bar" :stacked="true" :options="getOptions(['Dissapearance Type'])" :series="getDisappearanceTypeColumnChartData()"/>

                </v-card>
            </v-flex>
            <v-flex sm4>
                <v-card style="margin: 5px;">
                    <v-toolbar flat>
                        <v-toolbar-title>{{ $t('dashboard.disappearance_reasons') }}</v-toolbar-title>
                    </v-toolbar>
                    <v-divider></v-divider>
                    <apexchart ref="disappearance_reasons" :height="320" type="bar" :stacked="true" :options="getOptions(['Reasons of Disappearance'])" :series="getDisappearanceReasonsColumnChartData()"/>
                </v-card>
            </v-flex>
            <v-flex sm4>
                <v-card style="margin: 5px;">
                    <v-toolbar flat>
                        <v-toolbar-title>{{ $t('dashboard.found_vs_missing') }}</v-toolbar-title>
                    </v-toolbar>
                    <v-divider></v-divider>
                    <apexchart ref="found_vs_missing" :height="320" type="bar" :stacked="true" :options="getOptions(['Found vs Missing'])" :series="getFoundMissingColumnChartData()"/>
                </v-card>
            </v-flex>
        </v-layout>
        <v-layout v-if="role !== 'organization_manager'">
            <v-flex xs12 sm12 md12 lg12 xl12 class="intro">
                <h2 style="margin-top: 20px; margin-left: 20px; color: #FFFFFF;">{{ $t('dashboard.title') }}</h2>
                <span v-if="role === 'case_manager'"
                      style="margin-left: 20px; color: #FFFFFF; font-size: large;">{{ $t('dashboard.cm_overview') }}</span>
                <span v-if="role === 'network_manager'"
                      style="margin-left: 20px; color: #FFFFFF; font-size: large;">{{ $t('dashboard.net_overview') }}</span>
                <span v-if="role === 'facility_manager'"
                      style="margin-left: 20px; color: #FFFFFF; font-size: large;">{{ $t('dashboard.fm_overview') }}</span>
                <!-- <span v-if="role === 'facility_manager'"
                      style="margin-left: 20px; color: #FFFFFF; font-size: large;">Overview of {{ getFacility.name }} facility</span> -->
            </v-flex>
        </v-layout>
        <v-layout class="intro-items" justify-center align-center wrap v-if="role === 'case_manager'">
            <v-flex xs11 sm3 class="intro-item1">
                <h4 style="font-size: large; color: #FFFFFF; margin-top: 5px; margin-left: 10px;">{{ $t('dashboard.cases') }}</h4>
                <v-icon large dark style="float: right; margin-top: 10px;">folder_open</v-icon>
                <div style="font-size: 40px; color: #FFFFFF; margin-top: 0px; margin-left: 10px;">{{ cases.length }}</div>
                <div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;">{{ $t('dashboard.active_cases') }}</div>
            </v-flex>
            <v-flex xs11 sm3 class="intro-item2">
                <h4 style="font-size: large; color: #FFFFFF; margin-top: 5px; margin-left: 10px;">{{ $t('dashboard.alerts') }}</h4>
                <v-icon large dark style="float: right; margin-top: 10px;">group</v-icon>
                <div style="font-size: 40px; color: #FFFFFF; margin-top: 0px; margin-left: 10px;">{{ alerts.length }}</div>
                <div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;">{{ $t('dashboard.active_alerts') }}
                </div>
            </v-flex>
            <v-flex xs11 sm3 class="intro-item3">
                <h4 style="font-size: large; color: #FFFFFF; margin-top: 5px; margin-left: 10px;">{{ $t('dashboard.facts') }}</h4>
                <v-icon large dark style="float: right; margin-top: 10px;">folder_shared</v-icon>
                <div style="font-size: 40px; color: #FFFFFF; margin-top: 0px; margin-left: 10px;">{{ feedbacks.length }}</div>
                <div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;">{{ $t('dashboard.total_facts') }}
                </div>
            </v-flex>
        </v-layout>
        <v-layout class="intro-items" justify-center align-center wrap v-if="role === 'network_manager'">
            <v-flex xs11 sm3 class="intro-item1">
                <h4 style="font-size: large; color: #FFFFFF; margin-top: 5px; margin-left: 10px;">{{ $t('dashboard.cases') }}</h4>
                <v-icon large dark style="float: right; margin-top: 10px;">folder_open</v-icon>
                <div style="font-size: 40px; color: #FFFFFF; margin-top: 0px; margin-left: 10px;">{{ cases.length }}</div>
                <div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;">{{ $t('dashboard.active_cases') }}</div>
            </v-flex>
            <v-flex xs11 sm3 class="intro-item2">
                <h4 style="font-size: large; color: #FFFFFF; margin-top: 5px; margin-left: 10px;">{{ $t('dashboard.active_volunteers') }}</h4>
                <v-icon large dark style="float: right; margin-top: 10px;">group</v-icon>
                <div style="font-size: 40px; color: #FFFFFF; margin-top: 0px; margin-left: 10px;">{{ activeVolunteers }}</div>
                <div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;">{{ $t('dashboard.all_cases') }}
                </div>
            </v-flex>
            <v-flex xs11 sm3 class="intro-item3">
                <h4 style="font-size: large; color: #FFFFFF; margin-top: 5px; margin-left: 10px;">{{ $t('dashboard.places') }}</h4>
                <v-icon large dark style="float: right; margin-top: 10px;">folder_shared</v-icon>
                <div style="font-size: 40px; color: #FFFFFF; margin-top: 0px; margin-left: 10px;">{{ numberOfPlaces }}</div>
                <div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;">{{ $t('dashboard.all_cases') }}
                </div>
            </v-flex>
        </v-layout>
        <v-layout class="intro-items" justify-center align-center wrap v-if="role === 'facility_manager'">
            <v-flex xs11 sm3 md3 lg3 class="intro-item1">
                <h4 style="font-size: large; color: #FFFFFF; margin-top: 5px; margin-left: 10px;">{{ $t('dashboard.hosted_children') }}</h4>
                <v-icon large dark style="float: right; margin-top: 10px;">folder_open</v-icon>
                <div style="font-size: 40px; color: #FFFFFF; margin-top: 0px; margin-left: 10px;">{{ facilityCases.length }}</div>
                <div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;">{{ $t('dashboard.in_facility') }}</div>
            </v-flex>
            <v-flex xs11 sm3 md3 lg3 class="intro-item3">
                <h4 style="font-size: large; color: #FFFFFF; margin-top: 5px; margin-left: 10px;">{{ $t('dashboard.missing_children') }}</h4>
                <v-icon large dark style="float: right; margin-top: 10px;">folder_shared</v-icon>
                <div style="font-size: 40px; color: #FFFFFF; margin-top: 0px; margin-left: 10px;">
                    {{ missingCases.length }}
                </div>
                <div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;">{{ $t('dashboard.missing_children_organization') }}
                </div>
            </v-flex>
            <v-flex xs11 sm3 md3 lg3 class="intro-item2">
                <h4 style="font-size: large; color: #FFFFFF; margin-top: 5px; margin-left: 10px;">{{ $t('dashboard.registry') }}</h4>
                <v-icon large dark style="float: right; margin-top: 10px;">group</v-icon>
                <div style="font-size: 40px; color: #FFFFFF; margin-top: 0px; margin-left: 10px;">{{ allCases.length }}</div>
                <div style="font-size: small; color: #FFFFFF; margin-top: -5px; margin-left: 10px;">{{ $t('dashboard.all_recorded') }}</div>
            </v-flex>
        </v-layout>
        <v-layout row wrap style="margin-top: 5px;">
            <v-flex xs12 sm12 md12 lg6 xl6 v-if="role === 'case_manager'">
                <v-card tile style="margin: 10px 15px 0px 15px;">
                    <v-card-title><h2>{{ $t('dashboard.active_cases_title') }}</h2></v-card-title>
                    <v-layout v-if="cases.length > 0" row wrap style="height: 515px; overflow: scroll;">
                        <v-flex xs12 sm6 md3 lg6 xl4 v-for="item in cases" :key="item.id" @click="loadCase(item)">
                            <v-card class="clickable_card" tile style="padding: 5px; margin: 5px 15px 5px 15px;">
                                <v-img :src="getImagePath(item.profile_photo)" height="165px" class="tile_background">
                                    <v-container fill-height fluid pa-2>
                                        <v-layout justify-space-between class="tile_background_tags">
                                            <v-flex v-if="item.amber_alert" class="tile_background_tag_left"><span
                                                style="background-color: red; padding: 5px; border-radius: 2px;">{{ $t('dashboard.amber_alert') }}</span>
                                            </v-flex>
                                            <v-flex v-if="item.status === 'closed'"
                                                    class="tile_background_tag_right"><span
                                                        style="background-color: green; padding: 5px; border-radius: 2px;">{{ item.status }}</span>
                                            </v-flex>
                                            <v-flex v-if="item.status === 'active'"
                                                    class="tile_background_tag_right"><span
                                                        style="background-color: #555; padding: 5px; border-radius: 2px;">{{ item.status }}</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-img>
                                <div
                                    style="text-align: left; font-size: medium; font-weight: bold; margin-top: 10px;">
                                    {{ item.first_name | title }} {{ item.last_name | title }}
                                </div>
                                <div style="text-align: left; color: #C0C0C0;">{{ $t('dashboard.missing_from') }}: <b>{{
                                    item.disappearance_date | formatDate }} </b>
                                </div>
                            </v-card>
                        </v-flex>
                    </v-layout>
                    <v-layout v-if="cases.length === 0" row wrap style="height: 515px; overflow: scroll;">
                        <v-flex xs12 style="background-color: #C3C3C3;">
                            <v-layout row wrap align-center justify-center fill-height>
                                <h3 style="margin-top: -20px;" class="display-1">{{ $t('dashboard.no_records') }}</h3>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs12 v-if="role === 'network_manager'">
                <v-card flat tile style="margin: 10px 15px 0px 15px;">
                    <v-card-title><h2>{{ $t('dashboard.active_cases_title') }}</h2></v-card-title>
                    <v-layout v-if="cases.length > 0" row wrap style="height: 515px; overflow: scroll;">
                        <v-flex  xs12 sm6 md3 v-for="item in cases" :key="item.id" @click="loadCase(item)">
                            <v-card class="clickable_card" tile style="padding: 5px; margin: 5px 15px 15px 15px;">
                                <v-img :src="getImagePath(item.profile_photo)" height="165px" class="tile_background">
                                    <v-container fill-height fluid pa-2>
                                        <v-layout justify-space-between class="tile_background_tags">
                                            <v-flex v-if="item.amber_alert" class="tile_background_tag_left"><span
                                                style="background-color: red; padding: 5px; border-radius: 2px;">{{ $t('dashboard.amber_alert') }}</span>
                                            </v-flex>
                                            <v-flex v-if="item.status === 'closed'"
                                                    class="tile_background_tag_right"><span
                                                        style="background-color: green; padding: 5px; border-radius: 2px;">{{ item.status }}</span>
                                            </v-flex>
                                            <v-flex v-if="item.status === 'active'"
                                                    class="tile_background_tag_right"><span
                                                        style="background-color: #555; padding: 5px; border-radius: 2px;">{{ item.status }}</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-img>
                                <div
                                    style="text-align: left; font-size: medium; font-weight: bold; margin-top: 10px;">
                                    {{ item.first_name | title }} {{ item.last_name | title }}
                                </div>
                                <div style="text-align: left; color: #C0C0C0;">{{ $t('dashboard.missing_from') }}: <b>{{
                                    item.disappearance_date | formatDate }} </b>
                                </div>
                            </v-card>
                        </v-flex>
                    </v-layout>
                    <v-layout v-if="cases.length === 0" row wrap style="height: 515px; overflow: scroll;">
                        <v-flex xs12 style="background-color: #C3C3C3;">
                            <v-layout row wrap align-center justify-center fill-height>
                                <h3 style="margin-top: -20px;" class="display-1">{{ $t('dashboard.no_records') }}</h3>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs12 sm12 md12 lg8 xl8 v-if="role === 'facility_manager'">
                <v-card flat tile style="margin: 10px 15px 0px 15px;">
                    <v-card-title><h2>{{ $t('dashboard.recently_arrived') }}</h2></v-card-title>
                    <v-layout row wrap style="min-height: 500px;">
                        <v-flex v-if="facilityCases.length > 0" xs12 sm6 md3 lg3 xl3 v-for="item in facilityCases" :key="item.id" @click="loadFacilityCase(item)">
                            <v-card class="clickable_card" tile style="padding: 5px; margin: 5px 15px 15px 15px;">
                                <v-img :src="getImagePath(item.profile_photo)" height="165px" class="tile_background">
                                    <v-container v-if="item.status==='active'" fill-height fluid pa-2>
                                        <v-layout justify-space-between class="tile_background_tags">
                                            <v-flex class="tile_background_tag_right_red">
                                                <span style="background-color: #555; padding: 5px; border-radius: 2px;">{{ $t('dashboard.missing') }}</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                    <v-container v-if="item.status==='inactive'&&item.presence_status=='present'" fill-height fluid pa-2>
                                        <v-layout justify-space-between class="tile_background_tags">
                                            <v-flex class="tile_background_tag_right_red">
                                                <span style="background-color: green; padding: 5px; border-radius: 2px;">{{ $t('dashboard.present') }}</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                    <v-container v-if="item.status==='inactive'&&item.presence_status=='not_present'" fill-height fluid pa-2>
                                        <v-layout justify-space-between class="tile_background_tags">
                                            <v-flex class="tile_background_tag_right_red">
                                                <span style="background-color: #2FD1D4; padding: 5px; border-radius: 2px;">{{ $t('dashboard.not_present') }}</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-img>
                                <div
                                    style="text-align: left; font-size: medium; font-weight: bold; margin-top: 10px;">
                                    {{ item.first_name | title }} {{ item.last_name | title }}
                                </div>
                                <div style="text-align: left; color: #C0C0C0;">{{ $t('dashboard.arrival_at') }}: <b>{{
                                    item.arrival_date | formatDate }} </b>
                                </div>
                            </v-card>
                        </v-flex>
                        <v-flex v-if="facilityCases.length === 0" xs12 sm12 md12 lg12 xl12 style="background-color: #C3C3C3;">
                            <v-layout row wrap align-center justify-center fill-height>
                                <h3 style="margin-top: -20px;" class="display-1">{{ $t('dashboard.no_children') }}</h3>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex v-if="role === 'case_manager'" xs12 sm12 md12 lg6 xl6>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card flat tile style="margin: 10px 15px 0px 15px; padding: 5px;">
                            <v-card-title><h2>{{ $t('dashboard.recent_alerts') }}</h2></v-card-title>
                            <v-layout v-if="latestAlerts.length > 0" row wrap style="min-height: 223px; margin-top: -10px;">
                                <v-flex>
                                    <v-list>
                                        <div v-for="(item, index) in latestAlerts" :key="item.id" @click="openAlert(item)">
                                            <v-list-tile style="height: 40px;">
                                                <v-list-tile-content>
                                                    <div :style="{color: getAlertColor(item.end), 'text-align': 'left', 'font-size': 'medium', 'font-weight': 'bold'}">
                                                        {{ $t('dashboard.case') }}: {{ item.case }} - {{ getRemainingHours(item.end) }}
                                                    </div>
                                                </v-list-tile-content>
                                                <v-list-tile-action>
                                                    <v-icon>keyboard_arrow_right</v-icon>
                                                </v-list-tile-action>
                                            </v-list-tile>
                                            <v-divider
                                                v-if="index < latestAlerts.length - 1"
                                                :key="index"
                                                :inset="false"
                                            ></v-divider>
                                        </div>
                                    </v-list>
                                </v-flex>
                            </v-layout>
                            <v-layout v-else row wrap align-center style="min-height: 223px; background-color: #C3C3C3;">
                                <v-flex>
                                    <v-layout row wrap align-center justify-center fill-height>
                                        <h3 style="margin-top: -20px;" class="display-1">{{ $t('dashboard.no_alerts') }}</h3>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                    <v-flex xs12>
                        <v-card flat tile style="margin: 10px 15px 10px 15px; padding: 5px;">
                            <v-card-title><h2>{{ $t('dashboard.recent_facts') }}</h2></v-card-title>
                            <v-layout v-if="latestFeedbacks.length > 0" row wrap style="min-height: 213px; margin-top: -10px;">
                                <v-flex>
                                    <v-list>
                                        <div v-for="(item, index) in latestFeedbacks" :key="item.id" @click="openFeedback(item)" >
                                            <v-list-tile style="height: 40px;">
                                                <v-list-tile-content>
                                                    <div :class="{ hasColor: index%2===0 }"
                                                         style="text-align: left; font-size: medium; font-weight: bold;">
                                                        {{ $t('dashboard.case') }}: {{ item.case }} - {{ $t('dashboard.created') }}: {{ item.created_at | formatDateTimeMinutes }} - {{ $t('dashboard.source') }}: {{ item.source }}
                                                    </div>
                                                </v-list-tile-content>
                                                <v-list-tile-action>
                                                    <v-icon>keyboard_arrow_right</v-icon>
                                                </v-list-tile-action>
                                            </v-list-tile>
                                            <v-divider
                                                v-if="index < latestFeedbacks.length - 1"
                                                :key="index"
                                                :inset="false"
                                            ></v-divider>
                                        </div>
                                    </v-list>
                                </v-flex>
                            </v-layout>
                            <v-layout v-else row wrap align-center style="min-height: 213px; background-color: #C3C3C3;">
                                <v-flex>
                                    <v-layout row wrap align-center justify-center fill-height>
                                        <h3 style="margin-top: -20px;" class="display-1">{{ $t('dashboard.no_facts') }}</h3>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex v-if="role === 'facility_manager'"  xs12 sm12 md12 lg4 xl4>
                <v-layout row wrap>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <v-card flat tile style="margin: 10px 15px 0px 15px;">
                            <v-card-title><h2>{{ $t('dashboard.missing_children') }}</h2></v-card-title>
                            <v-layout v-if="missingCases.length > 0" row wrap style="min-height: 500px;">
                                <v-flex>
                                    <v-list>
                                        <v-list-tile v-for="(item, index) in missingCases" :key="item.id" @click="loadFacilityCase(item)" style="height: 40px;">
                                            <v-list-tile-content>
                                                <div :class="{ hasColor: index%2===0 }"
                                                     style="text-align: left; font-size: medium; font-weight: bold;">{{ item.last_name | title }} {{ item.first_name | title }}, {{ $t('dashboard.since') }}: {{ item.disappearance_date | formatDateTimeMinutes }}
                                                </div>
                                            </v-list-tile-content>
                                            <v-list-tile-action>
                                                <v-icon large>keyboard_arrow_right</v-icon>
                                            </v-list-tile-action>
                                        </v-list-tile>
                                    </v-list>
                                </v-flex>
                            </v-layout>
                            <v-layout v-else row wrap align-center style="min-height: 500px; background-color: #C3C3C3;">
                                <v-flex>
                                    <v-layout row wrap align-center justify-center fill-height>
                                        <h3 style="margin-top: -20px;" class="display-1">{{ $t('dashboard.no_missing_children') }}</h3>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <div v-show="false"><alert></alert></div>
        <div v-show="false"><feedback></feedback></div>
    </div>
</template>

<script>
import { bus } from '../main';
import jsPDF from 'jspdf';
import { dates, fonts } from '@/utils/mixins';
import { CasesApi, AlertsApi, FeedbacksApi } from '@/api';
import Feedback from '@/components/Feedback.vue';
import Alert from '@/components/Alert.vue';

export default {
    components: {
        Alert,
        Feedback,
    },
    mixins: [dates, fonts],
    data() {
        return {
            startDate: null,
            startDateMenu: false,
            endDate: null,
            endDateMenu: false,
            activeVolunteers: '-',
            numberOfPlaces: '-',
            cases: [],
            facilityCases: [],
            missingCases: [],
            allCases: [],
            alerts: [],
            latestAlerts: [],
            feedbacks: [],
            latestFeedbacks: [],
            totalCases: 0,
            activeCases: 0,
            closedCases: 0,
            archivedCases: 0,
            count: 0,
            role: null,
            isLoaded: false,
        };
    },
    created() {
        let start = new Date();
        this.startDate = "2020-01-01";
        this.endDate = start.toISOString().split('T')[0];
        this.role = this.$store.state.role;
        console.log(this.role);
        this.loadActiveVolunteers();
        this.loadNumberOfPlaces();
        if (this.role === 'facility_manager') {
            this.loadFacilityCases();
        }
        if (this.role == 'case_manager' || this.role == 'network_manager') {
            this.loadCases();
        }
        if (this.role == 'organization_manager' || this.role == 'coordinator') {
            this.loadSelectedCases();
        }
    },
    methods: {
        getOptions(categories) {
            return {
                chart: {
                    toolbar: {
                        show: true,
                        tools: {
                            download: false,
                            selection: true,
                            zoom: true,
                            zoomin: false,
                            zoomout: false,
                            pan: false,
                            reset: true,
                        },
                    },
                },
                plotOptions: {
                    bar: {
                        columnWidth: '80%',
                    },
                },
                colors: ['#F29107', '#146E9A', '#00695C', '#7a9eff', '#3D2625', '#03C0FF', '#FFF8B7', '#FF3200'],
                dataLabels: {
                    enabled: false,
                },
                xaxis: {
                    categories: categories,
                },
                yaxis: {
                    formatter(value) {
                        value = Math.abs(value);
                        value = numeral(value).format('0a');
                        return `${value}`;
                    },
                },
                legend: {
                    position: 'bottom',
                    offsetY: -5,
                },
            };
        },
        async downloadPDF() {
            const doc = new jsPDF();
            doc.setFontType('bold');
            doc.text(`Dashboard Stats`, 10, 10);
            doc.setFontType('normal');
            doc.text(`From: ${this.startDate} To: ${this.endDate}`, 10, 20);
            doc.text(`Total cases: ${this.totalCases}`, 10, 27);
            doc.text(`Active cases: ${this.activeCases}`, 54, 27);
            doc.text(`Closed cases: ${this.closedCases}`, 104, 27);
            doc.text(`Archived cases: ${this.archivedCases}`, 154, 27);
            var dataURL = await this.$refs.gender.dataURI();
            doc.addImage(dataURL.imgURI, 'PNG', 30, 30);
            var dataURL = await this.$refs.nationality.dataURI();
            doc.addImage(dataURL.imgURI, 'PNG', 30, 120);
            var dataURL = await this.$refs.age.dataURI();
            doc.addImage(dataURL.imgURI, 'PNG', 30, 210);
            doc.addPage();
            var dataURL = await this.$refs.disappearance_type.dataURI();
            doc.addImage(dataURL.imgURI, 'PNG', 30, 0);
            var dataURL = await this.$refs.disappearance_reasons.dataURI();
            doc.addImage(dataURL.imgURI, 'PNG', 30, 90);
            var dataURL = await this.$refs.found_vs_missing.dataURI();
            doc.addImage(dataURL.imgURI, 'PNG', 30, 180);
            doc.save("dashboard.pdf");
        },
        getGenderColumnChartData() {
            let males = 0;
            let females = 0;
            for (let caseObject of this.cases) {
                if (caseObject.gender === 'male') {
                    males += 1;
                } else {
                    females += 1;
                }
            }
            return [
                {name: 'male', data: [males]},
                {name: 'female', data: [females]}
            ];
        },
        getRefugeeColumnChartData() {
            let refugee = 0;
            let local = 0;
            for (let caseObject of this.cases) {
                if (caseObject.is_refugee === 'yes') {
                    refugee += 1;
                } else {
                    local += 1;
                }
            }
            return [
                {name: 'refugee', data: [refugee]},
                {name: 'local', data: [local]}
            ];
        },
        getAgeGroupsColumnChartData() {
            let low = 0;
            let medium = 0;
            let high = 0;
            for (let caseObject of this.cases) {
                let birthday = new Date(caseObject.date_of_birth)
                let today = new Date()
                let years = today.getFullYear()-birthday.getFullYear();

                if (years >= 0 && years < 6) {
                    low += 1;
                } else if (years >= 6 && years < 12) {
                    medium += 1;
                } else {
                    high += 1;
                }
            }
            return [
                {name: '0-6', data: [low]},
                {name: '6-12', data: [medium]},
                {name: '12-18', data: [high]}
            ];
        },
        getDisappearanceTypeColumnChartData() {
            let runaway = 0;
            let parental_abduction = 0;
            let lost = 0;
            let missing = 0;
            let third_party_abduction = 0;
            let unknown = 0;
            for (let caseObject of this.cases) {
                if (caseObject.disappearance_type === 'runaway') {
                    runaway += 1;
                }
                if (caseObject.disappearance_type === 'parental_abduction') {
                    parental_abduction += 1;
                }
                if (caseObject.disappearance_type === 'lost') {
                    lost += 1;
                }
                if (caseObject.disappearance_type === 'missing') {
                    missing += 1;
                }
                if (caseObject.disappearance_type === 'third_party_abduction') {
                    third_party_abduction += 1;
                }
                if (caseObject.disappearance_type === 'third_party_abduction') {
                    third_party_abduction += 1;
                }
                if (caseObject.disappearance_type === null || caseObject.disappearance_type === undefined || caseObject.disappearance_type === 'unknown') {
                    unknown += 1;
                }
            }
            return [
                {name: 'Runaway', data: [runaway]},
                {name: 'Parental Abduction', data: [parental_abduction]},
                {name: 'Lost', data: [lost]},
                {name: 'Missing', data: [missing]},
                {name: 'Third Party Abduction', data: [third_party_abduction]},
                {name: 'Unknown', data: [unknown]},
            ];
        },
        getDisappearanceReasonsColumnChartData() {
            let family_issues = 0;
            let personal_issues = 0;
            let love_affair = 0;
            let health_issues = 0;
            let mass_disaster = 0;
            let migration = 0;
            let other = 0;
            let unknown = 0;
            for (let caseObject of this.cases) {
                if (caseObject.disappearance_reasons === 'family_issues') {
                    family_issues += 1;
                }
                if (caseObject.disappearance_reasons === 'personal_issues') {
                    personal_issues += 1;
                }
                if (caseObject.disappearance_reasons === 'love_affair') {
                    love_affair += 1;
                }
                if (caseObject.disappearance_reasons === 'health_issues') {
                    health_issues += 1;
                }
                if (caseObject.disappearance_reasons === 'mass_disaster') {
                    mass_disaster += 1;
                }
                if (caseObject.disappearance_reasons === 'migration') {
                    migration += 1;
                }
                if (caseObject.disappearance_reasons === 'other') {
                    other += 1;
                }
                if (caseObject.disappearance_reasons === null || caseObject.disappearance_reasons === undefined || caseObject.disappearance_reasons === 'unknown') {
                    unknown += 1;
                }
            }
            return [
                {name: 'Family Issues', data: [family_issues]},
                {name: 'Personal Issues/Bullying', data: [personal_issues]},
                {name: 'Love Affair', data: [love_affair]},
                {name: 'Health Issues', data: [health_issues]},
                {name: 'Mass Disaster', data: [mass_disaster]},
                {name: 'Migration', data: [migration]},
                {name: 'Other', data: [other]},
                {name: 'Unknown', data: [unknown]},
            ];
        },
        getFoundMissingColumnChartData() {
            let found = 0;
            let missing = 0;
            for (let caseObject of this.cases) {
                if (caseObject.end_date != null) {
                    found += 1;
                } else {
                    missing += 1;
                }
            }
            return [
                {name: 'Found', data: [found]},
                {name: 'Missing', data: [missing]}
            ];
        },
        loadCase(caseObject) {
            this.$router.push({
                name: 'case',
                params: { id: caseObject.id },
            });
        },
        loadFacilityCase(facilityCaseObject) {
            this.$router.push({
                name: 'case',
                params: { id: facilityCaseObject.id },
            });
        },
        getImagePath(path) {
            if (path === null) {
                return require('../assets/images/default_photo.png');
            }
            return path;
        },
        async loadActiveVolunteers() {
            if (this.$store.state.token !== null) {
                const { data: activeVolunteers } = await CasesApi.getActiveVolunteers();
                this.activeVolunteers = activeVolunteers;
            }
        },
        async loadNumberOfPlaces() {
            if (this.$store.state.token !== null) {
                const { data: numberOfPlaces } = await CasesApi.getNumberOfPlaces();
                this.numberOfPlaces = numberOfPlaces;
            }
        },
        async loadFacilityCases() {
            if (this.$store.state.token !== null) {
                const { data: facilityCases } = await CasesApi.getFacilityCases();
                this.facilityCases = facilityCases;
                const { data: missingCases } = await CasesApi.all({ is_active: true });
                this.missingCases = missingCases;
                const { data: allCases } = await CasesApi.all();
                this.allCases = allCases;
            }
            this.isLoaded = true;
        },
        async loadCases() {
            if (this.$store.state.token !== null) {
                const { data: cases } = await CasesApi.all({ is_active: true });
                this.cases = cases;
                const { data: feedbacks } = await FeedbacksApi.all();
                this.feedbacks = feedbacks;
                const { data: alerts } = await AlertsApi.all({ is_active: true });
                this.alerts = alerts;
                const { data: latestAlerts } = await AlertsApi.latest();
                this.latestAlerts = latestAlerts;
                const { data: latestFeedbacks } = await FeedbacksApi.latest();
                this.latestFeedbacks = latestFeedbacks;
            }
            this.isLoaded = true;
        },
        async loadSelectedCases() {
            if (this.$store.state.token !== null) {
                const { data: cases } = await CasesApi.dashboard({ start_date: this.startDate, end_date: this.endDate });
                this.cases = cases;
            }
            this.totalCases = 0;
            this.activeCases = 0;
            this.closedCases = 0;
            this.archivedCases = 0;
            for (let caseObject of this.cases) {
                this.totalCases += 1;
                if (caseObject.status === 'active') {
                    this.activeCases += 1;
                }
                if (caseObject.status === 'closed') {
                    this.closedCases += 1;
                }
                if (caseObject.status === 'archived') {
                    this.archivedCases += 1;
                }
            }
            this.isLoaded = true;
        },
        openAlert(item) {
            bus.$emit('view-alert-dialog-event', item);
        },
        openFeedback(item) {
            bus.$emit('view-feedback-dialog-event', item);
        },
        getRemainingHours(end) {
            if (Date.parse(end) - Date.now() > 0) {
                const hours = Math.abs(Date.parse(end) - Date.now()) / 36e5;
                return `${this.$t('dashboard.ends')}: ${Math.round(hours)} ${this.$t('dashboard.hours')}`;
            }
            return `${this.$t('dashboard.ended')}`;
        },
        getAlertColor(end) {
            if (Date.parse(end) - Date.now() > 0) {
                return 'red';
            }
            return 'green';
        },
    },
};
</script>

<style scoped>
    .intro {
        background-color: #A4A4A4;
        height: 200px;
    }

    .intro-items {
        margin-top: -100px;
    }

    .intro-item1 {
        background-color: #B3D28B;
        padding: 10px;
        max-width: 335px;
        height: 140px;
        margin-top: 10px;
        margin-left: 2%;
        margin-right: 2%;
    }

    .intro-item2 {
        background-color: #3B5998;
        padding: 10px;
        max-width: 335px;
        height: 140px;
        margin-top: 10px;
        margin-left: 2%;
        margin-right: 2%;
    }

    .intro-item3 {
        background-color: #F4B350;
        padding: 10px;
        max-width: 335px;
        height: 140px;
        margin-top: 10px;
        margin-left: 2%;
        margin-right: 2%;
    }

    .tile_background {
        height: 165px;
        background-color: #C3C3C3;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    .tile_background_tags {
        position: relative;
        top: calc(100% - 30px);
        padding: 5px;
    }

    .tile_background_tag_left {
        color: #ffffff;
        font-weight: bold;
        text-align: left;
    }

    .tile_background_tag_right {
        color: #ffffff;
        font-weight: bold;
        text-align: right;
    }

    .tile_background_tag_right_red {
        color: white;
        font-weight: bold;
        text-align: right;
    }

    .clickable_card:hover .tile_background {
        transform: scale(1.02);
    }

    .clickable_card:hover {
        cursor: pointer;
    }

    .hasColor {
        color: cornflowerblue;
    }

    .dateFilter {
        margin-top: 10px;
        margin-left: 5px;
        margin-right: 15px;
    }
</style>
