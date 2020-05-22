<template>
    <v-content class="main">
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md8 lg8 xl6>
                    <v-card elevation-20>
                        <v-layout align-center justify-center wrap>
                            <v-flex xs12 sm12 md6 lg6 xl6>
                                <div class="background">
                                    <div class="layer">
                                        <div class="logo_layer"></div>
                                    </div>
                                </div>
                            </v-flex>
                            <v-flex xs12 sm12 md6 lg6 xl6>
                                <div style="margin: 15%;">
                                    <v-form ref="loginForm" v-model="valid" lazy-validation>
                                        <h2>{{ $t('login.title') }}</h2>
                                        <v-text-field v-model="user.email" type="email" label="Email" prepend-icon="email" ref="emailField" :rules="[rules.required, rules.email]" @keyup.enter.native="validate"></v-text-field>
                                        <v-text-field id="password" v-model="user.password" type="password" :label="$t('login.password')" prepend-icon="lock" :rules="[rules.required, rules.password]" @keyup.enter.native="validate"></v-text-field>
                                        <v-btn block large color="#FFA500" dark @click="validate()">{{ $t('login.login') }}</v-btn>
                                    </v-form>
                                    <br/>
                                    <!-- <a href="">Forgot your password?</a> -->
                                    <a href="/forget-password/">{{ $t('login.forgot_password') }}</a>
                                </div>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>

<script>
import { UsersApi } from '@/api';
import { SET_TOKEN, SET_ROLE, SET_SNACKBAR_STATUS, CLEAR_TOKEN } from '@/store/mutation-types';

export default {
    name: 'Login',
    data() {
        return {
            user: {},
            valid: true,
            rules: {
                required: value => !!value || this.$t('login.rules_required'),
                email: value => (value && /.+@.+/.test(value)) || this.$t('login.rules_email'),
                password: value => (value && value.length >= 6 && value.length <= 20) || this.$t('login.rules_password'),
            },
        };
    },
    mounted() {
        this.$refs.emailField.focus();
    },
    methods: {
        validate() {
            if (this.$refs.loginForm.validate()) {
                this.loginUser();
            }
        },
        reset() {
            this.$refs.loginForm.reset();
        },
        async loginUser() {
            try {
                const { data: loginResponse } = await UsersApi.login(this.user);
                this.$store.commit(SET_TOKEN, { loginResponse });
                const { data: userObject } = await UsersApi.get();
                this.userObject = userObject;
                const el = ['organization_manager', 'coordinator', 'case_manager', 'facility_manager', 'network_manager'].includes(this.userObject.role);
                if (el) {
                    this.$store.commit(SET_ROLE, { response: userObject });
                    this.$router.push({ name: 'dashboard' });
                } else {
                    this.$store.commit(SET_SNACKBAR_STATUS, { message: `[${this.userObject.role}] user, has no access in the platform!`, color: 'error' });
                    this.$store.commit(CLEAR_TOKEN);
                }
            } catch (e) {
                console.log(e);
                this.$store.commit(SET_SNACKBAR_STATUS, { message: this.$t('login.invalid_creds'), color: 'error' });
            }
        },
        login(event) {
            const instance = this;
            if (event.keyCode === 13) {
                instance.loginUser();
            }
        },
    },
};
</script>

<style>
    .v-progress-linear {
        margin: 0 !important;
        position: fixed;
        z-index: 100;
    }

    .background {
        height: 800px;
        background-image: url("../../assets/bg_1.jpg");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: 100% 100%;
    }

    .layer {
        background-color: rgba(52, 73, 94, 0.7);
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .logo_layer {
        margin: 0;
        position: absolute;
        top: calc(50% - 50px);
        left: calc(50% - 100px);
        width: 200px;
        height: 100px;
        background-image: url("../../assets/bg_logo.png");
        background-repeat: no-repeat;
        background-position: center center;
    }
</style>
