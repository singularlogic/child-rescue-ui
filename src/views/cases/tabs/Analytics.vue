<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded" style="padding: 10pt;">
        <v-card flat class="mt-2">
            <v-card-title class="headline ml-4">
                Stats
            </v-card-title>
            <v-card-text>
                <v-layout v-if="caseObject.status === 'active'" row wrap align-center justify-spacee-between fill-height style="padding:5px;">
                    <v-flex xs12 sm12 md4 style="padding: 5px;">
                        <span class="name">Missing UAM:</span>&nbsp;<span class="value">{{ uam }}% </span>
                    </v-flex>
                    <v-flex xs12 sm12 md6 lg5 style="padding: 5px;">
                        <span class="name">Lost, Injured or Otherwise Missing:</span>&nbsp;<span class="value">{{ lost }}% </span>
                    </v-flex>
                    <v-flex xs12 sm12 md3 style="padding: 5px;">
                        <span class="name">Runaway:</span>&nbsp;<span class="value">{{ runaway }}% </span>
                    </v-flex>
                    <v-flex xs12 sm12 md4 style="padding: 5px;">
                        <span class="name">Parental Abduction:</span>&nbsp;<span class="value">{{ parental }}% </span>
                    </v-flex>
                    <v-flex xs12 sm12 md4 style="padding: 5px;">
                        <span class="name">Third Party Abduction:</span>&nbsp;<span class="value">{{ thirdparty || 0 }}% </span>
                    </v-flex>
                </v-layout>
                <v-layout v-if="caseObject.status === 'inactive'" row wrap align-center justify-spacee-between fill-height style="padding:5px;">
                    <v-flex xs12 style="padding: 5px;">
                        <span class="name">Go Missing Probility:</span>&nbsp;<span class="value">{{ gomissing_prob }}% </span>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
        <v-card flat class="mt-2">
            <v-card-title class="headline ml-4">
                Number of Facts
            </v-card-title>
            <v-card-text>
                <div style="text-align:center; margin-bottom:10pt;">
                    <v-btn-toggle
                        v-model="feedbackCountGroup"
                        @change="loadFeedbackCount()"
                        mandatory
                    >
                        <v-btn value="day">
                            Day
                        </v-btn>
                        <v-btn value="week">
                            Week
                        </v-btn>
                        <v-btn value="month">
                            Month
                        </v-btn>
                    </v-btn-toggle>
                </div>
                <apexchart
                    height="400"
                    type="line"
                    :options="feedbackCountOptions"
                    :series="feedbackCountData">
                </apexchart>
            </v-card-text>
        </v-card>
        <v-card flat class="mt-2">
            <v-card-title class="headline ml-4">
                Number of Alerts
            </v-card-title>
            <v-card-text>
                <div style="text-align:center; margin-bottom:10pt;">
                    <v-btn-toggle
                        v-model="alertCountGroup"
                        @change="loadAlertCount()"
                        mandatory
                    >
                        <v-btn value="day">
                            Day
                        </v-btn>
                        <v-btn value="week">
                            Week
                        </v-btn>
                        <v-btn value="month">
                            Month
                        </v-btn>
                    </v-btn-toggle>
                </div>
                <apexchart
                    v-if="alertCountData[0].data.length > 0"
                    height="400"
                    type="line"
                    :options="alertCountOptions"
                    :series="alertCountData">
                </apexchart>
                <v-parallax v-else dark style="background-color: #C3C3C3;">
                    <v-layout align-center column justify-center>
                        <h1 class="display-2 font-weight-thin mb-3">No data to show!</h1>
                        <h4 class="subheading">Check if there are alerts in this case...</h4>
                    </v-layout>
                </v-parallax>
            </v-card-text>
        </v-card>
        <v-card flat class="mt-2">
            <v-card-title class="headline ml-4">
                Area Covered by Alerts
            </v-card-title>
            <v-card-text>
                <apexchart
                    v-if="alertAreaCoveredData[0].data.length > 1"
                    height="400"
                    type="area"
                    :options="alertAreaCoveredOptions"
                    :series="alertAreaCoveredData">
                </apexchart>
                <v-parallax v-else dark style="background-color: #C3C3C3;">
                    <v-layout align-center column justify-center>
                        <h1 class="display-2 font-weight-thin mb-3">No data to show!</h1>
                        <h4 class="subheading">Check if there are alerts in this case...</h4>
                    </v-layout>
                </v-parallax>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import { dates, filters, fonts } from '@/utils/mixins';
import { CasesApi, AnalyticsApi } from '@/api';


export default {
    name: 'Analytics',
    components: {
        apexchart: VueApexCharts,
    },
    mixins: [dates, filters, fonts],
    props: {
        id: { type: [String, Number], required: true },
    },
    data() {
        return {
            caseObject: {},
            uam: null,
            lost: null,
            runaway: null,
            parental: null,
            thirdparty: null,
            gomissing_prob: null,
            isLoaded: false,
            caseId: null,
            feedbackCountGroup: 'day',
            feedbackCountData: [],
            feedbackCountOptions: {},
            alertCountGroup: 'day',
            alertCountData: [],
            alertCountOptions: {},
            alertAreaCoveredData: [],
            alertAreaCoveredOptions: {
                dataLabels: {
                    enabled: false,
                    formatter(val) {
                        return val.toFixed(2);
                    },
                    offsetY: -2,
                    style: {
                        fontSize: '13px',
                        colors: ['#304758'],
                    },
                },
                xaxis: {
                    title: {
                        text: 'Date',
                        style: {
                            fontSize: '13px',
                        },
                    },
                    type: 'datetime',
                    categories: [],
                },
                yaxis: {
                    min: 0,
                    title: {
                        text: 'Area Covert (km2)',
                        style: {
                            fontSize: '13px',
                        },
                    },
                    labels: {
                        formatter(val) {
                            return val.toFixed(2);
                        },
                    },
                },
            },
        };
    },
    async created() {
        this.caseId = this.$route.params.id;
        await this.loadAnalytics();
        this.isLoaded = true;
    },
    methods: {
        async loadAnalytics() {
            await this.loadCase();
            await this.loadFeedbackCount();
            await this.loadAlertCount();
            await this.loadAlertAreaCovered();
        },
        async loadCase() {
            const { data: caseObject } = await CasesApi.get(this.caseId);
            this.caseObject = caseObject;
            console.log('YUOJ');
            console.log(caseObject);
            this.uam = (caseObject.data.profiling.missing_type.uam * 100).toFixed(2);
            this.lost = (caseObject.data.profiling.missing_type.lost * 100).toFixed(2);
            this.runaway = (caseObject.data.profiling.missing_type.runaway * 100).toFixed(2);
            this.parental = (caseObject.data.profiling.missing_type.parental * 100).toFixed(2);
            this.thirdparty = (caseObject.data.profiling.missing_type.thirdparty * 100).toFixed(2);
            this.gomissing_prob = (caseObject.data.profiling.gomissing_prob * 100).toFixed(2);
        },
        async loadFeedbackCount() {
            const groupBy = this.feedbackCountGroup;
            const { data: feedbackCountObject } = await AnalyticsApi.feedbackCount({ caseId: this.caseId, groupBy });
            const feedbackDates = feedbackCountObject.counts.map(feedback => feedback.date_field);
            const feedbackCounts = feedbackCountObject.counts.map(feedback => feedback.count);
            const len = feedbackCounts.length;
            const { average } = feedbackCountObject;
            const avg = new Array(len);
            for (let i = 0; i < len; i += 1) {
                avg[i] = average;
            }
            let columnWidth = '30%';
            if (groupBy === 'day') {
                columnWidth = '95%';
            }
            this.updateFeedbackCountOptions(feedbackDates, average, columnWidth);
            this.feedbackCountData = [{ name: 'Fact Count', type: 'column', data: feedbackCounts }, { name: 'Average', type: 'line', data: avg }];
        },
        async loadAlertCount() {
            const groupBy = this.alertCountGroup;
            const { data: alertCountObject } = await AnalyticsApi.alertCount({ caseId: this.caseId, groupBy });
            const alertDates = alertCountObject.counts.map(alert => alert.date_field);
            const alertCounts = alertCountObject.counts.map(alert => alert.count);
            const len = alertCounts.length;
            const { average } = alertCountObject;
            const avg = new Array(len);
            for (let i = 0; i < len; i += 1) {
                avg[i] = average;
            }
            let columnWidth = '30%';
            if (groupBy === 'day') {
                columnWidth = '95%';
            }
            this.updateAlertCountOptions(alertDates, average, columnWidth);
            this.alertCountData = [{ name: 'Alert Count', type: 'column', data: alertCounts }, { name: 'Average', type: 'line', data: avg }];
            console.log(this.alertCountData);
            console.log(this.alertCountData[0].data.length);
        },
        async loadAlertAreaCovered() {
            const { data: alertAreaCoveredObject } = await AnalyticsApi.alertAreaCovered({ caseId: this.caseId });
            const alertDates = alertAreaCoveredObject.map(alert => alert.date);
            const alertAreas = alertAreaCoveredObject.map(alert => alert.area);
            this.alertAreaCoveredOptions.xaxis.categories = alertDates;
            this.alertAreaCoveredData = [{ name: 'Area', data: alertAreas }];
        },
        updateFeedbackCountOptions(labels, average, columnWidth) {
            this.feedbackCountOptions = {
                colors: ['#ffa500', '#229dd0'],
                legend: {
                    position: 'top',
                },
                grid: {
                    borderColor: '#e7e7e7',
                    row: {
                        colors: ['#f3f3f3', 'transparent'],
                        opacity: 0.5,
                    },
                },
                plotOptions: {
                    bar: {
                        columnWidth,
                        dataLabels: {
                            position: 'center', // top, center, bottom
                        },
                    },
                },
                dataLabels: {
                    enabled: true,
                    enabledOnSeries: [0],
                    formatter(val) {
                        const percentage = ((val - average) / average * 100).toFixed(0);
                        return `${percentage}%`;
                    },
                    offsetY: -2,
                    style: {
                        fontSize: '13px',
                        colors: ['#304758'],
                    },
                },
                xaxis: {
                    title: {
                        text: 'Date',
                        style: {
                            fontSize: '13px',
                        },
                    },
                    type: 'datetime',
                    categories: labels,
                },
                yaxis: {
                    min: 0,
                    labels: {
                        formatter(val) {
                            return val.toFixed(2);
                        },
                    },
                    title: {
                        text: 'Number of facts',
                        style: {
                            fontSize: '13px',
                        },
                    },
                },
                markers: {
                    size: 5,
                    fillOpacity: 0.5,
                },
                stroke: {
                    width: 3,
                    // curve: 'smooth',
                },
            };
        },
        updateAlertCountOptions(labels, average, columnWidth) {
            this.alertCountOptions = {
                colors: ['#ffa500', '#229dd0'],
                legend: {
                    position: 'top',
                },
                grid: {
                    borderColor: '#e7e7e7',
                    row: {
                        colors: ['#f3f3f3', 'transparent'],
                        opacity: 0.5,
                    },
                },
                plotOptions: {
                    bar: {
                        columnWidth,
                        dataLabels: {
                            position: 'center', // top, center, bottom
                        },
                    },
                },
                dataLabels: {
                    enabled: true,
                    enabledOnSeries: [0],
                    formatter(val) {
                        const percentage = ((val - average) / average * 100).toFixed(0);
                        return `${percentage}%`;
                    },
                    offsetY: -2,
                    style: {
                        fontSize: '13px',
                        colors: ['#304758'],
                    },
                },
                xaxis: {
                    title: {
                        text: 'Date',
                        style: {
                            fontSize: '13px',
                        },
                    },
                    type: 'datetime',
                    categories: labels,
                },
                yaxis: {
                    min: 0,
                    labels: {
                        formatter(val) {
                            return val.toFixed(2);
                        },
                    },
                    title: {
                        text: 'Number of alerts',
                        style: {
                            fontSize: '13px',
                        },
                    },
                },
                markers: {
                    size: 5,
                    fillOpacity: 0.5,
                },
                stroke: {
                    width: 3,
                    // curve: 'smooth',
                },
            };
        },
    },
};
</script>

<style scoped>
.textField {
    padding: 5px 15px;
}
.name {
    font-size: 20px;
    color: cornflowerblue;
}
.value {
    font-size: 20px;
    color: coral;
}
</style>
