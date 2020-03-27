<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div style="padding: 10px;">
        <v-breadcrumbs :items="linkItems">
            <template v-slot:divider>
                <v-icon>chevron_right</v-icon>
            </template>
        </v-breadcrumbs>
        <v-layout>
            <v-flex xs12 sm12 md12 lg12 xl12>
                <v-card color="grey lighten-5" class="mb-5" style="padding: 15px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;">
                            <span style="font-size: large; font-weight: bold;">Personal data</span><br/>
                            <span style="font-size: small;">Fields with * are required</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.first_name" label="* First name"
                                              :rules="[rules.required]"
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.last_name" label="* Last name"
                                              :rules="[rules.required]"
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.father_fullname"
                                              label="Father's full name" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.mother_fullname"
                                              label="Mother's full name" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-menu v-model="dateOfBirthMenu" :close-on-content-click="false" :nudge-right="40"
                                        lazy
                                        transition="scale-transition" offset-y full-width min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="caseObject.date_of_birth"
                                                      label="Date of birth"
                                                      prepend-icon="event" readonly v-on="on"
                                                      style="padding: 5px 15px;"
                                                      clearable>
                                        </v-text-field>
                                    </template>
                                    <v-date-picker v-model="caseObject.date_of_birth"
                                                   @input="dateOfBirthMenu = false"></v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="genderOptions" v-model="caseObject.gender"
                                          label="Gender" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.phone" label="Phone"
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 md12 lg12 xl12 class="text-xs-center text-sm-center text-md-center text-lg-center mbot">
                                        <v-text-field
                                            v-model="getChildImageName"
                                            label="Child photo"
                                            :value="caseObject.profile_photo"
                                            placeholder="Select child photo"
                                            class="header-text-field-input"
                                            color="secondary"
                                            prepend-icon="insert_photo"
                                            @click="pickFile"
                                        />
                                        <input
                                            ref="image"
                                            type="file"
                                            style="display: none"
                                            accept="image/*"
                                            @change="setImage"
                                        />
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12 style="padding: 5px;" class="text-xs-center text-sm-center text-md-center text-lg-center">
                                        <img ref="imageId" :src="getChildImage"
                                             style="max-width: 340px; max-height: 250px;"/>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <!-- <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="disappearanceTypeOptions"
                                          v-model="caseObject.disappearance_type"
                                          label="Disappearance type" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex> -->
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-textarea name="input-7-1"
                                            v-model="caseObject.description" box
                                            label="Description"
                                            placeholder="Description..." auto-grow
                                            rows="4"
                                            style="padding: 10px 15px;"
                                            counter maxlength="5000">
                                </v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-card color="grey lighten-5" class="mb-5" style="padding: 15px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Demographic data</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.home_country"
                                              label="Home country"
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.home_address"
                                              label="Home address"
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-menu v-model="arrivalAtFacilityMenu" :close-on-content-click="false"
                                        :nudge-right="40" lazy
                                        transition="scale-transition" offset-y full-width min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="caseObject.arrival_at_facility_date"
                                                      label="Arrival at facility"
                                                      prepend-icon="event" readonly v-on="on"
                                                      style="padding: 5px 15px;"
                                                      clearable placeholder="If the child has been in a facility">
                                        </v-text-field>
                                    </template>
                                    <v-date-picker v-model="caseObject.arrival_at_facility_date"
                                                   @input="arrivalAtFacilityMenu = false">
                                    </v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.birth_country"
                                              label="Birth country"
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.nationality" label="Nationality"
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.religion" label="Religion"
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model.number="caseObject.languages_spoken"
                                              label="Languages spoken"
                                              placeholder="Number of spoken languages"
                                              type="number"
                                              style="padding: 5px 15px;">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="educationOptions"
                                          v-model="caseObject.education_level"
                                          label="Education level" placeholder="Choose the child's education level"
                                          item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="schoolGradesOptions"
                                          v-model="caseObject.school_grades"
                                          label="School grades" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-card color="grey lighten-5" class="mb-5" style="padding: 15px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Physical data</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.eye_color"
                                              label="Eye color"
                                              style="padding: 5px 15px;">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.hair_color"
                                              label="Hair color"
                                              style="padding: 5px 15px;">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-select :items="skinColorOptions" v-model="caseObject.skin_color"
                                          label="Skin color" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model.number="caseObject.height" label="Height"
                                              suffix="cm"
                                              style="padding: 5px 15px;" type="number" min="10" max="300"
                                              placeholder="Between 10 and 300">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model.number="caseObject.weight" label="Weight"
                                              suffix="kg"
                                              style="padding: 5px 15px;" type="number" min="5" max="200"
                                              placeholder="Between 5 and 200">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="statureOptions" v-model="caseObject.stature"
                                          label="Stature" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="bodyOptions" v-model="caseObject.body_type"
                                          label="Body type" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-textarea name="input-7-1" v-model="caseObject.characteristics" box
                                            label="Characteristics"
                                            placeholder="Describe child's characteristics..." auto-grow rows="4"
                                            style="padding: 10px 15px;"
                                            counter maxlength="5000">
                                </v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-card color="grey lighten-5" class="mb-5" style="padding: 15px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Psychological data</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="triggeredEventOptions"
                                          v-model="caseObject.triggered_event"
                                          label="Was there a trigger event?" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="concernOptions" v-model="caseObject.concerns"
                                          label="Family/Facility issues that may affect child" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="disappearanceReasonsOptions" v-model="caseObject.disappearance_reasons"
                                          label="General reasons of disappearance" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="personalityOptions"
                                          v-model="caseObject.mental_disorders"
                                          label="Mental/psychological disorders" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="familyOptions" v-model="caseObject.family"
                                          label="Living Environment" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="parentsProfileOptions"
                                          v-model="caseObject.parents_profile"
                                          label="Parent/Guardian with known issues (criminal, behavioural, etc)" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="relationshipOptions"
                                          v-model="caseObject.relationship_status"
                                          label="Relationship" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model.number="caseObject.family_members"
                                              label="Family members"
                                              type="number"
                                              hint="" persistent-hint
                                              style="padding: 5px 15px;">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-textarea name="input-7-1"
                                            v-model="caseObject.hobbies" box
                                            label="Hobbies"
                                            placeholder="Describe child's hobbies..." auto-grow rows="4"
                                            style="padding: 10px 15px;"
                                            counter maxlength="5000">
                                </v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-card color="grey lighten-5" class="mb-5" style="padding: 15px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Medical data</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-select :items="addictionOptions"
                                          v-model="caseObject.addiction"
                                          label="Drug user or other addiction" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-select :items="heathIssuesOptions"
                                          v-model="caseObject.health_issues"
                                          label="Other health issues" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-select :items="medicalTreatmentOptions"
                                          v-model="caseObject.medical_treatment_required"
                                          label="Require treatment" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-textarea name="input-7-1"
                                            v-model="caseObject.health_issues_description" box
                                            label="Description"
                                            placeholder="Describe child's health issues..." auto-grow rows="4"
                                            style="padding: 10px 15px;"
                                            counter maxlength="5000">
                                </v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-card color="grey lighten-5" class="mb-5" style="padding: 15px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Social media data</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-checkbox v-model="caseObject.has_social_profiles"
                                            label="Has social profiles" style="padding: 10px 15px;"></v-checkbox>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-textarea name="input-7-1"
                                            v-model="caseObject.description" box
                                            label="Social media info"
                                            placeholder="Describe child's social media activity..." auto-grow
                                            rows="4"
                                            style="padding: 10px 15px;"
                                            counter maxlength="5000">
                                </v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-btn color="primary" @click="save()">Save</v-btn>
                <v-btn flat @click="cancel()">Cancel</v-btn>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import * as R from 'ramda';
import { mapGetters } from 'vuex';
import { UsersApi, CasesApi, FacilitiesApi } from '@/api';

export default {
    components: {},
    props: {
        caseObject: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            userObject: {},
            getChildImageNameValue: null,
            baseUrl: process.env.VUE_APP_BACKEND,
            isFormValid: false,
            rules: {
                required: value => !!value || 'Field is required',
                address: value => value && value.length > 5 && value.length < 250 || 'Address must be between 5 and 50 characters',
            },
            editMode: false,
            dateOfBirthMenu: false,
            arrivalAtFacilityMenu: false,
            genderOptions: [
                {
                    text: 'Male',
                    value: 'male',
                },
                {
                    text: 'Female',
                    value: 'female',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
            educationOptions: [
                {
                    text: '1rst Grade',
                    value: 'first_grade',
                },
                {
                    text: '2nd Grade',
                    value: 'second_grade',
                },
                {
                    text: '3rd Grade',
                    value: 'third_grade',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
            skinColorOptions: [
                {
                    text: 'Light Pale',
                    value: 'light_pale',
                },
                {
                    text: 'Pale',
                    value: 'pale',
                },
                {
                    text: 'Tanned',
                    value: 'tanned',
                },
                {
                    text: 'Brown',
                    value: 'brown',
                },
                {
                    text: 'Dark Brown',
                    value: 'dark_brown',
                },
                {
                    text: 'Black',
                    value: 'black',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
            statureOptions: [
                {
                    text: 'Tall',
                    value: 'tall',
                },
                {
                    text: 'Short',
                    value: 'short',
                },
                {
                    text: 'Normal',
                    value: 'normal',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
            bodyOptions: [
                {
                    text: 'Slim',
                    value: 'slim',
                },
                {
                    text: 'Normal',
                    value: 'normal',
                },
                {
                    text: 'Overweight',
                    value: 'overweight',
                },
                {
                    text: 'Corpulent',
                    value: 'corpulent',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
            heathIssuesOptions: [
                {
                    text: 'Yes',
                    value: 'yes',
                },
                {
                    text: 'No',
                    value: 'no',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
            medicalTreatmentOptions: [
                {
                    text: 'Yes',
                    value: 'yes',
                },
                {
                    text: 'No',
                    value: 'no',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
            triggeredEventOptions: [
                {
                    text: 'Yes',
                    value: 'yes',
                },
                {
                    text: 'No',
                    value: 'no',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
            concernOptions: [
                {
                    text: 'Recent separation of parents',
                    value: 'parent_separation',
                },
                {
                    text: 'On Migration',
                    value: 'on_migration',
                },
                {
                    text: 'Parents in dispute (at court or otherwise)',
                    value: 'parents_in_dispute',
                },
                {
                    text: 'Physical or Sexual abuse',
                    value: 'physical_sexual_abuse',
                },
                {
                    text: 'Recent death of family member/friend',
                    value: 'death_of_family_member',
                },
                {
                    text: 'Possibly',
                    value: 'possibly',
                },
                {
                    text: 'None',
                    value: 'none',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
            disappearanceReasonsOptions: [
                {
                    text: 'Family Issues',
                    value: 'family_issues',
                },
                {
                    text: 'Personal Issues',
                    value: 'personal_issues',
                },
                {
                    text: 'Love affair',
                    value: 'love_affair',
                },
                {
                    text: 'Health issues',
                    value: 'health_issues',
                },
                {
                    text: 'Mass disaster',
                    value: 'mass_disaster',
                },
                {
                    text: 'Migration',
                    value: 'Migration',
                },
                {
                    text: 'Other',
                    value: 'Other',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
            personalityOptions: [
                {
                    text: 'Mild',
                    value: 'mild',
                },
                {
                    text: 'Moderate',
                    value: 'moderate',
                },
                {
                    text: 'Severe, self-threatening',
                    value: 'severe',
                },
                {
                    text: 'None',
                    value: 'none',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
            addictionOptions: [
                {
                    text: 'Yes',
                    value: 'yes',
                },
                {
                    text: 'No',
                    value: 'no',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
            familyOptions: [
                {
                    text: 'Living with 1 biological parent ',
                    value: 'single_bio_parent',
                },
                {
                    text: 'Living with both biological parents',
                    value: 'both_bio_parents',
                },
                {
                    text: 'Living with 1 biological parent + 1 step-parent',
                    value: 'bio_step_parents',
                },
                {
                    text: 'Living in camp/hosting facility',
                    value: 'facility',
                },
                {
                    text: "Living under relatives' care/foster family",
                    value: 'relatives',
                },
                {
                    text: 'Living in institution /psychiatric facility',
                    value: 'institution',
                },
                {
                    text: 'In Transit',
                    value: 'transit',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
            parentsProfileOptions: [
                {
                    text: 'Father/Stepfather',
                    value: 'father_step_father',
                },
                {
                    text: 'Mother/Stepmother',
                    value: 'mother_stepmother',
                },
                {
                    text: 'Both',
                    value: 'both',
                },
                {
                    text: 'None',
                    value: 'none',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
            schoolGradesOptions: [
                {
                    text: 'Excellent',
                    value: 'excellent',
                },
                {
                    text: 'Good',
                    value: 'good',
                },
                {
                    text: 'Sufficient',
                    value: 'average',
                },
                {
                    text: 'Not good',
                    value: 'not_good',
                },
                {
                    text: 'Bad',
                    value: 'bad',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
            relationshipOptions: [
                {
                    text: 'Single',
                    value: 'single',
                },
                {
                    text: 'In a relationship',
                    value: 'in_relationship',
                },
                {
                    text: "It's complicated",
                    value: 'complicated',
                },
                {
                    text: 'Recently broke up',
                    value: 'broke_up',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
            foundDateModal: false,
            imageData: null,
            cropImg: '',
            imageName: '',
            imageUrl: require('../../assets/images/default_photo.png'),
            imageFile: '',
            dialogCaseModal: false,
            genderItems: ['unknown', 'male', 'female'],
            linkItems: [
                {
                    text: 'Home',
                    disabled: false,
                    href: '/dashboard',
                },
                {
                    text: 'Manage Facility',
                    disabled: false,
                    href: '/manage_facility',
                },
            ],
        };
    },
    computed: {
        ...mapGetters('CaseStore', {
            getCaseStructure: 'getCaseStructure',
            getFormattedCreatedCase: 'getFormattedCreatedCase',
            getFormattedUpdatedCase: 'getFormattedUpdatedCase',
        }),
        getChildImage: {
            get() {
                this.getChildImageName = this.imageName;
                if (this.caseObject.profile_photo === '' || this.caseObject.profile_photo === null || this.caseObject.profile_photo instanceof FormData) {
                    return this.imageUrl;
                }
                return this.caseObject.profile_photo;
            },
        },
        getChildImageName: {
            get() {
                if (this.caseObject.profile_photo === '' || this.caseObject.profile_photo === null) {
                    this.getChildImageNameValue = null;
                } else if (this.caseObject.profile_photo instanceof FormData) {
                    this.getChildImageNameValue = this.imageName;
                } else {
                    this.getChildImageNameValue = this.caseObject.profile_photo.split('/').pop();
                }
                return this.getChildImageNameValue;
            },
            set(value) {
                this.getChildImageNameValue = value;
            },
        },
    },
    async created() {
        const { data: userObject } = await UsersApi.get();
        this.userObject = userObject;

        if (!this.caseObject) {
            this.caseObject = R.clone(this.getCaseStructure);
            this.caseObject.organization = this.userObject.organization;
        }
        this.imageName = this.caseObject.profile_photo;
        this.editMode = this.caseObject.id && this.caseObject.id !== null;
        if (this.editMode) {
            this.linkItems.push({
                text: `child: ${this.caseObject.id}`,
                disabled: true,
            });
        } else {
            this.linkItems.push({
                text: 'Add child',
                disabled: true,
            });
        }
    },
    methods: {
        validateForm() {
            if (!this.editMode) {
                this.isFormValid = !!(this.caseObject.first_name && this.caseObject.last_name);
            } else {
                this.isFormValid = !!(this.caseObject.first_name && this.caseObject.last_name);
            }
        },
        pickFile() {
            this.$refs.image.click();
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
                    formData.append('profile_photo', this.imageFile);
                    this.caseObject.profile_photo = formData;
                };
                reader.readAsDataURL(file);
            } else {
                this.imageName = '';
                this.imageFile = '';
                this.imageUrl = require('../../assets/images/default_photo.png');
            }
        },
        async save() {
            this.validateForm();
            if (this.isFormValid) {
                if (this.editMode) {
                    const { data: caseObject } = await CasesApi.edit(this.caseObject.id, this.getFormattedUpdatedCase(this.caseObject));
                    if (this.caseObject.profile_photo instanceof FormData) {
                        const headers = { 'Content-Type': 'multipart/form-data' };
                        const { data: caseImageObject } = await CasesApi.updateImage(this.caseObject.id, this.caseObject.profile_photo, headers);
                    }
                    const caseId = this.caseObject.id;
                    this.clearForm();
                    this.$router.push({ name: 'manage_facility_child', params: { id: caseId } });
                } else {
                    // this.caseObject.facility = this.userObject.facility;
                    // this.caseObject.status = 'inactive';
                    // this.caseObject.is_present = 'True';

                    const { data: caseObject } = await CasesApi.create(this.getFormattedCreatedCase(this.caseObject));

                    if (this.caseObject.profile_photo instanceof FormData) {
                        const headers = { 'Content-Type': 'multipart/form-data' };
                        const { data: caseImageObject } = await CasesApi.updateImage(caseObject.id, this.caseObject.profile_photo, headers);
                    }
                    const { data: addChildResponse } = await FacilitiesApi.addChild(caseObject.id, { date_entered: this.caseObject.arrival_at_facility_date });

                    this.clearForm();
                    this.$router.push({ name: 'manage_facility' });
                }
            } else {
                console.log('Invalid form');
            }
        },
        cancel() {
            const caseId = this.caseObject.id;
            this.clearForm();
            if (this.editMode) {
                this.$router.push({ name: 'manage_facility_child', params: { id: caseId } });
            } else {
                this.$router.push({ name: 'manage_facility' });
            }
        },
        clearForm() {
            this.caseObject = R.clone(this.getCaseStructure);
        },
    },
};
</script>

<style scoped>
    .textField {
        padding: 5px 15px;
    }

    .customInputField {
        font-size: 14px;
        width: 100%;
        height: 40px;
    }

    .glowing-border {
        border: 2px solid #F4B350;
        border-radius: 7px;
    }

    .glowing-border:focus {
        outline: none;
        border-color: #F4B350;
        box-shadow: 0 0 2px #F4B350;
    }

    input {
        font-size: 14px;
        padding: 5px 5px 5px 5px;
        display: block;
        width: 300px;
        border: none;
        border-bottom: 1px solid #757575;
    }

    input:focus {
        outline: none;
    }

    label {
        color: #000000;
        font-size: 14px;
        font-weight: normal;
        position: absolute;
        pointer-events: none;
        left: 5px;
        top: -20px;
        transition: 0.2s ease all;
        -moz-transition: 0.2s ease all;
        -webkit-transition: 0.2s ease all;
    }

    input:focus ~ label {
        top: -20px;
        font-size: 14px;
        color: #00ACC1;
    }

    input:focus ~ .bar:before, input:focus ~ .bar:after {
        width: 50%;
    }

    input:focus ~ .highlight {
        -webkit-animation: inputHighlighter 0.3s ease;
        -moz-animation: inputHighlighter 0.3s ease;
        animation: inputHighlighter 0.3s ease;
    }

    @-webkit-keyframes inputHighlighter {
        from {
            background: #F4B350;
        }
        to {
            width: 0;
            background: transparent;
        }
    }

    @-moz-keyframes inputHighlighter {
        from {
            background: #F4B350;
        }
        to {
            width: 0;
            background: transparent;
        }
    }

    @keyframes inputHighlighter {
        from {
            background: #F4B350;
        }
        to {
            width: 0;
            background: transparent;
        }
    }
</style>
