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
                                <v-text-field v-model="caseObject.first_name" label="First name"
                                              :class="{'disable-events': true }" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.last_name" label="Last name"
                                              :class="{'disable-events': true }" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.father_fullname"
                                              label="Father's full name" :class="{'disable-events': true }" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.mother_fullname"
                                              label="Mother's full name" :class="{'disable-events': true }" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.date_of_birth"
                                              label="Date of birth" :class="{'disable-events': true }" class="textField" prepend-icon="event" readonly
                                              clearable>
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="genderOptions" v-model="caseObject.gender"
                                          :class="{'disable-events': true }"
                                          label="Gender" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.phone" label="Phone"
                                              :class="{'disable-events': true }" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="disappearanceTypeOptions"
                                          :class="{'disable-events': true }"
                                          v-model="caseObject.disappearance_type"
                                          label="Disappearance type" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12 style="padding: 5px 15px;">
                                <v-img v-if="caseObject.profile_photo && caseObject.status !== 'active'" ref="imageId" :src="caseObject.profile_photo" height="350px"></v-img>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-textarea name="input-7-1"
                                            v-model="caseObject.description" box
                                            label="Description"
                                            :class="{'disable-events': true }" class="textField"
                                            placeholder="Conditions of disappearance..." auto-grow
                                            rows="4"
                                            counter maxlength="5000">
                                </v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-card v-if="caseObject.status=='active'" class="mb-5" style="padding: 15px; margin-bottom: 5px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Investigation Details</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout align-start row fill-height wrap>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-checkbox v-model="caseObject.has_mobile_phone"
                                            label="Has mobile phone" :class="{'disable-events': true }" class="textField"></v-checkbox>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-checkbox v-model="caseObject.has_money_or_credit"
                                            label="Has money or credit" :class="{'disable-events': true }" class="textField"></v-checkbox>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-checkbox v-model="caseObject.has_area_knowledge"
                                            label="Has area knowledge" :class="{'disable-events': true }" class="textField"></v-checkbox>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-checkbox v-model="caseObject.clothing_with_scent"
                                            label="Clothing with scent" :class="{'disable-events': true }" class="textField"></v-checkbox>
                            </v-flex>
                            <v-flex xs12 sm12 md6 lg6 xl6>
                                <v-textarea name="input-7-1"
                                            v-model="caseObject.transit_country" box
                                            label="Transit country"
                                            placeholder="Write transit countries if exist..."
                                            auto-grow
                                            rows="1" :class="{'disable-events': true }" class="textField"
                                            counter maxlength="1000">
                                </v-textarea>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-checkbox v-model="caseObject.volunteers_utilized"
                                            label="Volunteers utilized" :class="{'disable-events': true }" class="textField"></v-checkbox>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-checkbox v-model="caseObject.rescue_teams_utilized"
                                            label="Rescue teams utilized" :class="{'disable-events': true }" class="textField"></v-checkbox>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-card  v-if="caseObject.status=='active'" class="mb-5" style="padding: 15px; margin-bottom: 5px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Alert Details</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md6 lg6 xl6 style="padding: 0px;">
                                <v-img v-if="caseObject.profile_photo" ref="imageId" :src="caseObject.profile_photo" height="350px"></v-img>
                            </v-flex>
                            <v-flex xs12 sm12 md6 lg6 xl6>
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-switch v-model="caseObject.amber_alert" :class="{'disable-events': true }" class="textField"
                                                  :label="`Amber alert`"></v-switch>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-textarea name="input-7-1"
                                                    v-model="caseObject.default_message" box
                                                    label="Default alert message"
                                                    placeholder="Default alert message..." auto-grow
                                                    rows="10" :class="{'disable-events': true }" class="textField"
                                                    counter maxlength="5000">
                                        </v-textarea>
                                    </v-flex>
                                </v-layout>
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
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.home_country"
                                              label="Home country" :class="{'disable-events': true }" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.home_address"
                                              label="Home address" :class="{'disable-events': true }" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.arrival_at_facility_date"
                                              label="Arrival at facility" prepend-icon="event" readonly
                                              clearable :class="{'disable-events': true }" class="textField"
                                              hint="If the child has been in a facility"
                                              persistent-hint>
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.birth_country"
                                              label="Birth country" :class="{'disable-events': true }" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.nationality" label="Nationality"
                                              :class="{'disable-events': true }" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.religion"
                                              label="Religion" :class="{'disable-events': true }" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model.number="caseObject.languages_spoken"
                                              label="Languages spoken" type="number" :class="{'disable-events': true }" class="textField"
                                              hint="The number of languages spoken by the child" persistent-hint>
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="educationOptions"
                                          :class="{'disable-events': true }"
                                          v-model="caseObject.education_level"
                                          label="Education level" placeholder="Choose the child's education level"
                                          item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="schoolGradesOptions"
                                          :class="{'disable-events': true }"
                                          v-model="caseObject.school_grades"
                                          label="School grades" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
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
                                <v-text-field v-model="caseObject.eye_color"
                                              label="Eye color" :class="{'disable-events': true }" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.hair_color"
                                              label="Hair color" :class="{'disable-events': true }" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-select :items="skinColorOptions" v-model="caseObject.skin_color"
                                          :class="{'disable-events': true }"
                                          label="Skin color" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model.number="caseObject.height" label="Height"
                                              suffix="cm" :class="{'disable-events': true }" class="textField"
                                              style="padding: 5px 15px;" type="number" min="10" max="300"
                                              hint="Between 10 and 300" persistent-hint>
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model.number="caseObject.weight" label="Weight"
                                              suffix="kg" :class="{'disable-events': true }" class="textField"
                                              style="padding: 5px 15px;" type="number" min="5" max="200"
                                              hint="Between 5 and 200" persistent-hint>
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="statureOptions" v-model="caseObject.stature"
                                          :class="{'disable-events': true }"
                                          label="Stature" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="bodyOptions" v-model="caseObject.body_type"
                                          :class="{'disable-events': true }"
                                          label="Body type" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-textarea name="input-7-1" v-model="caseObject.characteristics" box
                                            label="Characteristics" :class="{'disable-events': true }" class="textField"
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
                            style="font-size: large; font-weight: bold;">Psychological data</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="triggeredEventOptions"
                                          :class="{'disable-events': true }"
                                          v-model="caseObject.triggered_event"
                                          label="Was there a trigger event?" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="concernOptions" v-model="caseObject.concerns"
                                          :class="{'disable-events': true }"
                                          label="Family/Facility issues that may affect child" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="disappearanceReasonsOptions" v-model="caseObject.disappearance_reasons"
                                          :class="{'disable-events': true }"
                                          label="General reasons of disappearance" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="personalityOptions"
                                          :class="{'disable-events': true }"
                                          v-model="caseObject.mental_disorders"
                                          label="Mental/psychological disorders" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="familyOptions" v-model="caseObject.family"
                                          :class="{'disable-events': true }"
                                          label="Living Environment" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="parentsProfileOptions"
                                          :class="{'disable-events': true }"
                                          v-model="caseObject.parents_profile"
                                          label="Parent/Guardian with known issues (criminal, behavioural, etc)" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="relationshipOptions"
                                          :class="{'disable-events': true }"
                                          v-model="caseObject.relationship_status"
                                          label="Relationship" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model.number="caseObject.family_members"
                                              label="Family members"
                                              type="number" :class="{'disable-events': true }" class="textField"
                                              hint="" persistent-hint>
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-textarea name="input-7-1"
                                            v-model="caseObject.hobbies" box
                                            label="Hobbies" :class="{'disable-events': true }" class="textField"
                                            placeholder="Describe child's hobbies..." auto-grow rows="4"
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
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="addictionOptions"
                                          :class="{'disable-events': true }"
                                          v-model="caseObject.addiction"
                                          label="Drug user or other addiction" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-select :items="heathIssuesOptions"
                                          :class="{'disable-events': true }"
                                          v-model="caseObject.health_issues"
                                          label="Other health issues" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-select :items="medicalTreatmentOptions"
                                          :class="{'disable-events': true }"
                                          v-model="caseObject.medical_treatment_required"
                                          label="Require treatment" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-textarea name="input-7-1"
                                            v-model="caseObject.health_issues_description" box
                                            label="Description" :class="{'disable-events': true }" class="textField"
                                            placeholder="Describe child's health issues..." auto-grow rows="4"
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
                                <v-checkbox v-model="caseObject.has_social_profiles" :class="{'disable-events': true, textField }"
                                            label="Has social profiles"  class="textField"></v-checkbox>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-textarea name="input-7-1"
                                            v-model="caseObject.description" box
                                            label="Social media info"
                                            placeholder="Describe child's social media activity..." auto-grow
                                            rows="4" :class="{'disable-events': true }" class="textField"
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
import { CasesApi } from '@/api';

export default {
    props: {
        id: { type: Number, required: true },
    },
    data() {
        return {
            caseObject: {},
            isLoaded: false,
            disappearanceTypeOptions: [
                {
                    text: 'Runaway',
                    value: 'runaway',
                },
                {
                    text: 'Parental Abduction',
                    value: 'parental_abduction',
                },
                {
                    text: 'Lost, injured or otherwise missing',
                    value: 'lost',
                },
                {
                    text: 'Missing UAM',
                    value: 'missing',
                },
                {
                    text: 'Third-party Abduction',
                    value: 'third_party_abduction',
                },
                {
                    text: 'Unknown',
                    value: null,
                },
            ],
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
        };
    },
    created() {
        this.loadCase();
    },
    methods: {
        async loadCase() {
            const { data: caseObject } = await CasesApi.get(this.id);
            this.caseObject = caseObject;
            this.isLoaded = true;
        },
    },
};
</script>

<style scoped>
    .textField {
        padding: 5px 15px;
    }
</style>
