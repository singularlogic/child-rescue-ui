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
            <v-btn flat v-if="caseObject.status==='active' || caseObject.status==='inactive'" @click="openAddFileDialog()" color="primary" dark>
                {{ $t('case_files.add_files') }}
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
        <v-card v-if="files.length > 0" color="grey lighten-4" class="mb-5" style="padding: 15px;">
            <v-layout fill-height row wrap>
                <v-flex v-for="(item) in files" :key="item.id" xs12 sm6 md3 lg3 xl2>
                    <v-card class="my-2 mx-2">
                        <v-img :contain="item.image !== null ? false : true" :src="item.image || fileIcon" height="200px">
                            <v-container fill-height fluid pa-2>
                                <v-layout align-end justify-start row fill-height wrap>
                                    <v-tooltip right>
                                        <template v-slot:activator="{ on }">
                                            <v-chip v-on="on" label :color="getColor(item)" :outline="item.image !== null ? false : false" text-color="white">
                                                {{ item.first_name | title }} {{ item.last_name | title }}
                                            </v-chip>
                                        </template>
                                        <span>{{ item.tag | customTitle('_') }}</span>
                                    </v-tooltip>
                                </v-layout>
                            </v-container>
                        </v-img>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <div class='subheading mx-2 my-2'><b>{{ item.title | truncate(12) | title}}</b></div>
                            <v-spacer></v-spacer>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" icon flat dark color="purple darken-3" @click="download(item)">
                                        <v-icon>cloud_download</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t('case_files.download') }}</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" icon flat dark color="red darken-3" @click="openDeleteDialog(item)">
                                        <v-icon>delete</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t('case_files.delete') }}</span>
                            </v-tooltip>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-card>
        <v-card v-else color="grey lighten-1" class="mb-5" style="padding: 15px;">
            <v-parallax dark>
                <v-layout align-center column justify-center>
                    <h1 class="display-2 font-weight-thin mb-3">{{ $t('case_files.collection_of_case_files') }}</h1>
                    <h4 class="subheading">{{ $t('case_files.no_files') }}</h4>
                </v-layout>
            </v-parallax>
        </v-card>
        <v-dialog v-model="addFileDialog" width="700">
            <v-card>
                <v-toolbar flat>
                    <v-toolbar-title>{{ $t('case_files.add_new_file') }}</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-form ref="fileForm" v-model="valid" lazy-validation @submit.prevent>
                        <v-layout row wrap>
                            <v-flex xs12 sm8 class='px-2'>
                                <v-text-field ref="titleField" v-model="selectedFile.title" :placeholder="$t('case_files.title')" :label="$t('case_files.title')" :rules="[rules.required]" prepend-icon="label"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm4 class=px-2>
                                <v-select ref="fileType" :items="uploadTypes" v-model="uploadType" :label="$t('case_files.file_type')"/>
                            </v-flex>
                            <v-flex xs12 class='px-2' v-if="uploadType==='image'">
                                <v-text-field
                                    v-model="imageName"
                                    :rules="[rules.required]"
                                    :label="$t('case_files.file_image')"
                                    :value="selectedFile.image"
                                    :placeholder="$t('case_files.select_image')"
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
                                <v-img id="avatar" :src="getLogo" alt="avatar" contain height="200px"></v-img>
                            </v-flex>
                            <v-flex xs12 class='px-2' v-if="uploadType==='file'">
                                <v-text-field
                                    v-model="imageName"
                                    :rules="[rules.required]"
                                    :label="$t('case_files.file')"
                                    :value="selectedFile.file"
                                    :placeholder="$t('case_files.file_placeholder')"
                                    class="header-text-field-input"
                                    color="secondary"
                                    prepend-icon="attach_file"
                                    @click="pickFile"
                                />
                                <input
                                    ref="file"
                                    type="file"
                                    style="display: none"
                                    @change="setFile"
                                />
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="" flat @click="closeAddFileDialog()">{{ $t('case_files.close') }}</v-btn>
                    <v-btn color="primary" flat @click="validate()">{{ $t('case_files.upload') }}</v-btn>
                </v-card-actions>
            </v-card></v-dialog>
        <v-dialog v-model="deleteFileDialog" width="400">
            <v-card>
                <v-toolbar flat color="white">
                    <v-toolbar-title>{{ $t('case_files.delete_file') }}</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text>
                    <v-list two-line>
                        <v-list-tile>
                            <v-layout>
                                <v-flex xs12 sm6 md6 lg6 xl6>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>{{ $t('case_files.title') }}</v-list-tile-sub-title>
                                        <v-list-tile-title>{{ (selectedFile.title || '') | title }}</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-flex>
                                <v-flex xs12 sm6 md6 lg6 xl6>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title>{{ $t('case_files.uploaded_by') }}</v-list-tile-sub-title>
                                        <v-list-tile-title>{{ (selectedFile.first_name || '') | title }} {{ (selectedFile.last_name || '') | title }}</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-flex>
                            </v-layout>
                        </v-list-tile>
                    </v-list>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="" flat @click="deleteFileDialog = false; selectedFile={};">{{ $t('case_files.cancel') }}</v-btn>
                    <v-btn color="error" flat @click="deleteFile()">{{ $t('case_files.remove') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import * as R from 'ramda';
import { dates, filters, fonts } from '@/utils/mixins';
import { CasesApi } from '@/api';

export default {
    components: {},
    mixins: [dates, filters, fonts],
    data() {
        return {
            valid: true,
            imageName: null,
            uploadType: 'file',
            addFileDialog: false,
            deleteFileDialog: false,
            selectedFile: {},
            files: [],
            caseId: null,
            caseObject: {},
            isLoaded: false,
            fileIcon: require('../../../assets/images/file_ic.png'),
            imageUrl: require('../../../assets/images/file_ic.png'),
            uploadTypes: [
                {
                    text: this.$t('case_files.image'),
                    value: 'image',
                },
                {
                    text: this.$t('case_files.file'),
                    value: 'file',
                },
            ],
            rules: {
                required: value => !!value || this.$t('case_files.rules_required'),
            },
        };
    },
    computed: {
        getLogo: {
            get() {
                if (['', null, undefined].includes(this.selectedFile.image) || this.selectedFile.image instanceof FormData) {
                    return this.imageUrl;
                }
                return this.selectedFile.image;
            },
        },
        getColor: () => (file) => {
            switch (file.tag) {
                // case 'organization_manager': {
                //     return 'red';
                // }
                // case 'coordinator': {
                //     return 'pink';
                // }
                // case 'network_manager': {
                //     return 'blue';
                // }
                // case 'case_manager': {
                //     return 'green';
                // }
                // case 'facility_manager': {
                //     return 'brown';
                // }
                default: {
                    return '#bfbfbf';
                }
            }
        },
    },
    async created() {
        this.caseId = this.$route.params.id;
        await this.loadFiles();
        const { data: caseObject } = await CasesApi.get(this.caseId);
        this.caseObject = caseObject;
        this.isLoaded = true;
    },
    methods: {
        async loadFiles() {
            const { data: files } = await CasesApi.getFiles(this.caseId);
            this.files = files;
        },
        validate() {
            if (this.$refs.fileForm.validate()) {
                this.addFile();
            }
        },
        reset() {
            this.$refs.fileForm.reset();
            this.uploadType = 'file';
            if (this.$refs.image) {
                this.$refs.image.value = '';
            }
        },
        openAddFileDialog() {
            this.reset();
            this.imageUrl = this.fileIcon;
            this.addFileDialog = true;
            this.selectedFile = {};
        },
        async uploadFile(fileId, file) {
            const headers = { 'Content-Type': 'multipart/form-data' };
            const { data: selectedDocumentFile } = await CasesApi.addFile(this.caseId, fileId, file, headers);
            this.selectedFile = selectedDocumentFile;
        },
        async addFile() {
            const tempFile = R.clone(this.selectedFile);
            delete tempFile.image;
            delete tempFile.file;
            const { data: selectedFile } = await CasesApi.createFile(this.caseId, tempFile);
            if (this.selectedFile.image instanceof FormData) {
                await this.uploadFile(selectedFile.id, this.selectedFile.image);
            } else if (this.selectedFile.file instanceof FormData) {
                await this.uploadFile(selectedFile.id, this.selectedFile.file);
            } else {
                this.selectedFile = selectedFile;
            }
            this.addFileDialog = false;
            this.loadFiles();
        },
        closeAddFileDialog() {
            this.addFileDialog = false;
        },
        openDeleteDialog(file) {
            this.selectedFile = file;
            this.deleteFileDialog = true;
        },
        async deleteFile() {
            await CasesApi.deleteFile(this.caseId, this.selectedFile.id);
            this.deleteFileDialog = false;
            this.selectedFile = {};
            this.loadFiles();
        },
        pickImage() {
            this.$refs.image.click();
        },
        pickFile() {
            this.$refs.file.click();
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
                    this.imageFile = e.target.files[0];
                    this.imageUrl = event.target.result;
                    const formData = new FormData();
                    formData.append('image', this.imageFile);
                    this.selectedFile.image = formData;
                };
                reader.readAsDataURL(file);
            } else {
                this.imageName = '';
                this.imageFile = '';
                this.imageUrl = this.fileIcon;
            }
        },
        setFile(e) {
            const file = e.target.files[0];
            if (typeof FileReader === 'function') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.imageName = e.target.files[0].name;
                    [this.imageFile] = e.target.files;
                    this.imageUrl = event.target.result;
                    const formData = new FormData();
                    formData.append('file', this.imageFile);
                    this.selectedFile.file = formData;
                };
                reader.readAsDataURL(file);
            } else {
                this.imageName = '';
                this.imageFile = '';
                this.imageUrl = this.fileIcon;
            }
        },
        getFilename(file) {
            let name = null;
            if (file.image) {
                name = file.image.split('.');
            } else {
                name = file.file.split('.');
            }
            const fileFormat = name[name.length - 1];
            return `${file.title}.${fileFormat}`;
        },
        async download(file) {
            const headers = { responseType: 'blob' };
            let data = null;
            if (file.image) {
                const { data: response } = await CasesApi.downloadImage(this.caseId, file.id, headers);
                data = response;
            } else {
                const { data: response } = await CasesApi.downloadFile(this.caseId, file.id, headers);
                data = response;
            }
            const fileURL = window.URL.createObjectURL(new Blob([data]));
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', this.getFilename(file));
            document.body.appendChild(fileLink);
            fileLink.click();
        },
    },
};
</script>

<style scoped>
</style>
