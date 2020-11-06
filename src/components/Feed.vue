<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded">
        <v-card flat class="ml-2" style="background-color: transparent;">
            <v-layout v-if="posts.length > 0" fill-height row wrap align-start justify-center style="max-height:850px; overflow-y: scroll;">
                <v-flex v-for="(item) in posts" :key="item.id" xs12>
                    <post :post-object="item"></post>
                </v-flex>
            </v-layout>
            <v-parallax v-else dark style="background-color: #C3C3C3; height:850px;">
                <v-layout align-center column justify-center>
                    <h1 class="display-2 font-weight-thin mb-3">{{ $t('feed.case_feed') }}</h1>
                    <h4 class="subheading">{{ $t('feed.no_post') }}</h4>
                </v-layout>
            </v-parallax>
        </v-card>
        <v-dialog v-model="createPostDialog" scrollable width="850">
            <v-card>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <span>{{ $t('feed.create_post_title') }}</span>
                        <v-spacer></v-spacer>
                        <div style="font-size: 14px;">{{ $t('case.required_fields') }}</div>
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text class="mt-0 pt-0">
                    <v-form ref="postForm" v-model="valid" lazy-validation @submit.prevent>
                        <v-layout row wrap>
                            <v-flex xs12 class='px-2'>
                                <v-select :items="tags" v-model="post.tag" :label="$t('feed.select_tag')" :hint="$t('feed.select_tag')" persistent-hint prepend-icon="label"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs12 class='px-2 my-2'>
                                <v-textarea ref="descriptionField"
                                            autofocus counter flat
                                            v-model="post.description"
                                            box :placeholder="$t('feed.description')"
                                            :hint="$t('feed.description')"
                                            persistent-hint
                                            prepend-icon="description">
                                </v-textarea>
                            </v-flex>
                            <v-flex xs12 class='px-2'>
                                <v-text-field
                                    v-model="imageName"
                                    :label="$t('feed.image')"
                                    :value="post.image"
                                    :placeholder="$t('feed.image_placeholder')"
                                    class="header-text-field-input"
                                    color="secondary"
                                    prepend-icon="insert_photo"
                                    @click="pickImage"
                                />
                                <input
                                    ref="image"
                                    type="file"
                                    style="display: none"
                                    accept="image/*"
                                    @change="setImage"
                                />
                                <v-img v-if="post.image" id="avatar" :src="getLogo" alt="avatar" contain class="my-0 ml-4"></v-img>
                            </v-flex>
                            <v-flex xs12 sm10 class='pl-2 pr-2'>
                                <v-text-field
                                    ref="addressField"
                                    v-model="address"
                                    :label="$t('feed.address')"
                                    :hint="$t('feed.address_hint')"
                                    persistent-hint
                                    prepend-icon="pin_drop"
                                    class="textField"
                                    @keyup.enter.native="triggerPlaceChangeEvent()"/>
                            </v-flex>
                            <v-flex xs12 sm2 class='my-2'>
                                <v-btn dark color="primary" @click="triggerPlaceChangeEvent()">{{ $t('feed.find_address') }}</v-btn>
                            </v-flex>
                            <v-flex v-if="showMap" xs12 class="mt-3 mb-2 mx-1">
                                <v-text-field v-model="post.radius" suffix="km"
                                              :label="$t('feed.radius') " placeholder="Set radius in km"
                                              :hint="$t('feed.radius_placeholder')"
                                              style="padding: 5px;"
                                              prepend-icon="360"
                                              @input="triggerPlaceChangeEvent()"
                                ></v-text-field>
                            </v-flex>
                            <v-flex v-if="showMap" xs12 class="mx-2 mb-2">
                                <gmap-map :center="center" :zoom="18" :options="mapOptions"
                                          style="width:100%;  height: 280px; margin-bottom: 5px;">
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
                    <v-btn color="" flat @click="closeCreatePostDialog()">{{ $t('feed.close') }}</v-btn>
                    <v-btn :disabled="isPostValid()" color="primary" flat @click="validateAdmins()">{{ $t('feed.send_admins')  }}</v-btn>
                    <v-btn :disabled="isPostValid()" color="primary" flat @click="validateVolunteers()">{{ $t('feed.send_volunteers')  }}</v-btn>
                    <v-btn :disabled="isPostValid()" color="primary" flat @click="validateSelected()">{{ $t('feed.send_selected')  }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="selectVolunteersDialog" width="800">
            <v-card>
                <v-toolbar flat>
                    <v-toolbar-title class="mt-3">{{ $t('volunteers.select_volunteer') }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="dialogSearch"
                        prepend-icon="search"
                        clearable
                        :label="$t('volunteers.search')"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-toolbar>
                <v-data-table select-all :headers="volunteerHeaders" :items="volunteers" v-model="selected" :search="dialogSearch" :pagination.sync="pagination"
                              item-key="email"
                              class="elevation-1">
                    <template v-slot:headers="props">
                        <tr>
                            <th>
                                <v-checkbox
                                    :input-value="props.all"
                                    :indeterminate="props.indeterminate"
                                    primary
                                    hide-details
                                    @click.stop="toggleAll"
                                ></v-checkbox>
                            </th>
                            <th
                                v-for="header in props.headers"
                                :key="header.text"
                                :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                @click="changeSort(header.value)" class="text-xs-left"
                            >
                                <v-icon small>arrow_upward</v-icon>
                                {{ header.text }}
                            </th>
                        </tr>
                    </template>
                    <template v-slot:items="props">
                        <tr :active="props.selected" @click="props.selected = !props.selected">
                            <td>
                                <v-checkbox
                                    :input-value="props.selected"
                                    primary
                                    hide-details
                                ></v-checkbox>
                            </td>
                            <td class="text-xs-left">{{ props.item.email }}</td>
                            <td class="text-xs-left">{{ props.item.city || ' - ' | title }}</td>
                            <td class="text-xs-left">{{ props.item.team_name || ' - ' | title }}</td>
                            <td class="text-xs-left">{{ props.item.first_name || ' - ' | title }}</td>
                            <td class="text-xs-left">{{ props.item.last_name || ' - ' | title }}</td>
                        </tr>
                    </template>
                    <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                        {{ $t('volunteers.no_results') }}
                    </v-alert>
                </v-data-table>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="selectVolunteersDialog = false;">{{ $t('volunteers.close') }}</v-btn>
                    <v-btn flat color="primary" @click="sendToVolunteers()">{{ $t('volunteers.notify') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { bus } from '../main';
import * as R from 'ramda';
import { dates, filters, fonts } from '@/utils/mixins';
import Post from '@/components/Post.vue';
import { CasesApi } from '@/api';
import { SET_SNACKBAR_STATUS } from '@/store/mutation-types';


export default {
    components: {
        post: Post,
    },
    mixins: [dates, filters, fonts],
    data() {
        return {
            pagination: {
                sortBy: 'email',
            },
            selected: [],
            volunteers: [],
            volunteerHeaders: [
                {
                    text: 'Email',
                    value: 'email',
                    width: '20%',
                    align: 'left',
                },
                {
                    text: this.$t('volunteers.city'),
                    value: 'city',
                    width: '20%',
                    align: 'left',
                },
                {
                    text: this.$t('volunteers.team'),
                    value: 'team_name',
                    width: '20%',
                    align: 'left',
                },
                {
                    text: this.$t('volunteers.first_name'),
                    value: 'first_name',
                    width: '20%',
                    align: 'left',
                },
                {
                    text: this.$t('volunteers.last_name'),
                    value: 'last_name',
                    width: '20%',
                    align: 'left',
                },
            ],
            dialogSearch: '',
            selectVolunteersDialog: false,
            feedReload: true,
            tag: null,
            // isVisibleToVolunteers: true,
            tags: [
                {
                    text: this.$t('feed.announcement'),
                    value: 'announcement',
                },
                {
                    text: this.$t('feed.task'),
                    value: 'task',
                },
                {
                    text: this.$t('feed.fact'),
                    value: 'fact',
                },
                {
                    text: this.$t('feed.general'),
                    value: 'general',
                },
            ],
            hasMap: false,
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
            imageName: null,
            createPostDialog: false,
            post: { radius: 2 },
            posts: [],
            timeoutFun: null,
            caseId: null,
            caseObject: {},
            isLoaded: false,
            imageUrl: require('../assets/images/file_ic.png'),
            rules: {
                required: value => !!value || this.$t('feed.rules_required'),
            },
        };
    },
    computed: {
        getLogo: {
            get() {
                if (['', null, undefined].includes(this.post.image) || this.post.image instanceof FormData) {
                    return this.imageUrl;
                }
                return this.post.image;
            },
        },
        getPostType: {
            get() {
                if (this.hasMap) {
                    return this.$t('feed.location_post');
                }
                return this.$t('feed.image_post');
            },
        },
        ...mapGetters(['refreshFeed']),
    },
    async created() {

        bus.$off('create-post-event');
        bus.$on('create-post-event', () => {
            this.openCreatePostDialog();
        });

        this.caseId = this.$route.params.id;
        await this.loadFeed();
        await this.loadVolunteers();
        const { data: caseObject } = await CasesApi.get(this.caseId);
        this.caseObject = caseObject;
        this.isLoaded = true;
        this.reloadFeed();
    },
    async destroyed () {
        await clearTimeout(this.timeoutFun);
    },
    async beforeDestroy() {
        await clearTimeout(this.timeoutFun);
        // this.$nextTick(() => {
        //     this.$nextTick(() => {
        //         clearTimeout(this.timeoutFun);
        //     });
        // });
    },
    methods: {
        toggleAll() {
            if (this.selected.length) this.selected = [];
            else this.selected = this.volunteers.slice();
        },
        changeSort(column) {
            if (this.pagination.sortBy === column) {
                this.pagination.descending = !this.pagination.descending;
            } else {
                this.pagination.sortBy = column;
                this.pagination.descending = false;
            }
        },
        async loadVolunteers() {
            const { data: volunteers } = await CasesApi.getVolunteers(this.caseId);
            this.volunteers = volunteers;
        },
        sendToVolunteers() {
            this.savePost(false, this.selected);
        },
        async reloadFeed() {
            if (this.$store.state.token === null || this.refreshFeed === false) clearTimeout(this.timeoutFun);
            else {
                await this.loadFeed();
                this.timeoutFun = setTimeout(this.reloadFeed, 5000);
            }
        },
        clearPost() {
            this.post.image = null;
            this.imageName = null;
            this.showMap = false;
        },
        async loadFeed() {
            const { data: posts } = await CasesApi.getFeed(this.caseId);
            this.posts = posts;
        },
        isPostValid() {
            if (this.post.description === '' || this.post.description === null || this.post.description === undefined || this.post.tag === null || this.post.tag === undefined) {
                return true;
            }
            return false;
        },
        validateAdmins() {
            if (this.$refs.postForm.validate() && (this.post.description || this.post.latitude || this.post.image)) {
                this.savePost(false);
            }
        },
        validateVolunteers() {
            if (this.$refs.postForm.validate() && (this.post.description || this.post.latitude || this.post.image)) {
                this.savePost(true);
            }
        },
        validateSelected() {
            if (this.$refs.postForm.validate() && (this.post.description || this.post.latitude || this.post.image)) {
                this.resetSelectVolunteer();
                this.selectVolunteersDialog = true;
            }
        },
        reset() {
            this.$refs.postForm.reset();
            this.uploadType = 'file';
            if (this.$refs.image) {
                this.$refs.image.value = '';
            }
            this.clearPost();
        },
        resetSelectVolunteer() {
            this.selected = [];
        },
        openCreatePostDialog() {
            this.reset();
            this.createPostDialog = true;
            this.post = { radius: 2 };
        },
        triggerPlaceChangeEvent() {
            if (this.address && this.address != null && this.address.length >= 3) {
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ address: this.address }, (results, status) => {
                    if (status !== 'OK' || !results[0]) {
                        this.showMap = false;
                        this.clearPlace();
                        this.$store.commit(SET_SNACKBAR_STATUS, { message: 'Invalid address', color: 'error' });
                    } else {
                        results[0].formatted_address = this.address;
                        this.loadSearchField(results[0]);
                        this.showMap = true;
                    }
                });
            }
        },
        clearPlace() {
            this.markers = [];
            this.post.address = null;
            this.post.latitude = null;
            this.post.longitude = null;
        },
        loadSearchField(postObject) {
            this.markers = [];
            const position = {
                lat: postObject.geometry.location.lat(),
                lng: postObject.geometry.location.lng(),
            };
            const radius = this.post.radius * 1000;
            this.post.address = postObject.formatted_address;
            this.post.latitude = postObject.geometry.location.lat();
            this.post.longitude = postObject.geometry.location.lng();
            this.markers.push({ instance: this.post, position, radius });
            this.center = position;
            this.currentPlace = null;
        },
        async savePost(visibleToVolunteers, selectedVolunteers = null) {
            this.post.is_visible_to_volunteers = visibleToVolunteers;
            if (selectedVolunteers !== null) {
                this.post.selected_volunteers = selectedVolunteers;
            }
            const tempPost = R.clone(this.post);
            delete tempPost.image;
            console.log("EEE");
            console.log(tempPost);
            const { data: post } = await CasesApi.createPost(this.caseId, tempPost);
            if (this.post.image instanceof FormData) {
                const headers = { 'Content-Type': 'multipart/form-data' };
                const { data: postWithImage } = await CasesApi.uploadPostImage(this.caseId, post.id, this.post.image, headers);
                this.post = postWithImage;
            } else {
                this.post = post;
            }
            this.selectVolunteersDialog = false;
            this.createPostDialog = false;
            this.loadFeed();
        },
        closeCreatePostDialog() {
            this.createPostDialog = false;
        },
        pickImage() {
            this.$refs.image.click();
        },
        setImage(e) {
            const file = e.target.files[0];
            if (!file.type.includes('image/')) {
                this.imageName = '';
                this.imageFile = '';
                this.imageUrl = this.fileIcon;
                return;
            }
            if (typeof FileReader === 'function') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.imageName = e.target.files[0].name;
                    [this.imageFile] = e.target.files;
                    this.imageUrl = event.target.result;
                    const formData = new FormData();
                    formData.append('image', this.imageFile);
                    this.post.image = formData;
                };
                reader.readAsDataURL(file);
            } else {
                this.imageName = '';
                this.imageFile = '';
                this.imageUrl = this.fileIcon;
            }
        },
    },
};
</script>
