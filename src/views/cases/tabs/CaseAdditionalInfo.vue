<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded">
        <v-layout>
            <v-flex xs12 sm12 md12 lg12 xl12>
                <v-card class="mb-5" style="padding: 15px; margin-bottom: 5px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Personal data</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.personal_data.first_name" label="First name"
                                              class="textField" disabled></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.personal_data.last_name" label="Last name"
                                              class="textField" disabled></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.personal_data.mobile" label="Mobile"
                                              class="textField" disabled></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.personal_data.phone" label="Phone"
                                              class="textField" disabled></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.personal_data.father_fullname" disabled
                                              label="Father's full name" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.personal_data.mother_fullname" disabled
                                              label="Mother's full name" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.personal_data.mobile_father" disabled
                                              label="Father's mobile" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.personal_data.mobile_mother" disabled
                                              label="Mother's mobile" class="textField"></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-card class="mb-5" style="padding: 15px; margin-bottom: 5px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Basic case info</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout align-start justify-space-around row fill-height wrap>
                            <v-flex xs12 sm12 md6 lg6 xl6>
                                <v-layout row wrap style="margin:15px;">
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <span style="font-size: medium;">Case status</span>
                                        <v-radio-group v-model="caseObject.status" row>
                                            <v-radio label="Active" value="active" disabled></v-radio>
                                            <v-radio label="Inactive" value="inactive" disabled></v-radio>
                                            <v-radio label="Closed" value="closed" disabled></v-radio>
                                            <v-radio label="Archived" value="archived" disabled></v-radio>
                                        </v-radio-group>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-text-field v-model="caseObject.disappearance_type"
                                                      class="header-text-field-input"
                                                      label="Disappearance type" placeholder="" disabled
                                                      style="padding: 5px;"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-switch v-model="caseObject.amber_alert" disabled
                                                  :label="`Amber alert`" style="padding: 5px;"></v-switch>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-text-field v-model="caseObject.profile_photo" class="header-text-field-input"
                                                      label="Child photo" placeholder="Select child photo" disabled
                                                      :value="caseObject.profile_photo" prepend-icon="insert_photo"
                                                      style="padding: 5px;"></v-text-field>
                                        <input ref="image" type="file" style="display: none"
                                               accept="image/*">
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12 style="padding: 5px;">
                                        <div v-if="caseObject.profile_photo" class="text-xs-center">
                                            <img ref="imageId" :src="getImagePath(caseObject.profile_photo)"
                                                 style="max-width: 340px; max-height: 200px;"/>
                                        </div>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 sm12 md6 lg6 xl6>
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 md4 lg4 xl4>
                                        <v-checkbox v-model="caseObject.has_mobile_phone"
                                                    label="Has mobile phone" disabled
                                                    style="padding: 5px;"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs12 sm12 md4 lg4 xl4>
                                        <v-checkbox v-model="caseObject.has_money_or_credit"
                                                    label="Has money or credit" disabled
                                                    style="padding: 5px;"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs12 sm12 md4 lg4 xl4>
                                        <v-checkbox v-model="caseObject.has_area_knowledge"
                                                    label="Has area knowledge" disabled
                                                    style="padding: 5px;"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs12 sm12 md4 lg4 xl4>
                                        <v-checkbox v-model="caseObject.clothing_with_scent"
                                                    label="Clothing with scent" disabled
                                                    style="padding: 5px;"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs12 sm12 md4 lg4 xl4>
                                        <v-checkbox v-model="caseObject.volunteers_utilized"
                                                    label="Volunteers utilized" disabled
                                                    style="padding: 5px;"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs12 sm12 md4 lg4 xl4>
                                        <v-checkbox v-model="caseObject.rescue_teams_utilized"
                                                    label="Rescue teams utilized" disabled
                                                    style="padding: 5px;"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-textarea name="input-7-1"
                                                    v-model="caseObject.transit_country" box
                                                    label="Transit country"
                                                    placeholder="Write transit countries if exist..."
                                                    auto-grow
                                                    rows="1" disabled
                                                    style="padding: 5px 15px;"
                                                    counter maxlength="1000">
                                        </v-textarea>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-textarea name="input-7-1"
                                                    v-model="caseObject.probable_destinations" box
                                                    label="Probable destinations"
                                                    placeholder="Probable destinations..." auto-grow
                                                    rows="1" disabled
                                                    style="padding: 5px 15px;"
                                                    counter maxlength="5000">
                                        </v-textarea>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-textarea name="input-7-1"
                                                    v-model="caseObject.default_message" box
                                                    label="Default alert message"
                                                    placeholder="Default alert message..." auto-grow
                                                    rows="2" disabled
                                                    style="padding: 5px 15px;"
                                                    counter maxlength="5000">
                                        </v-textarea>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                        <v-layout align-start justify-space-around row fill-height wrap>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-textarea name="input-7-1"
                                            v-model="caseObject.default_message" box
                                            label="Description"
                                            placeholder="Case description..." auto-grow
                                            rows="4" disabled
                                            style="padding: 10px 15px;"
                                            counter maxlength="5000">
                                </v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-card class="mb-5" style="padding: 15px; margin-bottom: 5px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Demographic data</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.demographic_data.home_country"
                                              label="Home country" disabled
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.demographic_data.home_city" label="Home city"
                                              class="textField" disabled></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.demographic_data.home_address"
                                              label="Home address" disabled
                                              class="textField"></v-text-field>
                            </v-flex>

                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.demographic_data.birth_country"
                                              label="Birth country" disabled
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.demographic_data.birth_city" label="Birth city"
                                              class="textField" disabled></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.demographic_data.nationality" label="Nationality"
                                              class="textField" disabled></v-text-field>
                            </v-flex>

                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.demographic_data.date_of_birth"
                                              label="Date of birth" disabled prepend-icon="event" readonly
                                              style="padding: 5px 15px;" clearable>
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.demographic_data.gender" label="Gender"
                                              class="textField" disabled></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.demographic_data.arrival_at_facility_date"
                                              label="Arrival at facility" prepend-icon="event" readonly
                                              style="padding: 5px 15px;" disabled clearable hint="If the child has been in a facility"
                                              persistent-hint>
                                </v-text-field>
                            </v-flex>

                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.demographic_data.education_level"
                                              label="Education level" class="textField" disabled></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model.number="caseObject.demographic_data.languages_spoken"
                                              label="Languages spoken" type="number" disabled
                                              hint="The number of languages spoken by the child" persistent-hint
                                              style="padding: 5px 15px;">
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-card class="mb-5" style="padding: 15px; margin-bottom: 5px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Physical data</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.physical_data.eye_color"
                                              label="Eye color" disabled
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.physical_data.hair_color"
                                              label="Hair color" disabled
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.physical_data.skin_color"
                                              label="Skin color" disabled
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model.number="caseObject.physical_data.height" label="Height"
                                              suffix="cm" disabled
                                              style="padding: 5px 15px;" type="number" min="10" max="300"
                                              hint="Between 10 and 300" persistent-hint>
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model.number="caseObject.physical_data.weight" label="Weight"
                                              suffix="kg" disabled
                                              style="padding: 5px 15px;" type="number" min="5" max="200"
                                              hint="Between 5 and 200" persistent-hint>
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.physical_data.stature"
                                              label="Stature" disabled
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.physical_data.body_type"
                                              label="Body type" disabled
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-textarea name="input-7-1" v-model="caseObject.physical_data.characteristics" box
                                            label="Characteristics" disabled
                                            placeholder="Describe child's characteristics..." auto-grow rows="4"
                                            style="padding: 10px 15px;"
                                            counter maxlength="5000">
                                </v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-card class="mb-5" style="padding: 15px; margin-bottom: 5px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Medical data</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.medical_data.health_issues"
                                              label="Health issues" disabled
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-checkbox v-model="caseObject.medical_data.medical_treatment_required" disabled
                                            label="Require treatment"></v-checkbox>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-textarea name="input-7-1"
                                            v-model="caseObject.medical_data.health_issues_description" box
                                            label="Description" disabled
                                            placeholder="Describe child's health issues..." auto-grow rows="4"
                                            style="padding: 10px 15px;"
                                            counter maxlength="5000">
                                </v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-card class="mb-5" style="padding: 15px; margin-bottom: 5px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Psychological data</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.psychological_data.concerns"
                                              label="Concerns" disabled
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.psychological_data.personality"
                                              label="Personality" disabled
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.psychological_data.family"
                                              label="Family" disabled
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.psychological_data.mothers_profile"
                                              label="Mother's profile" disabled
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.psychological_data.fathers_profile"
                                              label="Fathers's profile" disabled
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.psychological_data.school_grades"
                                              label="School grades" disabled
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.psychological_data.school_absences"
                                              label="School absences" disabled
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.psychological_data.relationship_status"
                                              label="Relationship" disabled
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.psychological_data.religion"
                                              label="Religion" disabled
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model.number="caseObject.psychological_data.family_members"
                                              label="Family members"
                                              type="number" disabled
                                              hint="" persistent-hint
                                              style="padding: 5px 15px;">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-textarea name="input-7-1"
                                            v-model="caseObject.psychological_data.hobbies" box
                                            label="Hobbies" disabled
                                            placeholder="Describe child's hobbies..." auto-grow rows="4"
                                            style="padding: 10px 15px;"
                                            counter maxlength="5000">
                                </v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-card class="mb-5" style="padding: 15px; margin-bottom: 5px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Social media data</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-checkbox v-model="caseObject.social_media_data.has_social_profiles" disabled
                                            label="Has social profiles" style="padding: 10px 15px;"></v-checkbox>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-textarea name="input-7-1"
                                            v-model="caseObject.social_media_data.description" box
                                            label="Social media info"
                                            placeholder="Describe child's social media activity..." auto-grow
                                            rows="4" disabled
                                            style="padding: 10px 15px;"
                                            counter maxlength="5000">
                                </v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import * as R from 'ramda';

export default {
    data() {
        return {
            baseUrl: process.env.VUE_APP_BACKEND,
            isLoaded: false,
            currentStep: 1,
            relatedCases: [
                {
                    id: 1,
                    image: '../assets/logo.png',
                    name: 'Mpla mpla',
                    dateOfDisappearance: '1/2/2007'
                },
                {
                    id: 2,
                    image: '../assets/logo.png',
                    name: 'Mpla mpla 2',
                    dateOfDisappearance: '1/2/2007'
                },
            ],
        };
    },
    computed: {
        ...mapGetters('case_module', {
            getCase: 'getCase',
        }),
        caseObject: {
            get() {
                return R.clone(this.getCase);
                // if (this.editMode) {
                //     return R.clone(this.getCase);
                // } else {
                //     return R.clone(this.getCaseStructure);
                // }
            },
            // set(value) {
            //     this.updateAlertMutation(value);
            // },
        },
    },
    created() {
        // this.caseObject = this.getCase;
        this.isLoaded = true;
    },
    methods: {
        getImagePath(path) {
            if (path === null) {
                return require('../../../assets/logo.png');
            }

            if (this.baseUrl && this.baseUrl.length > 1) {
                return this.baseUrl + path;
            } else {
                return path;
            }
        },
    },
};
</script>

<style scoped>
    .textField {
        padding: 5px 15px;
    }
</style>
