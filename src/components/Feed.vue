<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded">
        <v-card flat>
            <v-toolbar dense flat class="mb-0">
                <v-toolbar-title></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn v-if="$networkManagerAndAbove.includes($store.state.role) && caseObject.status!='closed'" @click="openCreatePostDialog()" color="primary" dark>Create post</v-btn>
            </v-toolbar>
            <v-layout v-if="posts.length > 0" fill-height row wrap align-start justify-center style="max-height:775px; overflow-y: scroll;">
                <v-flex v-for="(item) in posts" :key="item.id" xs12>
                    <post :post-object="item"></post>
                </v-flex>
            </v-layout>
            <v-parallax v-else dark style="background-color: #C3C3C3; height:775px;">
                <v-layout align-center column justify-center>
                    <h1 class="display-2 font-weight-thin mb-3">Case feed</h1>
                    <h4 class="subheading">No posts in case...</h4>
                </v-layout>
            </v-parallax>
        </v-card>
        <v-dialog v-model="createPostDialog" width="700">
            <v-card>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Create post for the case</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="mt-0 pt-0">
                    <v-form ref="postForm" v-model="valid" lazy-validation @submit.prevent>
                        <v-layout row wrap>
                            <v-flex xs12 sm5 class='px-2'>
                                <v-select :items="tags" v-model="post.tag" label="Select tag" prepend-icon="label"/>
                            </v-flex>
                            <v-flex xs12 sm4 class='px-2'>
                                <v-checkbox
                                    v-model="isVisibleToVolunteers"
                                    :value="false"
                                    :label="`Notify volunteers: ${isVisibleToVolunteers || false}`"
                                ></v-checkbox>
                            </v-flex>
                            <v-flex xs12 sm3 class='px-2'>
                                <v-switch
                                    right
                                    class="mx-0 px-0 mt-3"
                                    v-model="hasMap"
                                    :label="getPostType"
                                    @click="clearPost"
                                ></v-switch>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs12 class='px-2'>
                                <v-textarea ref="descriptionField"
                                            autofocus counter flat
                                            v-model="post.description"
                                            box placeholder="Description..."
                                            prepend-icon="description"
                                            class="my-0 py-0"></v-textarea>
                            </v-flex>
                            <v-flex v-if="hasMap===false || hasMap===undefined" xs12 class='px-2'>
                                <v-text-field
                                    v-model="imageName"
                                    label="Image"
                                    :value="post.image"
                                    placeholder="Select image"
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
                            <v-flex v-if="hasMap===true" xs12 sm9 class='pl-2'>
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
                            <v-flex v-if="hasMap===true" xs12 sm2 class='pl-4 mt-2'>
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
                    <v-btn color="" flat @click="closeCreatePostDialog()">Close</v-btn>
                    <v-btn color="primary" flat @click="validate()">Upload</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
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
            tag: null,
            isVisibleToVolunteers: false,
            tags: [
                {
                    text: 'Announcement',
                    value: 'announcement',
                },
                {
                    text: 'Task',
                    value: 'task',
                },
                {
                    text: 'Fact',
                    value: 'fact',
                },
                {
                    text: 'General',
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
                disableDefaultUI: true,
            },
            showMap: false,
            address: null,
            valid: true,
            imageName: null,
            createPostDialog: false,
            post: {},
            posts: [],
            caseId: null,
            caseObject: {},
            isLoaded: false,
            imageUrl: require('../assets/images/file_ic.png'),
            rules: {
                required: value => !!value || 'Field is required',
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
                    return 'Location post.';
                }
                return 'Image post.';
            },
        },
    },
    async created() {
        this.caseId = this.$route.params.id;
        await this.loadFeed();
        const { data: caseObject } = await CasesApi.get(this.caseId);
        this.caseObject = caseObject;
        this.isLoaded = true;
    },
    methods: {
        clearPost() {
            this.post.image = null;
            this.imageName = null;
            this.showMap = false;
        },
        async loadFeed() {
            const { data: posts } = await CasesApi.getFeed(this.caseId);
            this.posts = posts;
        },
        validate() {
            if (this.$refs.postForm.validate() && (this.post.description || this.post.latitude || this.post.image)) {
                this.savePost();
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
        openCreatePostDialog() {
            this.reset();
            this.createPostDialog = true;
            this.post = {};
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
                        this.setPlace(results[0]);
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
        setPlace(data) {
            this.markers = [];
            this.post.address = data.formatted_address;
            this.post.latitude = data.geometry.location.lat();
            this.post.longitude = data.geometry.location.lng();
            const position = {
                lat: data.geometry.location.lat(),
                lng: data.geometry.location.lng(),
            };
            this.markers.push({ position });
            this.center = position;
        },
        async savePost() {
            this.post.is_visible_to_volunteers = this.isVisibleToVolunteers;
            const tempPost = R.clone(this.post);
            delete tempPost.image;
            const { data: post } = await CasesApi.createPost(this.caseId, tempPost);
            if (this.post.image instanceof FormData) {
                const headers = { 'Content-Type': 'multipart/form-data' };
                const { data: postWithImage } = await CasesApi.uploadPostImage(this.caseId, post.id, this.post.image, headers);
                this.post = postWithImage;
            } else {
                this.post = post;
            }
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
