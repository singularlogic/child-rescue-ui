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
                                    <v-form ref="emailForm" v-model="valid" lazy-validation @submit.prevent>
                                        <h2>{{ $t('forget_password.title') }}</h2>
                                        <v-text-field v-model="email" type="email" label="Email" prepend-icon="email" ref="emailField" :rules="[rules.required, rules.email]" @keyup.enter.native="validate"></v-text-field>
                                        <v-btn block large color="#FFA500" dark @click="validate()">{{ $t('forget_password.reset') }}</v-btn>
                                        <a href="/login/">{{ $t('forget_password.go_to_login') }}</a>
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
            email: null,
            valid: true,
            rules: {
                required: value => !!value || this.$t('forget_password.rules_required'),
                email: value => (value && /.+@.+/.test(value)) || this.$t('forget_password.rules_email'),
            },
        };
    },
    mounted() {
        this.$refs.emailField.focus();
    },
    methods: {
        validate() {
            if (this.$refs.emailForm.validate()) {
                this.sendEmail();
            }
        },
        reset() {
            this.$refs.emailForm.reset();
        },
        async sendEmail() {
            console.log(this.email);
            try {
                const { data: response } = await UsersApi.forgotPassword({ email: this.email });
                console.log(response);
                this.$store.commit(SET_SNACKBAR_STATUS, { message: this.$t('forget_password.success'), color: 'green' });
                this.reset();
            } catch (e) {
                console.log(e);
                this.$store.commit(SET_SNACKBAR_STATUS, { message: this.$t('forget_password.error'), color: 'error' });
            }
        },
        login(event) {
            const instance = this;
            if (event.keyCode === 13) {
                instance.sendEmail();
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
