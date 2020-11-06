<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout v-if="isLoaded" row class="organization">
        <v-flex xs12>
            <v-card>
                <v-img src="https://cdn.vuetifyjs.com/images/lists/ali.png" height="200px">
                    <v-layout column fill-height>
                        <v-card-title>
                            <v-spacer></v-spacer>
                            <v-btn v-if="isViewMode" @click="toggleMode()" dark icon class="mr-3">
                                <v-icon>edit</v-icon>
                            </v-btn>
                            <v-btn v-if="!isViewMode" @click="cancel()" dark icon class="mr-3">
                                <v-icon>close</v-icon>
                            </v-btn>
                            <v-btn v-if="!isViewMode" @click="save()" dark icon class="mr-3">
                                <v-icon>check</v-icon>
                            </v-btn>
                        </v-card-title>
                        <v-spacer></v-spacer>
                        <v-card-title class="white--text pl-3 pt-5">
                            <v-avatar id="avatar" @click="pickFile" class="display-1" size="56px" color="grey lighten-4">
                                <img :src="getLogo" alt="avatar" :class="{ editable: isViewMode === false }" >
                            </v-avatar>
                            <input ref="image" type="file" style="display: none" accept="image/*" @change="setImage"/>
                            <div v-if="isViewMode" class="display-1 pl-2">{{ organization.name }}</div>
                            <v-text-field class="display-0 pl-2" dark v-if="!isViewMode" ref="nameField" v-model="organization.name" :hint="$t('organization.name_label')" persistent-hint></v-text-field>
                        </v-card-title>
                    </v-layout>
                </v-img>
                <v-list two-line>
                    <v-list-tile @click="">
                        <v-list-tile-action>
                            <v-icon color="primary">phone</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content v-if="isViewMode">
                            <v-list-tile-title>{{ organization.phone }}</v-list-tile-title>
                            <v-list-tile-sub-title>{{ $t('organization.phone') }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-text-field v-if="!isViewMode" v-model="organization.phone" :hint="$t('organization.phone_hint')" persistent-hint :rules="[rules.phone]"></v-text-field>
                        <v-list-tile-action v-if="isViewMode">
                            <!-- <v-icon>chat</v-icon> -->
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-list-tile @click="">
                        <v-list-tile-action>
                            <v-icon color="primary">mail</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content v-if="isViewMode">
                            <v-list-tile-title>{{ organization.email }}</v-list-tile-title>
                            <v-list-tile-sub-title>{{ $t('organization.email') }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-text-field v-if="!isViewMode" v-model="organization.email" :hint="$t('organization.email_hint')" persistent-hint></v-text-field>
                    </v-list-tile>
                    <v-list-tile @click="">
                        <v-list-tile-action>
                            <v-icon color="primary">location_on</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content v-if="isViewMode">
                            <v-list-tile-title>{{ organization.address }}</v-list-tile-title>
                            <v-list-tile-sub-title>{{ $t('organization.address') }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-text-field v-if="!isViewMode" v-model="organization.address" :hint="$t('organization.address_hint')" persistent-hint :rules="[rules.address]"></v-text-field>
                    </v-list-tile>
                    <v-divider v-if="isViewMode" inset></v-divider>
                    <v-list-tile @click="">
                        <v-list-tile-action>
                            <v-icon color="primary">share</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content v-if="isViewMode">
                            <v-list-tile-title>{{ organization.facebook }}</v-list-tile-title>
                            <v-list-tile-sub-title>Facebook</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-text-field v-if="!isViewMode" v-model="organization.facebook" hint="Facebook" persistent-hint :rules="[rules.social]"></v-text-field>
                    </v-list-tile>
                    <v-list-tile @click="">
                        <v-list-tile-action>
                        </v-list-tile-action>
                        <v-list-tile-content v-if="isViewMode">
                            <v-list-tile-title>{{ organization.instagram }}</v-list-tile-title>
                            <v-list-tile-sub-title>Instagram</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-text-field v-if="!isViewMode" v-model="organization.instagram" hint="Instagram" persistent-hint :rules="[rules.social]"></v-text-field>
                    </v-list-tile>
                    <v-list-tile @click="">
                        <v-list-tile-action>
                        </v-list-tile-action>
                        <v-list-tile-content v-if="isViewMode">
                            <v-list-tile-title>{{ organization.twitter }}</v-list-tile-title>
                            <v-list-tile-sub-title>Twitter</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-text-field v-if="!isViewMode" v-model="organization.twitter" hint="Twitter" persistent-hint :rules="[rules.social]"></v-text-field>
                    </v-list-tile>
                    <v-divider v-if="isViewMode" inset></v-divider>
                    <v-list-tile @click="">
                        <v-list-tile-action>
                            <v-icon color="primary">description</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content v-if="isViewMode">
                            <v-list-tile-title>{{ organization.how_to_become_volunteer }}</v-list-tile-title>
                            <v-list-tile-sub-title>{{ $t('organization.how_to') }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-textarea
                            v-if="!isViewMode"
                            v-model="organization.how_to_become_volunteer"
                            rows="1" row-height="30px"
                            :hint="$t('organization.how_to_hint')"
                             :rules="[rules.description]"
                            no-resize persistent-hint></v-textarea>
                    </v-list-tile>
                    <v-list-tile @click="">
                        <v-list-tile-action>
                        </v-list-tile-action>
                        <v-list-tile-content v-if="isViewMode">
                            <v-list-tile-title>{{ organization.description }}</v-list-tile-title>
                            <v-list-tile-sub-title>{{ $t('organization.description') }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-textarea
                            v-if="!isViewMode"
                            v-model="organization.description"
                            rows="1" row-height="30px"
                            :hint="$t('organization.description')"
                             :rules="[rules.description]"
                            no-resize persistent-hint></v-textarea>
                    </v-list-tile>
                    <v-list-tile @click="">
                        <v-list-tile-action>
                        </v-list-tile-action>
                        <v-list-tile-content v-if="isViewMode">
                            <v-list-tile-title>{{ organization.missing_child_actions }}</v-list-tile-title>
                            <v-list-tile-sub-title>{{ $t('organization.missing_child') }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-textarea
                            v-if="!isViewMode"
                            v-model="organization.missing_child_actions"
                            rows="1" row-height="30px"
                            :hint="$t('organization.missing_child_hint')"
                             :rules="[rules.description]"
                            no-resize persistent-hint></v-textarea>
                    </v-list-tile>
                </v-list>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import * as R from 'ramda';
import { bus } from '../../main';
import { dates, filters } from '@/utils/mixins';
import { OrganizationsApi } from '@/api';
import { SET_SNACKBAR_STATUS } from '@/store/mutation-types';

export default {
    components: {},
    mixins: [dates, filters],
    data() {
        return {
            imageUrl: require('../../assets/images/default_photo.png'),
            isLoaded: false,
            isViewMode: true,
            organization: null,
            rules: {
                required: value => !!value || this.$t('feed.rules_required'),
                phone: value => value && value.length >= 10 && value.length <= 14 || this.$t('organization.rules_phone'),
                address: value => value && value.length <= 256 || this.$t('organization.rules_address'),
                social: value => value && value.length <= 128 || this.$t('organization.rules_social'),
                description: value => value && value.length <= 4056 || this.$t('organization.rules_description'),
            },
        };
    },
    computed: {
        getLogo: {
            get() {
                if (this.organization.logo === '' || this.organization.logo === null || this.organization.logo instanceof FormData) {
                    return this.imageUrl;
                }
                return this.organization.logo;
            },
        },
    },
    created() {
        this.loadOrganization();
    },
    methods: {
        async loadOrganization() {
            const { data: organization } = await OrganizationsApi.get(this.$store.state.organizationId);
            this.organization = organization;
            this.isLoaded = true;
        },
        toggleMode() {
            this.isViewMode = !this.isViewMode;
            if (!this.isViewMode) {
                this.$nextTick(() => {
                    this.$refs.nameField.focus();
                });
            }
        },
        async save() {
            const tempOrganizationObject = R.clone(this.organization);
            delete tempOrganizationObject.logo;
            const { data: organizationObject } = await OrganizationsApi.edit(tempOrganizationObject);
            if (this.organization.logo instanceof FormData) {
                const headers = { 'Content-Type': 'multipart/form-data' };
                const { data: organizationImageObject } = await OrganizationsApi.updateImage(this.organization.id, this.organization.logo, headers);
                this.organization = organizationImageObject;
            } else {
                this.organization = organizationObject;
            }
            bus.$emit('reload-layout-event');
            this.toggleMode();
            this.$store.commit(SET_SNACKBAR_STATUS, { message: this.$t('organization.success_update'), color: 'primary' });
        },
        cancel() {
            this.loadOrganization();
            this.imageUrl = require('../../assets/images/default_photo.png');
            this.toggleMode();
        },
        pickFile() {
            if (!this.isViewMode) {
                this.$refs.image.click();
            }
        },
        setImage(e) {
            const file = e.target.files[0];
            if (!file.type.includes('image/')) {
                this.imageName = '';
                this.imageFile = '';
                this.imageUrl = require('../../assets/images/default_photo.png');
                return;
            }
            if (typeof FileReader === 'function') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.imageName = e.target.files[0].name;
                    this.imageFile = e.target.files[0];
                    this.imageUrl = event.target.result;
                    const formData = new FormData();
                    formData.append('logo', this.imageFile);
                    this.organization.logo = formData;
                };
                reader.readAsDataURL(file);
            } else {
                this.imageName = '';
                this.imageFile = '';
                this.imageUrl = require('../../assets/images/default_photo.png');
            }
        },
    },
};
</script>

<style lang="scss">
.organization {
    .editable {
        border: 2px solid #F4B350;
    }
}
</style>
