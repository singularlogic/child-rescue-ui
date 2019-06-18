<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div style="padding: 10px;">
        <v-breadcrumbs :items="linkItems">
            <template v-slot:divider>
                <v-icon>chevron_right</v-icon>
            </template>
        </v-breadcrumbs>
        <v-layout v-if="caseObject.amber_alert !== undefined">
            <v-flex xs12 sm12 md12 lg12 xl12>
                <!--<v-stepper v-model="currentStep" vertical non-linear>-->

                <!--<v-stepper-step :complete="currentStep > 1" editable step="1">Personal data-->
                <!--</v-stepper-step>-->
                <!--<v-stepper-content step="1">-->
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
                            <v-text-field v-model="caseObject.personal_data.first_name" label="* First name"
                                          :rules="[rules.required]" @change="validateForm()"
                                          class="textField"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-text-field v-model="caseObject.personal_data.last_name" label="* Last name"
                                          :rules="[rules.required]" @change="validateForm()"
                                          class="textField"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-text-field v-model="caseObject.personal_data.mobile" label="Mobile"
                                          class="textField"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-text-field v-model="caseObject.personal_data.phone" label="Phone"
                                          class="textField"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-text-field v-model="caseObject.personal_data.father_fullname"
                                          label="Father's full name" class="textField"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-text-field v-model="caseObject.personal_data.mother_fullname"
                                          label="Mother's full name" class="textField"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-text-field v-model="caseObject.personal_data.mobile_father"
                                          label="Father's mobile" class="textField"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-text-field v-model="caseObject.personal_data.mobile_mother"
                                          label="Mother's mobile" class="textField"></v-text-field>
                        </v-flex>
                    </v-layout>
                    </v-card-text>
                </v-card>
                <!--<v-btn v-if="!editMode" color="primary" @click="currentStep = 2">Continue</v-btn>-->
                <!--<v-btn v-if="editMode" color="primary" @click="currentStep = 3">Continue</v-btn>-->
                <!--<v-btn flat>Cancel</v-btn>-->
                <!--</v-stepper-content>-->

                <!--<v-stepper-step v-if="!editMode" :complete="currentStep > 2" editable step="2">Missing info</v-stepper-step>-->
                <!--<v-stepper-content v-if="!editMode" step="2">-->
                <v-card v-if="!editMode" color="grey lighten-5" class="mb-5" style="padding: 15px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;">
                            <span style="font-size: large; font-weight: bold;">Missing info</span><br/>
                            <span style="font-size: small;">Fields with * are required</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="form">
                            <v-layout row wrap>
                                <v-flex xs12 sm12 md12 lg12 xl12>
                                    <v-layout row wrap>
                                        <v-flex xs12 sm12 md12 lg12 xl12>
                                            <gmap-autocomplete class="customInputField glowing-border" autofocus
                                                               placeholder="* Write a location"
                                                               ref="autocomplete" :types="['geocode']"
                                                               :value="place"
                                                               :rules="[rules.required]"
                                                               @place_changed="triggerPlaceChangeEvent"/>
                                        </v-flex>
                                        <v-flex xs12 sm12 md12 lg12 xl12>
                                            <v-layout row wrap>
                                                <v-flex xs12 sm12 md12 lg12 xl12>
                                                    <feedback-map></feedback-map>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 sm12 md12 lg12 xl12 style="margin-top: 10px;">
                                    <v-layout wrap>
                                        <v-flex xs12 sm12 md6 lg6 xl6>
                                            <v-text-field v-model="feedbackObject.latitude"
                                                          class="header-text-field-input"
                                                          :rules="[rules.required]"
                                                          label="* Latitude" placeholder="-" disabled
                                                          style="padding: 5px;" @change="validateForm()"
                                                          prepend-icon=""></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm12 md6 lg6 xl6>
                                            <v-text-field v-model="feedbackObject.longitude"
                                                          :rules="[rules.required]"
                                                          class="header-text-field-input"
                                                          label="* Longitude" placeholder="-" disabled
                                                          style="padding: 5px;"
                                                          prepend-icon=""></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm12 md3 lg3 xl3>
                                            <v-menu v-model="dateMenu" :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    lazy
                                                    transition="scale-transition" offset-y full-width
                                                    min-width="290px">
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field v-model="feedbackObject.date"
                                                                  label="* Date of incident"
                                                                  prepend-icon="event" readonly v-on="on"
                                                                  style="padding: 5px;"
                                                                  :rules="[rules.required]"
                                                                  @change="validateForm()">
                                                    </v-text-field>
                                                </template>
                                                <v-date-picker v-model="feedbackObject.date"
                                                               @input="dateMenu = false"></v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                        <v-flex xs12 sm12 md3 lg3 xl3>
                                            <v-menu ref="timeMenu" v-model="timeMenu"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40" :return-value.sync="feedbackObject.time"
                                                    lazy
                                                    transition="scale-transition" offset-y full-width
                                                    max-width="290px"
                                                    min-width="290px">
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field v-model="feedbackObject.time"
                                                                  label="* Time of incident"
                                                                  prepend-icon="access_time" readonly v-on="on"
                                                                  style="padding: 5px;"
                                                                  :rules="[rules.required]"
                                                                  @change="validateForm()">
                                                    </v-text-field>
                                                </template>
                                                <v-time-picker v-if="timeMenu" v-model="feedbackObject.time"
                                                               format="24hr"
                                                               full-width
                                                               @click:minute="$refs.timeMenu.save(feedbackObject.time)">
                                                </v-time-picker>
                                            </v-menu>
                                        </v-flex>
                                        <v-flex xs12 sm12 md3 lg3 xl3>
                                            <v-select :items="childStatuses"
                                                      v-model="feedbackObject.child_status"
                                                      label="Child status" style="padding: 5px;">
                                            </v-select>
                                        </v-flex>
                                        <v-flex xs12 sm12 md3 lg3 xl3>
                                            <v-select :items="transportationChoices"
                                                      v-model="feedbackObject.transportation"
                                                      label="Transportation" style="padding: 5px;">
                                            </v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-form>
                    </v-card-text>
                </v-card>
                <!--<v-btn color="primary" @click="currentStep = 3">Continue</v-btn>-->
                <!--<v-btn flat>Cancel</v-btn>-->
                <!--</v-stepper-content>-->

                <!--<v-stepper-step :complete="currentStep > 3" editable step="3">-->
                <!--Basic case info-->
                <!--<small>Summarize if needed</small>-->
                <!--</v-stepper-step>-->
                <!--<v-stepper-content step="3">-->
                <v-card color="grey lighten-5" class="mb-5" style="padding: 15px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Case info</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout align-start justify-space-around row fill-height wrap>
                            <v-flex xs12 sm12 md6 lg6 xl6>
                                <v-layout row wrap style="margin:15px;">
                                    <!--<v-flex xs12 sm12 md12 lg12 xl12>-->
                                        <!--<span style="font-size: medium;">Case status</span>-->
                                        <!--<v-radio-group v-model="caseObject.status" row>-->
                                            <!--<v-radio label="Active" value="active"></v-radio>-->
                                            <!--<v-radio label="Inactive" value="inactive" disabled></v-radio>-->
                                            <!--<v-radio label="Closed" value="closed"></v-radio>-->
                                            <!--<v-radio label="Archived" value="archived" disabled></v-radio>-->
                                        <!--</v-radio-group>-->
                                    <!--</v-flex>-->
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-select :items="disappearanceTypeOptions"
                                                  v-model="caseObject.disappearance_type"
                                                  label="Disappearance type" item-text="text" item-value="value"
                                                  style="padding: 5px;">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-switch v-model="caseObject.amber_alert"
                                                  :label="`Amber alert`" style="padding: 5px;"></v-switch>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-text-field v-model="image" class="header-text-field-input"
                                                      label="Child photo" placeholder="Select child photo"
                                                      :value="image" prepend-icon="insert_photo"
                                                      style="padding: 5px;"
                                                      @click="pickFile"></v-text-field>
                                        <input ref="image" type="file" style="display: none" accept="image/*"
                                               @change="setImage">
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12 style="padding: 5px;">
                                        <div v-if="image" class="text-xs-center">
                                            <img ref="imageId" :src="imageUrl"
                                                 style="max-width: 340px; max-height: 200px;"/>
                                        </div>
                                    </v-flex>

                                    <!--<v-flex xs12 sm12 md12 lg12 xl6 style="padding: 5px;">-->
                                    <!--<v-dialog ref="foundDialog" v-model="foundDateModal" :return-value.sync="caseObject.found_date"-->
                                    <!--persistent lazy full-width width="290px">-->
                                    <!--<template v-slot:activator="{ on }">-->
                                    <!--<v-text-field v-model="caseObject.found_date"-->
                                    <!--label="Date found" readonly prepend-icon="access_time"-->
                                    <!--placeholder="yyyy/mm/dd" v-on="on"></v-text-field>-->
                                    <!--</template>-->
                                    <!--<v-date-picker v-model="caseObject.found_date" scrollable>-->
                                    <!--<v-spacer></v-spacer>-->
                                    <!--<v-btn flat color="primary" @click="foundDateModal = false">Cancel</v-btn>-->
                                    <!--<v-btn flat color="primary" @click="$refs.foundDialog.save(caseObject.found_date)">OK</v-btn>-->
                                    <!--</v-date-picker>-->
                                    <!--</v-dialog>-->
                                    <!--</v-flex>-->
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 sm12 md6 lg6 xl6>
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 md4 lg4 xl4>
                                        <v-checkbox v-model="caseObject.has_mobile_phone"
                                                    label="Has mobile phone" style="padding: 5px;"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs12 sm12 md4 lg4 xl4>
                                        <v-checkbox v-model="caseObject.has_money_or_credit"
                                                    label="Has money or credit"
                                                    style="padding: 5px;"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs12 sm12 md4 lg4 xl4>
                                        <v-checkbox v-model="caseObject.has_area_knowledge"
                                                    label="Has area knowledge"
                                                    style="padding: 5px;"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs12 sm12 md4 lg4 xl4>
                                        <v-checkbox v-model="caseObject.clothing_with_scent"
                                                    label="Clothing with scent"
                                                    style="padding: 5px;"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs12 sm12 md4 lg4 xl4>
                                        <v-checkbox v-model="caseObject.volunteers_utilized"
                                                    label="Volunteers utilized"
                                                    style="padding: 5px;"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs12 sm12 md4 lg4 xl4>
                                        <v-checkbox v-model="caseObject.rescue_teams_utilized"
                                                    label="Rescue teams utilized"
                                                    style="padding: 5px;"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-textarea name="input-7-1"
                                                    v-model="caseObject.transit_country" box
                                                    label="Transit country"
                                                    placeholder="Write transit countries if exist..." auto-grow
                                                    rows="1"
                                                    style="padding: 5px 15px;"
                                                    counter maxlength="1000">
                                        </v-textarea>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-textarea name="input-7-1"
                                                    v-model="caseObject.probable_destinations" box
                                                    label="Probable destinations"
                                                    placeholder="Probable destinations..." auto-grow
                                                    rows="1"
                                                    style="padding: 5px 15px;"
                                                    counter maxlength="5000">
                                        </v-textarea>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-textarea name="input-7-1"
                                                    v-model="caseObject.default_message" box
                                                    label="Default alert message"
                                                    placeholder="Default alert message..." auto-grow
                                                    rows="2"
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
                                            v-model="caseObject.description" box
                                            label="Description"
                                            placeholder="Case description..." auto-grow
                                            rows="4"
                                            style="padding: 10px 15px;"
                                            counter maxlength="5000">
                                </v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <!--<v-btn color="primary" @click="currentStep = 4">Continue</v-btn>-->
                <!--<v-btn flat>Cancel</v-btn>-->
                <!--</v-stepper-content>-->

                <!--<v-stepper-step :complete="currentStep > 4" editable step="4">Demographic data-->
                <!--</v-stepper-step>-->
                <!--<v-stepper-content step="4">-->
                <v-card color="grey lighten-5" class="mb-5" style="padding: 15px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Demographic data</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                        <v-flex xs12 sm12 md4 lg4 xl4>
                            <v-text-field v-model="caseObject.demographic_data.home_country"
                                          label="Home country"
                                          class="textField"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md4 lg4 xl4>
                            <v-text-field v-model="caseObject.demographic_data.home_city" label="Home city"
                                          class="textField"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md4 lg4 xl4>
                            <v-text-field v-model="caseObject.demographic_data.home_address"
                                          label="Home address"
                                          class="textField"></v-text-field>
                        </v-flex>

                        <v-flex xs12 sm12 md4 lg4 xl4>
                            <v-text-field v-model="caseObject.demographic_data.birth_country"
                                          label="Birth country"
                                          class="textField"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md4 lg4 xl4>
                            <v-text-field v-model="caseObject.demographic_data.birth_city" label="Birth city"
                                          class="textField"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md4 lg4 xl4>
                            <v-text-field v-model="caseObject.demographic_data.nationality" label="Nationality"
                                          class="textField"></v-text-field>
                        </v-flex>

                        <v-flex xs12 sm12 md4 lg4 xl4>
                            <v-menu v-model="dateOfBirthMenu" :close-on-content-click="false" :nudge-right="40"
                                    lazy
                                    transition="scale-transition" offset-y full-width min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="caseObject.demographic_data.date_of_birth"
                                                  label="Date of birth"
                                                  prepend-icon="event" readonly v-on="on"
                                                  style="padding: 5px 15px;"
                                                  clearable>
                                    </v-text-field>
                                </template>
                                <v-date-picker v-model="caseObject.demographic_data.date_of_birth"
                                               @input="dateOfBirthMenu = false"></v-date-picker>
                            </v-menu>
                        </v-flex>
                        <v-flex xs12 sm12 md4 lg4 xl4>
                            <v-select :items="genderOptions" v-model="caseObject.demographic_data.gender"
                                      label="Gender" item-text="text" item-value="value"
                                      style="padding: 5px 15px;">
                            </v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md4 lg4 xl4>
                            <v-menu v-model="arrivalAtFacilityMenu" :close-on-content-click="false"
                                    :nudge-right="40" lazy
                                    transition="scale-transition" offset-y full-width min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="caseObject.demographic_data.arrival_at_facility_date"
                                                  label="Arrival at facility"
                                                  prepend-icon="event" readonly v-on="on"
                                                  style="padding: 5px 15px;"
                                                  clearable placeholder="If the child has been in a facility">
                                    </v-text-field>
                                </template>
                                <v-date-picker v-model="caseObject.demographic_data.arrival_at_facility_date"
                                               @input="arrivalAtFacilityMenu = false">
                                </v-date-picker>
                            </v-menu>
                        </v-flex>

                        <v-flex xs12 sm12 md4 lg4 xl4>
                            <v-select :items="educationOptions"
                                      v-model="caseObject.demographic_data.education_level"
                                      label="Education level" placeholder="Choose the child's education level"
                                      item-text="text" item-value="value"
                                      style="padding: 5px 15px;">
                            </v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md4 lg4 xl4>
                            <v-text-field v-model.number="caseObject.demographic_data.languages_spoken"
                                          label="Languages spoken"
                                          placeholder="Number of spoken languages"
                                          type="number"
                                          style="padding: 5px 15px;">
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    </v-card-text>
                </v-card>
                <!--<v-btn color="primary" @click="currentStep = 5">Continue</v-btn>-->
                <!--<v-btn flat>Cancel</v-btn>-->
                <!--</v-stepper-content>-->

                <!--<v-stepper-step :complete="currentStep > 5" editable step="5">Physical data-->
                <!--</v-stepper-step>-->
                <!--<v-stepper-content step="5">-->
                <v-card color="grey lighten-5" class="mb-5" style="padding: 15px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Physical data</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                        <v-flex xs12 sm12 md4 lg4 xl4>

                            <v-select :items="eyeColorOptions" v-model="caseObject.physical_data.eye_color"
                                      label="Eye color" item-text="text" item-value="value"
                                      style="padding: 5px 15px;">
                            </v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md4 lg4 xl4>
                            <v-select :items="hairColorOptions" v-model="caseObject.physical_data.hair_color"
                                      label="Hair color" item-text="text" item-value="value"
                                      style="padding: 5px 15px;">
                            </v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md4 lg4 xl4>
                            <v-select :items="skinColorOptions" v-model="caseObject.physical_data.skin_color"
                                      label="Skin color" item-text="text" item-value="value"
                                      style="padding: 5px 15px;">
                            </v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-text-field v-model.number="caseObject.physical_data.height" label="Height"
                                          suffix="cm"
                                          style="padding: 5px 15px;" type="number" min="10" max="300"
                                          placeholder="Between 10 and 300">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-text-field v-model.number="caseObject.physical_data.weight" label="Weight"
                                          suffix="kg"
                                          style="padding: 5px 15px;" type="number" min="5" max="200"
                                          placeholder="Between 5 and 200">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-select :items="statureOptions" v-model="caseObject.physical_data.stature"
                                      label="Stature" item-text="text" item-value="value"
                                      style="padding: 5px 15px;">
                            </v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-select :items="bodyOptions" v-model="caseObject.physical_data.body_type"
                                      label="Body type" item-text="text" item-value="value"
                                      style="padding: 5px 15px;">
                            </v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-textarea name="input-7-1" v-model="caseObject.physical_data.characteristics" box
                                        label="Characteristics"
                                        placeholder="Describe child's characteristics..." auto-grow rows="4"
                                        style="padding: 10px 15px;"
                                        counter maxlength="5000">
                            </v-textarea>
                        </v-flex>
                    </v-layout>
                    </v-card-text>
                </v-card>
                <!--<v-btn color="primary" @click="currentStep=6">Continue</v-btn>-->
                <!--<v-btn flat>Cancel</v-btn>-->
                <!--</v-stepper-content>-->

                <!--<v-stepper-step :complete="currentStep > 6" editable step="6">Medical data-->
                <!--</v-stepper-step>-->
                <!--<v-stepper-content step="6">-->
                <v-card color="grey lighten-5" class="mb-5" style="padding: 15px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Medical data</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                        <v-flex xs12 sm12 md4 lg4 xl4>
                            <v-select :items="heathIssuesOptions"
                                      v-model="caseObject.medical_data.health_issues"
                                      label="Health issues" item-text="text" item-value="value"
                                      style="padding: 5px 15px;">
                            </v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md4 lg4 xl4>
                            <v-checkbox v-model="caseObject.medical_data.medical_treatment_required"
                                        label="Require treatment"></v-checkbox>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-textarea name="input-7-1"
                                        v-model="caseObject.medical_data.health_issues_description" box
                                        label="Description"
                                        placeholder="Describe child's health issues..." auto-grow rows="4"
                                        style="padding: 10px 15px;"
                                        counter maxlength="5000">
                            </v-textarea>
                        </v-flex>
                    </v-layout>
                    </v-card-text>
                </v-card>
                <!--<v-btn color="primary" @click="currentStep=7">Save</v-btn>-->
                <!--<v-btn flat>Cancel</v-btn>-->
                <!--</v-stepper-content>-->

                <!--<v-stepper-step :complete="currentStep > 7" editable step="7">Psychological data-->
                <!--</v-stepper-step>-->
                <!--<v-stepper-content step="7">-->
                <v-card color="grey lighten-5" class="mb-5" style="padding: 15px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Psychological data</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-select :items="concernOptions" v-model="caseObject.psychological_data.concerns"
                                      label="Concerns" item-text="text" item-value="value"
                                      style="padding: 5px 15px;">
                            </v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-select :items="personalityOptions"
                                      v-model="caseObject.psychological_data.personality"
                                      label="Personality" item-text="text" item-value="value"
                                      style="padding: 5px 15px;">
                            </v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-select :items="familyOptions" v-model="caseObject.psychological_data.family"
                                      label="Family" item-text="text" item-value="value"
                                      style="padding: 5px 15px;">
                            </v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-select :items="parentsProfileOptions"
                                      v-model="caseObject.psychological_data.mothers_profile"
                                      label="Mother's profile" item-text="text" item-value="value"
                                      style="padding: 5px 15px;">
                            </v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-select :items="parentsProfileOptions"
                                      v-model="caseObject.psychological_data.fathers_profile"
                                      label="Fathers's profile" item-text="text" item-value="value"
                                      style="padding: 5px 15px;">
                            </v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-select :items="schoolGradesOptions"
                                      v-model="caseObject.psychological_data.school_grades"
                                      label="School grades" item-text="text" item-value="value"
                                      style="padding: 5px 15px;">
                            </v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-select :items="schoolAbsencesOptions"
                                      v-model="caseObject.psychological_data.school_absences"
                                      label="School absences" item-text="text" item-value="value"
                                      style="padding: 5px 15px;">
                            </v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-select :items="relationshipOptions"
                                      v-model="caseObject.psychological_data.relationship_status"
                                      label="Relationship" item-text="text" item-value="value"
                                      style="padding: 5px 15px;">
                            </v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-select :items="religionOptions"
                                      v-model="caseObject.psychological_data.religion"
                                      label="Religion" item-text="text" item-value="value"
                                      style="padding: 5px 15px;">
                            </v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md3 lg3 xl3>
                            <v-text-field v-model.number="caseObject.psychological_data.family_members"
                                          label="Family members"
                                          type="number"
                                          hint="" persistent-hint
                                          style="padding: 5px 15px;">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-textarea name="input-7-1"
                                        v-model="caseObject.psychological_data.hobbies" box
                                        label="Hobbies"
                                        placeholder="Describe child's hobbies..." auto-grow rows="4"
                                        style="padding: 10px 15px;"
                                        counter maxlength="5000">
                            </v-textarea>
                        </v-flex>
                    </v-layout>
                    </v-card-text>
                </v-card>
                <!--<v-btn color="primary" @click="currentStep=8">Continue</v-btn>-->
                <!--<v-btn flat>Cancel</v-btn>-->
                <!--</v-stepper-content>-->

                <!--<v-stepper-step :complete="currentStep > 8" editable step="8">Social media data-->
                <!--</v-stepper-step>-->
                <!--<v-stepper-content step="8">-->
                <v-card color="grey lighten-5" class="mb-5" style="padding: 15px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">Social media data</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-checkbox v-model="caseObject.social_media_data.has_social_profiles"
                                        label="Has social profiles" style="padding: 10px 15px;"></v-checkbox>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-textarea name="input-7-1"
                                        v-model="caseObject.social_media_data.description" box
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
                <v-btn color="primary" :disabled="!isFormValid" @click="save()">Save</v-btn>
                <v-btn flat>Cancel</v-btn>
                <!--</v-stepper-content>-->
                <!--</v-stepper>-->
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { bus } from '../../main';
import * as R from 'ramda';
import FeedbackMap from '../../components/FeedbackMap';

export default {
    components: {
        'feedback-map': FeedbackMap,
    },
    props: {
        id: null,
    },
    data() {
        return {
            baseUrl: process.env.VUE_APP_BACKEND,

            dateMenu: false,
            timeMenu: false,
            place: null,
            feedbackStatuses: [
                'pending', 'relevant', 'irrelevant', 'credible',
            ],
            childStatuses: [
                'ok', 'dead', 'initial', 'wounded'
            ],
            transportationChoices: ['foot', 'bus', 'car', 'train', 'other'],
            isFormValid: false,
            rules: {
                required: value => !!value || 'Field is required',
            },

            editMode: false,
            dateOfBirthMenu: false,
            arrivalAtFacilityMenu: false,
            disappearanceTypeOptions: [
                {
                    text: 'Runaway',
                    value: 'runaway'
                },
                {
                    text: 'Parental',
                    value: 'parental'
                },
                {
                    text: 'Abduction',
                    value: 'abduction'
                },
                {
                    text: 'Criminal',
                    value: 'criminal'
                },
                {
                    text: 'Missing',
                    value: 'missing'
                },
                {
                    text: 'Minor',
                    value: 'minor'
                },
                {
                    text: 'Tracing',
                    value: 'tracing'
                },
                {
                    text: 'Request',
                    value: 'request'
                },
                {
                    text: 'Unclear',
                    value: 'unclear'
                },
            ],
            genderOptions: [
                {
                    text: 'Male',
                    value: 'male'
                },
                {
                    text: 'Female',
                    value: 'female'
                },
                {
                    text: 'Unknown',
                    value: 'unknown'
                },
            ],
            educationOptions: [
                {
                    text: '1rst Grade',
                    value: 'first_grade'
                },
                {
                    text: '2nd Grade',
                    value: 'second_grade'
                },
                {
                    text: '3rd Grade',
                    value: 'third_grade'
                },
                {
                    text: 'Unknown',
                    value: 'unknown'
                },
            ],
            eyeColorOptions: [
                {
                    text: 'Blue',
                    value: 'blue'
                },
                {
                    text: 'Brown',
                    value: 'brown'
                },
                {
                    text: 'Gray',
                    value: 'gray'
                },
                {
                    text: 'Green',
                    value: 'green'
                },
                {
                    text: 'Other',
                    value: 'other'
                },
            ],
            hairColorOptions: [
                {
                    text: 'Black',
                    value: 'black'
                },
                {
                    text: 'Brown',
                    value: 'brown'
                },
                {
                    text: 'Red',
                    value: 'red'
                },
                {
                    text: 'Blond',
                    value: 'blond'
                },
                {
                    text: 'Other',
                    value: 'other'
                },
            ],
            skinColorOptions: [
                {
                    text: 'White',
                    value: 'white'
                },
                {
                    text: 'Brown',
                    value: 'brown'
                },
                {
                    text: 'Dark',
                    value: 'dark'
                },
                {
                    text: 'Other',
                    value: 'other'
                },
            ],
            statureOptions: [
                {
                    text: 'Tall',
                    value: 'tall'
                },
                {
                    text: 'Short',
                    value: 'short'
                },
                {
                    text: 'Normal',
                    value: 'normal'
                },
            ],
            bodyOptions: [
                {
                    text: 'Fat',
                    value: 'fat'
                },
                {
                    text: 'Slim',
                    value: 'slim'
                },
                {
                    text: 'Normal',
                    value: 'normal'
                },
            ],
            heathIssuesOptions: [
                {
                    text: 'Pathological',
                    value: 'pathological'
                },
                {
                    text: 'Diabetes',
                    value: 'diabetes'
                },
                {
                    text: 'Heart Issues',
                    value: 'heart_issues'
                },
                {
                    text: 'Other',
                    value: 'other'
                },
            ],
            concernOptions: [
                {
                    text: 'Child headed household',
                    value: 'child_headed_household'
                },
                {
                    text: 'Disabled',
                    value: 'disabled'
                },
                {
                    text: 'Medical case',
                    value: 'medical_case'
                },
                {
                    text: 'Street child',
                    value: 'street_child'
                },
            ],
            personalityOptions: [
                {
                    text: 'Antisocial',
                    value: 'antisocial'
                },
                {
                    text: 'Suicidal',
                    value: 'suicidal'
                },
                {
                    text: 'Autistic',
                    value: 'autistic'
                },
                {
                    text: 'Depressive',
                    value: 'depressive'
                },
            ],
            familyOptions: [
                {
                    text: 'Both parents',
                    value: 'both_parents'
                },
                {
                    text: 'Mother',
                    value: 'mother'
                },
                {
                    text: 'Father',
                    value: 'father'
                },
                {
                    text: 'No parents',
                    value: 'no_parents'
                },
            ],
            parentsProfileOptions: [
                {
                    text: 'Excellent',
                    value: 'excellent'
                },
                {
                    text: 'Good',
                    value: 'good'
                },
                {
                    text: 'Sufficient',
                    value: 'sufficient'
                },
                {
                    text: 'Not good',
                    value: 'not_good'
                },
                {
                    text: 'Really bad',
                    value: 'really_bad'
                },
                {
                    text: 'Unknown',
                    value: 'unknown'
                },
            ],
            schoolGradesOptions: [
                {
                    text: 'Excellent',
                    value: 'excellent'
                },
                {
                    text: 'Good',
                    value: 'good'
                },
                {
                    text: 'Sufficient',
                    value: 'average'
                },
                {
                    text: 'Not good',
                    value: 'not_good'
                },
                {
                    text: 'Bad',
                    value: 'bad'
                },
            ],
            schoolAbsencesOptions: [
                {
                    text: 'Low',
                    value: 'low'
                },
                {
                    text: 'Medium',
                    value: 'medium'
                },
                {
                    text: 'High',
                    value: 'high'
                },
                {
                    text: 'None',
                    value: 'none'
                },
                {
                    text: 'Unknown',
                    value: 'unknown'
                },
            ],
            relationshipOptions: [
                {
                    text: 'Single',
                    value: 'single'
                },
                {
                    text: 'Married',
                    value: 'married'
                },
                {
                    text: 'Divorced',
                    value: 'divorced'
                },
                {
                    text: 'Widowed',
                    value: 'widowed'
                },
                {
                    text: 'Other',
                    value: 'other'
                },
            ],
            religionOptions: [
                {
                    text: 'Christian',
                    value: 'christian'
                },
                {
                    text: 'Muslim',
                    value: 'muslim'
                },
                {
                    text: 'Atheist',
                    value: 'atheist'
                },
                {
                    text: 'Other',
                    value: 'other'
                },
            ],
            foundDateModal: false,
            image: null,
            imageUrl: require('../../assets/logo.png'),
            dialogCaseModal: false,
            currentStep: 1,
            genderItems: ['unknown', 'male', 'female'],
            caseStatus: ['active', 'closed'],
            linkItems: [
                {
                    text: 'Home',
                    disabled: false,
                    href: '/dashboard',
                },
                {
                    text: 'Cases',
                    disabled: false,
                    href: '/cases',
                }
            ],
        };
    },
    computed: {
        ...mapGetters('user_module', {
            getUser: 'getUser',
        }),
        ...mapGetters('case_module', {
            getCases: 'getCases',
            getCase: 'getCase',
            getCaseStructure: 'getCaseStructure',
        }),
        caseObject: {
            get() {
                if (this.editMode) {
                    return R.clone(this.getCase);
                } else {
                    return R.clone(this.getCaseStructure);
                }
            },
            // set(value) {
            //     this.updateAlertMutation(value);
            // },
        },
        ...mapGetters('feedback_module', {
            getFeedback: 'getFeedback',
            getFeedbackStructure: 'getFeedbackStructure',
        }),
        feedbackObject: {
            get() {
                if (this.getFeedback === null) {
                    return R.clone(this.getFeedbackStructure);
                } else {
                    return R.clone(this.getFeedback);
                }
            },
            set(value) {
                this.updateFeedbackMutation(value);
            },
        },
    },
    created() {

        bus.$off('update-feedback-coords-event');
        bus.$on('update-feedback-coords-event', () => {
            this.feedbackObject.latitude = this.getFeedback.latitude;
            this.feedbackObject.longitude = this.getFeedback.longitude;
        });

        bus.$off('update-feedback-location-event');
        bus.$on('update-feedback-location-event', () => {
            this.feedbackObject.address = this.getFeedback.address;
            this.feedbackObject.latitude = this.getFeedback.latitude;
            this.feedbackObject.longitude = this.getFeedback.longitude;
        });

        this.editMode = this.id && this.id !== null;

        if (this.editMode) {
            if (this.caseObject.amber_alert === undefined) {
                this.$router.push({ name: 'cases' });
            } else {
                this.linkItems.push({
                    text: `case: ${this.id}`,
                    disabled: true,
                });
                this.image = this.caseObject.profile_photo;
                this.imageUrl = this.getImagePath(this.caseObject.profile_photo);
            }
        } else {
            this.linkItems.push({
                text: 'New case',
                disabled: true,
            });
        }
    },
    mounted() {
        this.validateForm();
        bus.$emit('enable-feedback-geolocation-event');
    },
    methods: {
        ...mapMutations('generic_module', {
            showSnackbarMutation: 'showSnackbarMutation',
            hideSnackbarMutation: 'hideSnackbarMutation',
            showLoaderMutation: 'showLoaderMutation',
            hideLoaderMutation: 'hideLoaderMutation',
        }),
        ...mapMutations('feedback_module', {
            clearFeedbackMutation: 'clearFeedbackMutation',
            updateFeedbackMutation: 'updateFeedbackMutation',
            addToFeedbacksMutation: 'addToFeedbacksMutation',
            replaceToFeedbacksMutation: 'replaceToFeedbacksMutation',
        }),
        ...mapActions('feedback_module', {
            createFeedbackAction: 'createFeedbackAction',
            updateFeedbackAction: 'updateFeedbackAction',
        }),
        ...mapActions('case_module', {
            createCaseAction: 'createCaseAction',
            updateCaseAction: 'updateCaseAction',
            uploadImageAction: 'uploadImageAction',
        }),
        validateForm() {
            if (!this.editMode) {
                this.isFormValid = !!(this.caseObject.personal_data.first_name && this.caseObject.personal_data.last_name && this.feedbackObject.address && this.feedbackObject.latitude && this.feedbackObject.longitude
                && this.feedbackObject.date && this.feedbackObject.time);
            } else {
                this.isFormValid = !!(this.caseObject.personal_data.first_name && this.caseObject.personal_data.last_name);
            }
        },
        triggerPlaceChangeEvent(place) {
            this.place = place.formatted_address;
            bus.$emit('feedback-auto-complete-event', place);
            this.validateForm();
        },
        pickFile() {
            this.$refs.image.click();
        },
        setImage(e) {
            const file = e.target.files[0];
            if (!file.type.includes('image/')) {
                alert('Please select an image file');
                this.imageName = '';
                this.imageFile = '';
                this.imageUrl = require('../../assets/logo.png');
                return;
            }
            if (typeof FileReader === 'function') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.imageName = e.target.files[0].name;
                    this.imageFile = e.target.files[0];
                    this.imageUrl = event.target.result;

                    let formData = new FormData();
                    formData.append('image', this.imageFile);

                    this.uploadImageAction({ data: formData })
                        .then((response) => {
                            if (response.status === 201) {
                                this.caseObject.profile_photo = response.data;
                                this.image = response.data;
                                this.hideLoaderMutation();
                            } else {
                                this.hideLoaderMutation();
                            }
                        })
                        .catch((error) => {
                            this.hideLoaderMutation();
                            if (error.response) {
                                this.showSnackbarMutation({ message: error.response, status: 'error' });
                            } else {
                                this.showSnackbarMutation({ message: "Network error", status: 'error' });
                            }
                            setTimeout(() => {
                                this.hideSnackbarMutation();
                            }, 3000);
                        });


                    // this.updateBusinessObject();
                };
                reader.readAsDataURL(file);
            } else {
                alert('Sorry, FileReader API not supported');
                this.imageName = '';
                this.imageFile = '';
                this.imageUrl = require('../../assets/logo.png');
            }
        },
        getImagePath(path) {
            if (path === null) {
                return require('../../assets/logo.png');
            }

            if (this.baseUrl && this.baseUrl.length > 1) {
                return this.baseUrl + path;
            } else {
                return path;
            }
        },
        save() {
            if (this.editMode) {
                this.showLoaderMutation();
                this.updateCaseAction({ caseObject: this.caseObject })
                    .then((response) => {
                        if (response.status === 200) {
                            this.hideLoaderMutation();
                            this.$router.push({ name: 'cases' });
                        } else {
                            this.hideLoaderMutation();
                        }
                    })
                    .catch((error) => {
                        this.hideLoaderMutation();
                        this.image = null;
                        this.imageUrl = null;
                        this.currentStep = 1;
                        if (error.response) {
                            this.showSnackbarMutation({ message: error.response, status: 'error' });
                        } else {
                            this.showSnackbarMutation({ message: "Network error", status: 'error' });
                        }
                        setTimeout(() => {
                            this.hideSnackbarMutation();
                        }, 3000);
                    });
            } else {
                this.showLoaderMutation();
                this.createCaseAction({ caseObject: this.caseObject })
                    .then((response) => {
                        if (response.status === 201) {
                            this.hideLoaderMutation();
                            this.createFeedback(response.data.id);
                        } else {
                            this.hideLoaderMutation();
                        }
                    })
                    .catch((error) => {
                        this.hideLoaderMutation();
                        this.image = null;
                        this.imageUrl = null;
                        this.currentStep = 1;
                        if (error.response) {
                            this.showSnackbarMutation({ message: error.response, status: 'error' });
                        } else {
                            this.showSnackbarMutation({ message: "Network error", status: 'error' });
                        }
                        setTimeout(() => {
                            this.hideSnackbarMutation();
                        }, 3000);
                    });
            }
        },
        createFeedback(caseId) {
            this.feedbackObject.case = caseId;
            this.feedbackObject.feedback_status = 'credible';
            this.feedbackObject.source = this.getUser.last_name + ' ' + this.getUser.first_name;
            this.feedbackObject.source = '-';
            this.showLoaderMutation();
            this.createFeedbackAction({ feedbackObject: this.feedbackObject })
                .then((response) => {
                    if (response.status === 201) {
                        this.hideLoaderMutation();
                        this.$router.push({ name: 'cases' });
                    } else {
                        this.hideLoaderMutation();
                    }
                })
                .catch((error) => {
                    this.hideLoaderMutation();
                    if (error.response) {
                        this.showSnackbarMutation({ message: error.response, status: 'error' });
                    } else {
                        this.showSnackbarMutation({ message: "Network error", status: 'error' });
                    }
                    setTimeout(() => {
                        this.hideSnackbarMutation();
                    }, 3000);
                });
        },
    }
}
;
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
