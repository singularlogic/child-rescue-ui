:class="{'disable-events': true }"
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-if="isLoaded" style="padding: 10px;">
        <v-toolbar color="white" flat>
            <v-btn @click="cancel()" icon><v-icon>arrow_back</v-icon></v-btn>
            <div class="title">{{ $t('case.title') }}</div>
            <v-spacer></v-spacer>
            <v-btn @click="save()" color="primary">{{ $t('case.save') }}</v-btn>
            <v-btn flat @click="cancel()">{{ $t('case.cancel') }}</v-btn>
        </v-toolbar>
        <v-layout>
            <v-flex xs12 sm12 md12 lg12 xl12>
                <v-card color="grey lighten-5" class="mb-5" style="padding: 15px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;">
                            <span style="font-size: large; font-weight: bold;">{{ $t('case.personal_data') }}</span><br/>
                            <span style="font-size: small;">{{ $t('case.required_fields') }}</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.first_name" :label="$t('case.star_first_name')"
                                              :rules="[rules.required]"
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.last_name" :label="$t('case.star_last_name')"
                                              :rules="[rules.required]"
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 md3 lg3 xl3>
                                <v-text-field
                                    class="textField"
                                    ref="customName"
                                    v-model="caseObject.custom_name"
                                    :label="$t('case.custom_name')"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-menu v-model="dateOfBirthMenu" :close-on-content-click="false" :nudge-right="40"
                                        lazy
                                        transition="scale-transition" offset-y full-width min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="caseObject.date_of_birth"
                                                      :label="$t('case.star_date_of_birth')"
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
                                          :label="$t('case.star_gender')" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-menu v-model="contactedDateMenu" :close-on-content-click="false" :nudge-right="40"
                                        lazy
                                        transition="scale-transition" offset-y full-width min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="caseObject.contacted_date"
                                                      :label="$t('case.contacted_date')"
                                                      prepend-icon="event" readonly v-on="on"
                                                      style="padding: 5px 15px;"
                                                      clearable>
                                        </v-text-field>
                                    </template>
                                    <v-date-picker v-model="caseObject.contacted_date"
                                                   @input="contactedDateMenu = false"></v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.father_fullname"
                                              :label="$t('case.father_full_name')" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.mother_fullname"
                                              :label="$t('case.mother_full_name')" class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.phone" :label="$t('case.contact_phone')"
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex v-if="$store.state.role==='facility_manager'" xs12 sm12 md3 lg3 xl3>
                                <v-menu v-model="arrivalAtFacilityMenu" :close-on-content-click="false"
                                        :nudge-right="40" lazy
                                        transition="scale-transition" offset-y full-width min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="caseObject.arrival_at_facility_date"
                                                      :label="$t('case.star_arrival_at_facility')"
                                                      prepend-icon="event" readonly v-on="on"
                                                      style="padding: 5px 15px;"
                                                      clearable
                                                      :placeholder="$t('case.arrival_at_facility_placeholder')">
                                        </v-text-field>
                                    </template>
                                    <v-date-picker v-model="caseObject.arrival_at_facility_date"
                                                   @input="arrivalAtFacilityMenu = false">
                                    </v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex v-else xs12 sm12 md3 lg3 xl3>
                                <v-select :items="disappearanceTypeOptions"
                                          v-model="caseObject.disappearance_type"
                                          :label="$t('case.dis_type')" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="isRefugeeOptions"
                                          v-model="caseObject.is_refugee"
                                          :label="$t('case.is_refugee')" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="riskOptions"
                                          v-model="caseObject.is_high_risk"
                                          :label="$t('case.is_high_risk')" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="legalStatusOptions"
                                          v-model="caseObject.legal_status"
                                          :label="$t('case.legal_status')" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-textarea name="input-7-1"
                                            v-model="caseObject.description" box
                                            :label="$t('case.description')"
                                            :placeholder="$t('case.description_placeholder')" auto-grow
                                            rows="4"
                                            style="padding: 10px 15px;"
                                            counter maxlength="5000">
                                </v-textarea>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.home_country"
                                              :label="$t('case.home_country')"
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.home_address"
                                              :label="$t('case.home_address')"
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.birth_country"
                                              :label="$t('case.birth_country')"
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.nationality"
                                              :label="$t('case.nationality')"
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model="caseObject.religion"
                                              :label="$t('case.religion')"
                                              class="textField"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model.number="caseObject.languages_spoken"
                                              :label="$t('case.lang_spoken')"
                                              style="padding: 5px 15px;">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="educationOptions"
                                          v-model="caseObject.education_level"
                                          :label="$t('case.education_level')"
                                          :placeholder="$t('case.education_placeholder')"
                                          item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="schoolGradesOptions"
                                          v-model="caseObject.school_grades"
                                          :label="$t('case.school_grades')"
                                          item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex v-if="$store.state.role==='facility_manager'" xs12>
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 md12 lg12 xl12 class="text-xs-center text-sm-center text-md-center text-lg-center mbot">
                                        <v-text-field
                                            v-model="getChildImageName"
                                            :label="$t('case.child_photo')"
                                            :value="caseObject.profile_photo"
                                            :placeholder="$t('case.child_photo_placeholder')"
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
                                             style="max-width: 340px; max-height: 250px;"></img>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-card v-if="$store.state.role!=='facility_manager'" color="grey lighten-5" class="mb-5" style="padding: 15px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;">
                            <span style="font-size: large; font-weight: bold;">
                                {{ $t('case.investigation_details') }}
                            </span><br/>
                            <span style="font-size: small;">
                                {{ $t('case.required_fields') }}</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="form">
                            <v-layout v-if="!editMode" row wrap>
                                <v-flex xs12 sm12 md12 lg12 xl12>
                                    <v-layout row wrap>
                                        <v-flex xs12 sm10 md10 lg10 xl10>
                                            <v-text-field
                                                ref="addressField"
                                                v-model="place"
                                                :rules="[rules.address, rules.required]"
                                                :label="$t('case.address')"
                                                :hint="$t('case.address_hint')"
                                                persistent-hint
                                                prepend-icon="pin_drop"
                                                class="textField"
                                                @keyup.enter.native="triggerPlaceChangeEvent(place)"/>
                                        </v-flex>
                                        <v-flex xs12 sm2 md2 lg2 xl2 class="text-xs-center">
                                            <v-btn dark color="primary" @click="triggerPlaceChangeEvent(place)">{{ $t('case.find_address') }}</v-btn>
                                        </v-flex>
                                        <v-flex xs12 sm12 md12 lg12 xl12 style="margin: 10px;">
                                            <gmap-map :center="center" :zoom="18" :options="mapOptions"
                                                      style="width:100%;  height: 230px; margin-bottom: 5px;">
                                                <gmap-marker v-for="(m, index) in markers" :key="index" :position="m.position" :clickable="false"
                                                             :draggable="false" @click="center=m.position"/>
                                            </gmap-map>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 sm12 md12 lg12 xl12 style="margin-top: 10px;">
                                    <v-layout wrap>
                                        <v-flex xs12 sm12 md6 lg6 xl6>
                                            <v-text-field v-model="feedbackObject.latitude"
                                                          class="header-text-field-input"
                                                          :rules="[rules.required]"
                                                          :label="$t('case.star_latitude')" placeholder="-" disabled
                                                          style="padding: 5px 15px;"
                                                          prepend-icon="my_location"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm12 md6 lg6 xl6>
                                            <v-text-field v-model="feedbackObject.longitude"
                                                          :rules="[rules.required]"
                                                          class="header-text-field-input"
                                                          :label="$t('case.star_logitude')" placeholder="-" disabled
                                                          style="padding: 5px 15px;"
                                                          prepend-icon="my_location"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm12 md6 lg6 xl6>
                                            <date-time-picker v-model="feedbackObject.date"
                                                              :label="$t('case.incident_datetime')"
                                                              prepend-icon="access_time" class="mx-2"
                                                              :rules="[rules.required]"></date-time-picker>
                                        </v-flex>
                                        <v-flex xs12 sm12 md3 lg3 xl3>
                                            <v-select :items="childStatuses"
                                                      v-model="feedbackObject.child_status"
                                                      :label="$t('case.child_status')"
                                                      style="padding: 5px 15px;">
                                            </v-select>
                                        </v-flex>
                                        <v-flex xs12 sm12 md3 lg3 xl3>
                                            <v-select :items="transportationChoices"
                                                      v-model="feedbackObject.transportation"
                                                      :label="$t('case.transportation')"
                                                      style="padding: 5px 15px;">
                                            </v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                            <v-layout align-start justify-space-around row fill-height wrap>
                                <v-flex xs12 sm12 md12 lg12 xl12>
                                    <v-layout row wrap>
                                        <v-flex xs12 sm12 md4>
                                            <v-select :items="mobileOptions"
                                                      v-model="caseObject.has_mobile_phone"
                                                      :label="$t('case.has_mobile')"
                                                      style="padding: 5px 15px;">
                                            </v-select>
                                        </v-flex>
                                        <v-flex xs12 sm12 md4>
                                            <v-select :items="moneyOptions"
                                                      v-model="caseObject.has_money_or_credit"
                                                      :label="$t('case.has_money')"
                                                      style="padding: 5px 15px;">
                                            </v-select>
                                        </v-flex>
                                        <v-flex xs12 sm12 md4>
                                            <v-select :items="booleanOptions"
                                                      v-model="caseObject.has_area_knowledge"
                                                      :label="$t('case.has_area_knowledge')"
                                                      style="padding: 5px 15px;">
                                            </v-select>
                                        </v-flex>
                                        <v-flex xs12 sm12 md4>
                                            <v-select :items="booleanOptions"
                                                      v-model="caseObject.clothing_with_scent"
                                                      :label="$t('case.scent')"
                                                      style="padding: 5px 15px;">
                                            </v-select>
                                        </v-flex>
                                        <v-flex xs12 sm12 md4>
                                            <v-select :items="booleanOptions"
                                                      v-model="caseObject.is_first_time_missing"
                                                      :label="$t('case.first_time_miss')"
                                                      tyle="padding: 5px 15px;">
                                            </v-select>
                                        </v-flex>
                                        <v-flex xs12 sm12 md6 lg6 xl6>
                                            <v-textarea name="input-7-1"
                                                        v-model="caseObject.transit_country" box
                                                        :label="$t('case.transit_country')"
                                                        :placeholder="$t('case.transit_country_placeholder')"
                                                        auto-grow
                                                        rows="2"
                                                        style="padding: 5px 15px;"
                                                        counter maxlength="1000">
                                            </v-textarea>
                                        </v-flex>
                                        <v-flex xs12 sm12 md3 lg3 xl3>
                                            <v-checkbox v-model="caseObject.volunteers_utilized"
                                                        :label="$t('case.has_volunteers')"
                                                        style="padding: 5px 15px;"></v-checkbox>
                                        </v-flex>
                                        <v-flex xs12 sm12 md3 lg3 xl3>
                                            <v-checkbox v-model="caseObject.rescue_teams_utilized"
                                                        :label="$t('case.has_rescue_teams')"
                                                        style="padding: 5px 15px;"></v-checkbox>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-form>
                    </v-card-text>
                </v-card>
                <v-card v-if="$store.state.role!=='facility_manager'" color="grey lighten-5" class="mb-5" style="padding: 15px;">
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">{{ $t('case.alert_details') }}</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md6 lg6 xl6>
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 md12 lg12 xl12 class="text-xs-center text-sm-center text-md-center text-lg-center mbot">
                                        <v-text-field
                                            v-model="getChildImageName"
                                            :label="$t('case.child_photo')"
                                            :value="caseObject.profile_photo"
                                            :placeholder="$t('case.child_photo_placeholder')"
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
                                             style="max-width: 340px; max-height: 250px;"></img>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 sm12 md6 lg6 xl6>
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-switch v-model="caseObject.amber_alert"
                                                  :label="$t('case.amber_alert')"
                                                  style="padding: 5px 15px;"></v-switch>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-textarea name="input-7-1"
                                                    v-model="caseObject.default_message" box
                                                    :label="$t('case.default_alert_message')"
                                                    :placeholder="$t('case.default_alert_message')" auto-grow
                                                    rows="8"
                                                    style="padding: 5px 15px;"
                                                    counter maxlength="5000">
                                        </v-textarea>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                    <v-card-title>
                        <div style="margin-bottom: 0px;"><span
                            style="font-size: large; font-weight: bold;">{{ $t('case.physical_data') }}</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.eye_color"
                                              :label="$t('case.eye_color')"
                                              style="padding: 5px 15px;">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-text-field v-model="caseObject.hair_color"
                                              :label="$t('case.hair_color')"
                                              style="padding: 5px 15px;">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-select :items="skinColorOptions" v-model="caseObject.skin_color"
                                          :label="$t('case.skin_color')"
                                          item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model.number="caseObject.height"
                                              :label="$t('case.height')"
                                              :placeholder="$t('case.height_placeholder')"
                                              suffix="cm"
                                              style="padding: 5px 15px;" type="number" min="10" max="300">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model.number="caseObject.weight"
                                              :label="$t('case.weight')"
                                              :placeholder="$t('case.weight_placeholder')"
                                              suffix="kg"
                                              style="padding: 5px 15px;" type="number" min="5" max="200">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="statureOptions" v-model="caseObject.stature"
                                          :label="$t('case.stature')" item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="bodyOptions" v-model="caseObject.body_type"
                                          :label="$t('case.body_type')"
                                          item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-textarea name="input-7-1" v-model="caseObject.characteristics" box
                                            :label="$t('case.chars')"
                                            :placeholder="$t('case.chars_placeholder')"
                                            auto-grow rows="4"
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
                            style="font-size: large; font-weight: bold;">{{ $t('case.phycological_data') }}</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="triggeredEventOptions"
                                          v-model="caseObject.triggered_event"
                                          :label="$t('case.has_trigger_event')"
                                          item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="concernOptions" v-model="caseObject.concerns"
                                          :label="$t('case.has_family_issues')"
                                          item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="disappearanceReasonsOptions" v-model="caseObject.disappearance_reasons"
                                          :label="$t('case.dis_reasons')"
                                          item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="disorderOptions"
                                          v-model="caseObject.mental_disorders"
                                          :label="$t('case.mental_disorders')"
                                          item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="disorderOptions"
                                          v-model="caseObject.psychological_disorders"
                                          :label="$t('case.psychological_disorders')"
                                          item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="addictionOptions"
                                          v-model="caseObject.physical_disabilities"
                                          :label="$t('case.disabilities')"
                                          item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="livingEnvironmentOptions" v-model="caseObject.living_environment"
                                          :label="$t('case.living_env')"
                                          item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="parentsProfileOptions"
                                          v-model="caseObject.parents_profile"
                                          :label="$t('case.parent_issues')"
                                          item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-select :items="relationshipOptions"
                                          v-model="caseObject.relationship_status"
                                          :label="$t('case.relationship')"
                                          item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-text-field v-model.number="caseObject.family_members"
                                              :label="$t('case.family_members')"
                                              type="number"
                                              hint="" persistent-hint
                                              style="padding: 5px 15px;">
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-select :items="addictionOptions"
                                          v-model="caseObject.addiction"
                                          :label="$t('case.addiction')"
                                          item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-select :items="heathIssuesOptions"
                                          v-model="caseObject.health_issues"
                                          :label="$t('case.health_issues')"
                                          item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md4 lg4 xl4>
                                <v-select :items="medicalTreatmentOptions"
                                          v-model="caseObject.medical_treatment_required"
                                          :label="$t('case.treatment_required')"
                                          item-text="text" item-value="value"
                                          style="padding: 5px 15px;">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <v-textarea name="input-7-1"
                                            v-model="caseObject.health_issues_description" box
                                            :label="$t('case.description')"
                                            :placeholder="$t('case.description_health_placeholder')"
                                            auto-grow rows="4"
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
                            style="font-size: large; font-weight: bold;">{{ $t('case.social_media_data') }}</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout v-for="socialMediaItem in socialMedia" :key="socialMediaItem.medium" row wrap>
                            <v-flex xs12 sm12 md3 lg3 xl3>
                                <v-chip outline label>
                                    <v-icon left>label</v-icon>{{ socialMediaItem.medium }}
                                </v-chip>
                            </v-flex>
                            <v-flex xs12 sm12 md3>
                                <v-select :items="publishedPhotosOptions"
                                          v-model="socialMediaItem.published_photos"
                                          :label="$t('case.published_photos')" item-text="text" item-value="value" class="noPadding mx-2">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3>
                                <v-select :items="followersOptions"
                                          v-model="socialMediaItem.followers"
                                          :label="$t('case.followers')" item-text="text" item-value="value" class="noPadding mx-2">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md3>
                                <v-select :items="recentActivityOptions"
                                          v-model="socialMediaItem.recent_activity"
                                          :label="$t('case.recent_activity')"
                                          item-text="text" item-value="value" class="noPadding mx-2">
                                </v-select>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { bus } from '../../main';
import { UsersApi, CasesApi, FeedbacksApi, FacilitiesApi } from '@/api';
import { DateTimePicker } from '@/components';

export default {
    components: {
        DateTimePicker,
    },
    props: {
        childId: {
            type: Number,
            default: null,
        },
        caseObjectProp: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            caseObject: {},
            isLoaded: false,
            userObject: {},
            socialMedia: [
                {
                    medium: 'Facebook',
                    published_photos: null,
                    followers: null,
                    recent_activity: null,
                },
                {
                    medium: 'Instagram',
                    published_photos: null,
                    followers: null,
                    recent_activity: null,
                },
                {
                    medium: 'Snapchat',
                    published_photos: null,
                    followers: null,
                    recent_activity: null,
                },
                {
                    medium: 'Dating app',
                    published_photos: null,
                    followers: null,
                    recent_activity: null,
                },
                {
                    medium: 'Other',
                    published_photos: null,
                    followers: null,
                    recent_activity: null,
                },
            ],
            center: { lat: 45.508, lng: -73.587 },
            markers: [],
            places: [],
            currentPlace: null,
            mapOptions: {
                // disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: true,
                streetViewControl: true,
            },
            getChildImageNameValue: null,
            feedbackObject: {
                child_status: null,
                transportation: null,
            },
            baseUrl: process.env.VUE_APP_BACKEND,
            place: null,
            isFormValid: false,
            rules: {
                required: value => !!value || this.$t('case.rules_required'),
                address: value => (value && value.length > 5 && value.length < 250) || this.$t('case.rules_address'),
            },
            editMode: false,
            dateOfBirthMenu: false,
            contactedDateMenu: false,
            arrivalAtFacilityMenu: false,
            childStatuses: [
                {
                    text: 'OK',
                    value: 'ok',
                },
                {
                    text: this.$t('case.child_status_choice.appearance_change'),
                    value: 'appearance_change',
                },
                {
                    text: this.$t('case.child_status_choice.shocked'),
                    value: 'shocked',
                },
                {
                    text: this.$t('case.child_status_choice.injured_sick'),
                    value: 'injured_sick',
                },
                {
                    text: this.$t('case.child_status_choice.deceased'),
                    value: 'deceased',
                },
                {
                    text: this.$t('case.child_status_choice.unknown'),
                    value: null,
                },
            ],
            transportationChoices: [
                {
                    text: this.$t('case.transport_choice.foot'),
                    value: 'foot',
                },
                {
                    text: this.$t('case.transport_choice.bus_tram'),
                    value: 'bus_tram',
                },
                {
                    text: this.$t('case.transport_choice.car_motorcycle'),
                    value: 'car_motorcycle',
                },
                {
                    text: this.$t('case.transport_choice.train'),
                    value: 'train',
                },
                {
                    text: this.$t('case.transport_choice.metro_subway'),
                    value: 'metro_subway',
                },
                {
                    text: this.$t('case.transport_choice.bicycle_scooter'),
                    value: 'bicycle_scooter',
                },
                {
                    text: this.$t('case.transport_choice.ship_aeroplane'),
                    value: 'ship_aeroplane',
                },
                {
                    text: this.$t('case.transport_choice.unknown'),
                    value: null,
                },
            ],
            disappearanceTypeOptions: [
                {
                    text: this.$t('case.disap_type.runaway'),
                    value: 'runaway',
                },
                {
                    text: this.$t('case.disap_type.parental_abduction'),
                    value: 'parental_abduction',
                },
                {
                    text: this.$t('case.disap_type.lost'),
                    value: 'lost',
                },
                {
                    text: this.$t('case.disap_type.missing'),
                    value: 'missing',
                },
                {
                    text: this.$t('case.disap_type.third_party_abduction'),
                    value: 'third_party_abduction',
                },
                {
                    text: this.$t('case.disap_type.unknown'),
                    value: null,
                },
            ],
            genderOptions: [
                {
                    text: this.$t('case.gender_choice.male'),
                    value: 'male',
                },
                {
                    text: this.$t('case.gender_choice.female'),
                    value: 'female',
                },
                {
                    text: this.$t('case.gender_choice.unknown'),
                    value: null,
                },
            ],
            isRefugeeOptions: [
                {
                    text: this.$t('case.yes_no_choice.yes'),
                    value: 'yes',
                },
                {
                    text: this.$t('case.yes_no_choice.no'),
                    value: 'no',
                },
                {
                    text: this.$t('case.yes_no_choice.unknown'),
                    value: null,
                },
            ],
            riskOptions: [
                {
                    text: this.$t('case.yes_no_choice.yes'),
                    value: 'yes',
                },
                {
                    text: this.$t('case.yes_no_choice.no'),
                    value: 'no',
                },
                {
                    text: this.$t('case.yes_no_choice.unknown'),
                    value: null,
                },
            ],
            legalStatusOptions: [
                {
                    text: this.$t('case.legal_choice.illegal'),
                    value: 'illegal',
                },
                {
                    text: this.$t('case.legal_choice.asylum_applied'),
                    value: 'asylum_applied',
                },
                {
                    text: this.$t('case.legal_choice.legal'),
                    value: 'legal',
                },
                {
                    text: this.$t('case.legal_choice.unknown'),
                    value: null,
                },
            ],
            educationOptions: [
                {
                    text: this.$t('case.education_choice.first_grade'),
                    value: 'first_grade',
                },
                {
                    text: this.$t('case.education_choice.second_grade'),
                    value: 'second_grade',
                },
                {
                    text: this.$t('case.education_choice.third_grade'),
                    value: 'third_grade',
                },
                {
                    text: this.$t('case.education_choice.unknown'),
                    value: null,
                },
            ],
            skinColorOptions: [
                {
                    text: this.$t('case.skin_choice.light_pale'),
                    value: 'light_pale',
                },
                {
                    text: this.$t('case.skin_choice.pale'),
                    value: 'pale',
                },
                {
                    text: this.$t('case.skin_choice.tanned'),
                    value: 'tanned',
                },
                {
                    text: this.$t('case.skin_choice.brown'),
                    value: 'brown',
                },
                {
                    text: this.$t('case.skin_choice.dark_brown'),
                    value: 'dark_brown',
                },
                {
                    text: this.$t('case.skin_choice.black'),
                    value: 'black',
                },
                {
                    text: this.$t('case.skin_choice.unknown'),
                    value: null,
                },
            ],
            statureOptions: [
                {
                    text: this.$t('case.stature_choice.tall'),
                    value: 'tall',
                },
                {
                    text: this.$t('case.stature_choice.short'),
                    value: 'short',
                },
                {
                    text: this.$t('case.stature_choice.normal'),
                    value: 'normal',
                },
                {
                    text: this.$t('case.stature_choice.unknown'),
                    value: null,
                },
            ],
            bodyOptions: [
                {
                    text: this.$t('case.body_choice.slim'),
                    value: 'slim',
                },
                {
                    text: this.$t('case.body_choice.normal'),
                    value: 'normal',
                },
                {
                    text: this.$t('case.body_choice.overweight'),
                    value: 'overweight',
                },
                {
                    text: this.$t('case.body_choice.corpulent'),
                    value: 'corpulent',
                },
                {
                    text: this.$t('case.body_choice.unknown'),
                    value: null,
                },
            ],
            heathIssuesOptions: [
                {
                    text: this.$t('case.yes_no_choice.yes'),
                    value: 'yes',
                },
                {
                    text: this.$t('case.yes_no_choice.no'),
                    value: 'no',
                },
                {
                    text: this.$t('case.yes_no_choice.unknown'),
                    value: null,
                },
            ],
            medicalTreatmentOptions: [
                {
                    text: this.$t('case.yes_no_choice.yes'),
                    value: 'yes',
                },
                {
                    text: this.$t('case.yes_no_choice.no'),
                    value: 'no',
                },
                {
                    text: this.$t('case.yes_no_choice.unknown'),
                    value: null,
                },
            ],
            triggeredEventOptions: [
                {
                    text: this.$t('case.yes_no_choice.yes'),
                    value: 'yes',
                },
                {
                    text: this.$t('case.yes_no_choice.no'),
                    value: 'no',
                },
                {
                    text: this.$t('case.yes_no_choice.unknown'),
                    value: null,
                },
            ],
            concernOptions: [
                {
                    text: this.$t('case.concern_choice.neglect'),
                    value: 'neglect',
                },
                {
                    text: this.$t('case.concern_choice.parent_relation'),
                    value: 'parent_relation',
                },
                {
                    text: this.$t('case.concern_choice.parent_separation'),
                    value: 'parent_separation',
                },
                {
                    text: this.$t('case.concern_choice.on_migration'),
                    value: 'on_migration',
                },
                {
                    text: this.$t('case.concern_choice.parents_in_dispute'),
                    value: 'parents_in_dispute',
                },
                {
                    text: this.$t('case.concern_choice.physical_sexual_abuse'),
                    value: 'physical_sexual_abuse',
                },
                {
                    text: this.$t('case.concern_choice.death_of_family_member'),
                    value: 'death_of_family_member',
                },
                {
                    text: this.$t('case.concern_choice.possibly'),
                    value: 'possibly',
                },
                {
                    text: this.$t('case.concern_choice.none'),
                    value: 'none',
                },
                {
                    text: this.$t('case.concern_choice.unknown'),
                    value: null,
                },
            ],
            disappearanceReasonsOptions: [
                {
                    text: this.$t('case.disap_reason_choice.family_issues'),
                    value: 'family_issues',
                },
                {
                    text: this.$t('case.disap_reason_choice.personal_issues'),
                    value: 'personal_issues',
                },
                {
                    text: this.$t('case.disap_reason_choice.love_affair'),
                    value: 'love_affair',
                },
                {
                    text: this.$t('case.disap_reason_choice.health_issues'),
                    value: 'health_issues',
                },
                {
                    text: this.$t('case.disap_reason_choice.mass_disaster'),
                    value: 'mass_disaster',
                },
                {
                    text: this.$t('case.disap_reason_choice.migration'),
                    value: 'migration',
                },
                {
                    text: this.$t('case.disap_reason_choice.other'),
                    value: 'other',
                },
                {
                    text: this.$t('case.disap_reason_choice.unknown'),
                    value: null,
                },
            ],
            disorderOptions: [
                {
                    text: this.$t('case.disorder_choice.possibly'),
                    value: 'possibly',
                },
                {
                    text: this.$t('case.disorder_choice.mild'),
                    value: 'mild',
                },
                {
                    text: this.$t('case.disorder_choice.moderate'),
                    value: 'moderate',
                },
                {
                    text: this.$t('case.disorder_choice.severe'),
                    value: 'severe',
                },
                {
                    text: this.$t('case.disorder_choice.none'),
                    value: 'none',
                },
                {
                    text: this.$t('case.disorder_choice.unknown'),
                    value: null,
                },
            ],
            addictionOptions: [
                {
                    text: this.$t('case.yes_no_choice.yes'),
                    value: 'yes',
                },
                {
                    text: this.$t('case.yes_no_choice.no'),
                    value: 'no',
                },
                {
                    text: this.$t('case.yes_no_choice.unknown'),
                    value: null,
                },
            ],
            livingEnvironmentOptions: [
                {
                    text: this.$t('case.living_choice.divorced_parents'),
                    value: 'divorced_parents',
                },
                {
                    text: this.$t('case.living_choice.single_bio_parent'),
                    value: 'single_bio_parent',
                },
                {
                    text: this.$t('case.living_choice.both_bio_parents'),
                    value: 'both_bio_parents',
                },
                {
                    text: this.$t('case.living_choice.bio_step_parents'),
                    value: 'bio_step_parents',
                },
                {
                    text: this.$t('case.living_choice.camp'),
                    value: 'camp',
                },
                {
                    text: this.$t('case.living_choice.relatives'),
                    value: 'relatives',
                },
                {
                    text: this.$t('case.living_choice.institution'),
                    value: 'institution',
                },
                {
                    text: this.$t('case.living_choice.transit'),
                    value: 'transit',
                },
                {
                    text: this.$t('case.living_choice.unknown'),
                    value: null,
                },
            ],
            parentsProfileOptions: [
                {
                    text: this.$t('case.parent_profile_choice.father_step_father'),
                    value: 'father_step_father',
                },
                {
                    text: this.$t('case.parent_profile_choice.mother_stepmother'),
                    value: 'mother_stepmother',
                },
                {
                    text: this.$t('case.parent_profile_choice.both'),
                    value: 'both',
                },
                {
                    text: this.$t('case.parent_profile_choice.none'),
                    value: 'none',
                },
                {
                    text: this.$t('case.parent_profile_choice.unknown'),
                    value: null,
                },
            ],
            schoolGradesOptions: [
                {
                    text: this.$t('case.grades_choice.not_attending'),
                    value: 'not_attending',
                },
                {
                    text: this.$t('case.grades_choice.excellent'),
                    value: 'excellent',
                },
                {
                    text: this.$t('case.grades_choice.good'),
                    value: 'good',
                },
                {
                    text: this.$t('case.grades_choice.average'),
                    value: 'average',
                },
                {
                    text: this.$t('case.grades_choice.not_good'),
                    value: 'not_good',
                },
                {
                    text: this.$t('case.grades_choice.bad'),
                    value: 'bad',
                },
                {
                    text: this.$t('case.grades_choice.unknown'),
                    value: null,
                },
            ],
            relationshipOptions: [
                {
                    text: this.$t('case.relationship_choice.single'),
                    value: 'single',
                },
                {
                    text: this.$t('case.relationship_choice.in_relationship'),
                    value: 'in_relationship',
                },
                {
                    text: this.$t('case.relationship_choice.complicated'),
                    value: 'complicated',
                },
                {
                    text: this.$t('case.relationship_choice.broke_up'),
                    value: 'broke_up',
                },
                {
                    text: this.$t('case.relationship_choice.unknown'),
                    value: null,
                },
            ],
            publishedPhotosOptions: [
                {
                    text: this.$t('case.yes_no_choice.yes'),
                    value: 'yes',
                },
                {
                    text: this.$t('case.yes_no_choice.no'),
                    value: 'no',
                },
                {
                    text: this.$t('case.yes_no_choice.unknown'),
                    value: null,
                },
            ],
            followersOptions: [
                {
                    text: this.$t('case.follower_choice.low'),
                    value: 'low',
                },
                {
                    text: this.$t('case.follower_choice.medium'),
                    value: 'medium',
                },
                {
                    text: this.$t('case.follower_choice.high'),
                    value: 'high',
                },
                {
                    text: this.$t('case.follower_choice.influencer'),
                    value: 'influencer',
                },
                {
                    text: this.$t('case.follower_choice.unknown'),
                    value: null,
                },
            ],
            recentActivityOptions: [
                {
                    text: this.$t('case.activity_choice.daily'),
                    value: 'daily',
                },
                {
                    text: this.$t('case.activity_choice.frequently'),
                    value: 'frequently',
                },
                {
                    text: this.$t('case.activity_choice.infrequent'),
                    value: 'infrequent',
                },
                {
                    text: this.$t('case.activity_choice.inactive'),
                    value: 'inactive',
                },
                {
                    text: this.$t('case.activity_choice.unknown'),
                    value: null,
                },
            ],
            booleanOptions: [
                {
                    text: this.$t('case.yes_no_choice.yes'),
                    value: 'yes',
                },
                {
                    text: this.$t('case.yes_no_choice.no'),
                    value: 'no',
                },
                {
                    text: this.$t('case.yes_no_choice.unknown'),
                    value: null,
                },
            ],
            mobileOptions: [
                {
                    text: this.$t('case.mobile_choice.yes'),
                    value: 'yes',
                },
                {
                    text: this.$t('case.mobile_choice.deactivated'),
                    value: 'deactivated',
                },
                {
                    text: this.$t('case.mobile_choice.abductor'),
                    value: 'abductor',
                },
                {
                    text: this.$t('case.mobile_choice.no'),
                    value: 'no',
                },
                {
                    text: this.$t('case.mobile_choice.unknown'),
                    value: null,
                },
            ],
            moneyOptions: [
                {
                    text: this.$t('case.money_choice.yes'),
                    value: 'yes',
                },
                {
                    text: this.$t('case.money_choice.probably_yes'),
                    value: 'probably_yes',
                },
                {
                    text: this.$t('case.money_choice.probably_no'),
                    value: 'probably_no',
                },
                {
                    text: this.$t('case.money_choice.no'),
                    value: 'no',
                },
                {
                    text: this.$t('case.money_choice.unknown'),
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
            caseStatus: ['active', 'closed'],
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
                if (this.caseObject.profile_photo === '' || this.caseObject.profile_photo === null || this.caseObject.profile_photo === undefined) {
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
        this.caseObject = this.caseObjectProp;
        if (!this.caseObject) {
            if (this.$route.params.id) {
                const { data: caseObject } = await CasesApi.get(this.$route.params.id);
                this.caseObject = caseObject;
                const { data: socialMedia } = await CasesApi.getSocialMedia({ case_id: this.$route.params.id });
                this.socialMedia = socialMedia;
            } else {
                this.caseObject = {
                    social_media_data: {},
                };
            }
            this.caseObject.organization = this.userObject.organization;
        } else {
            const { data: socialMedia } = await CasesApi.getSocialMedia({ case_id: this.$route.params.id });
            this.socialMedia = socialMedia;
        }
        this.imageName = this.caseObject.profile_photo;
        this.editMode = this.caseObject.id && this.caseObject.id !== null;
        if (this.childId !== null) {
            await this.getChild();
        }
        this.isLoaded = true;
    },
    methods: {
        async getChild() {
            const { data: childObject } = await CasesApi.getChild(this.childId);
            this.caseObject.first_name = childObject.first_name;
            this.caseObject.last_name = childObject.last_name;
            this.caseObject.father_fullname = childObject.father_fullname;
            this.caseObject.mother_fullname = childObject.mother_fullname;
            this.caseObject.date_of_birth = childObject.date_of_birth;
            this.caseObject.gender = childObject.gender;
            this.caseObject.phone = childObject.phone;
        },
        validateForm() {
            if (this.$store.state.role !== 'facility_manager') {
                if (!this.editMode) {
                    this.isFormValid = !!(this.caseObject.first_name && this.caseObject.last_name && this.caseObject.gender && this.caseObject.date_of_birth && this.feedbackObject.address && this.feedbackObject.latitude && this.feedbackObject.longitude
                    && this.feedbackObject.date);
                } else {
                    this.isFormValid = !!(this.caseObject.first_name && this.caseObject.last_name && this.caseObject.gender && this.caseObject.date_of_birth);
                }
            } else if (this.$store.state.role === 'facility_manager') {
                if (!this.editMode) {
                    this.isFormValid = !!(this.caseObject.first_name && this.caseObject.last_name && this.caseObject.gender && this.caseObject.date_of_birth && this.caseObject.arrival_at_facility_date);
                } else {
                    this.isFormValid = !!(this.caseObject.first_name && this.caseObject.last_name && this.caseObject.gender && this.caseObject.date_of_birth);
                }
            }
        },
        setPlace(place) {
            this.markers = [];
            this.currentPlace = place;
            this.feedbackObject.address = this.currentPlace.formatted_address;
            this.feedbackObject.latitude = this.currentPlace.geometry.location.lat();
            this.feedbackObject.longitude = this.currentPlace.geometry.location.lng();
            this.addMarker();
        },
        addMarker() {
            if (this.currentPlace) {
                const marker = {
                    lat: this.currentPlace.geometry.location.lat(),
                    lng: this.currentPlace.geometry.location.lng(),
                };
                this.markers.push({ position: marker });
                this.places.push(this.currentPlace);
                this.center = marker;
                this.currentPlace = null;
            }
        },
        triggerPlaceChangeEvent(address) {
            if (address && address != null && address.length > 5) {
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ address }, (results, status) => {
                    if (status !== 'OK' || !results[0]) {
                        throw new Error(status);
                    }
                    results[0].formatted_address = address;
                    this.place = results[0].formatted_address;
                    this.setPlace(results[0]);
                    this.validateForm();
                });
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
                    this.socialMedia.forEach(async (value) => {
                        await CasesApi.updateSocialMedia(value);
                    });
                    this.clearForm();
                    this.$router.push({ name: 'case', params: { id: caseId } });
                } else {
                    if (this.childId !== null) {
                        this.caseObject.child_id = this.childId;
                    }
                    const { data: caseObject } = await CasesApi.create(this.getFormattedCreatedCase(this.caseObject));


                    if (this.$store.state.role === 'facility_manager') {
                        const { data: addChildResponse } = await FacilitiesApi.addChild(caseObject.child, { date_entered: this.caseObject.arrival_at_facility_date });
                    } else {
                        this.createFeedback(caseObject.id);
                    }

                    if (this.caseObject.profile_photo instanceof FormData) {
                        const headers = { 'Content-Type': 'multipart/form-data' };
                        const { data: caseImageObject } = await CasesApi.updateImage(caseObject.id, this.caseObject.profile_photo, headers);
                    } else {
                        await CasesApi.edit(caseObject.id, this.getFormattedUpdatedCase(caseObject));
                    }

                    this.socialMedia.forEach(async (value) => {
                        value.case = caseObject.id;
                        await CasesApi.createSocialMedia(value);
                    });
                    this.clearForm();
                    this.$router.push({ name: 'cases' });
                }
            } else {
                console.log('Invalid form');
            }
        },
        cancel() {
            const caseId = this.caseObject.id;
            this.clearForm();
            if (this.editMode) {
                this.$router.push({ name: 'case', params: { id: caseId } });
            } else {
                this.$router.push({ name: 'cases' });
            }
        },
        async createFeedback(caseId) {
            this.feedbackObject.is_main = true;
            this.feedbackObject.case = caseId;
            this.feedbackObject.feedback_status = 'credible';
            this.feedbackObject.source = `${this.userObject.last_name} ${this.userObject.first_name}`;
            const { data: feedbackObject } = await FeedbacksApi.create(this.feedbackObject);
            bus.$emit('reload-feedbacks-event');
        },
        clearForm() {
            this.caseObject = {
                social_media_data: {},
            };
            this.feedbackObject = {
                child_status: null,
                transportation: null,
            };
        },
    },
};
</script>

<style scoped>

    .noPadding {
        padding: 0px 0px 0px 0px;
    }
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
