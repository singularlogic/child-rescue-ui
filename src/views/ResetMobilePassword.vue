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
                                    <v-form ref="passwordForm" v-model="valid" lazy-validation @submit.prevent>
                                        <h2>{{ $t('reset_password.set_new') }}</h2>
                                        <v-text-field v-model="password" type="password" :label="$t('reset_password.password')" prepend-icon="lock" ref="passwordField" :rules="[rules.required, rules.password]" @keyup.enter.native="validate"></v-text-field>
                                        <v-text-field v-model="verifyPassword" type="password" :label="$t('reset_password.verify_password')" prepend-icon="lock" ref="verifyPasswordField" :rules="[rules.required, rules.verifyPassword]" @keyup.enter.native="validate"></v-text-field>
                                        <v-btn block large color="#FFA500" dark @click="validate()">{{ $t('reset_password.save_password') }}</v-btn>
                                        <a href="/login/">{{ $t('reset_password.go_to_login') }}</a>
                                    </v-form>
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
import { SET_SNACKBAR_STATUS } from '@/store/mutation-types';

export default {
    name: 'Forget Password',
    data() {
        return {
            uid: null,
            token: null,
            password: null,
            verifyPassword: null,
            valid: true,
            rules: {
                required: value => !!value || this.$t('reset_password.rules_required'),
                password: value => (value && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/.test(value)) || this.$t('reset_password.rules_password'),
                verifyPassword: value => (value && value === this.password) || this.$t('reset_password.rules_match_password'),
            },
        };
    },
    created() {
        const { uid } = this.$route.query;
        const { token } = this.$route.query;
        this.uid = uid;
        this.token = token;
    },
    mounted() {
        this.$refs.passwordField.focus();
    },
    methods: {
        validate() {
            if (this.$refs.passwordForm.validate()) {
                this.savePassword();
            }
        },
        reset() {
            this.$refs.passwordForm.reset();
        },
        async savePassword() {
            try {
                const { data: response } = await UsersApi.resetPassword({ uid: this.uid, password: this.password, token: this.token });
                this.$store.commit(SET_SNACKBAR_STATUS, { message: this.$t('reset_password.success'), color: 'green' });
                this.reset();
            } catch (e) {
                console.log(e);
                this.$store.commit(SET_SNACKBAR_STATUS, { message: this.$t('reset_password.error'), color: 'error' });
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
        background-image: url("../assets/bg_1.jpg");
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
        background-image: url("../assets/bg_logo.png");
        background-repeat: no-repeat;
        background-position: center center;
    }
</style>
