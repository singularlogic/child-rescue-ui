<template>
    <v-content class="main">
        <v-progress-linear :indeterminate="true" color="secondary" height="3"
                               :active="getLoader"></v-progress-linear>
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
                                    <h2>Login</h2>
                                    <v-text-field v-model="email" type="email" label="Email" prepend-icon="email" ref="emailField" :rules="[rules.required]" @keyup="login"></v-text-field>
                                    <v-text-field id="password" v-model="password" type="password" label="Password" prepend-icon="lock" :rules="[rules.required]" @keyup="login"></v-text-field>
                                    <v-btn block large color="#FFA500" dark @click="loginUser()">Login</v-btn>
                                    <br/>
                                    <a href="">Forgot your password?</a>
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
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
            rules: {
                required: value => !!value || 'Field is required',
                duration: value => value && value > 0 && value < 241 || 'Duration must be between 1 to 240 hours',
            }
        };
    },
    computed: {
        ...mapGetters('generic_module', {
            getIsSnackbarShown: 'getIsSnackbarShown',
            getSnackbarMessage: 'getSnackbarMessage',
            getLoader: 'getLoader',
        }),
    },
    mounted() {
        this.$refs.emailField.focus();
    },
    methods: {
        ...mapMutations('generic_module', {
            showSnackbarMutation: 'showSnackbarMutation',
            hideSnackbarMutation: 'hideSnackbarMutation',
            showLoaderMutation: 'showLoaderMutation',
            hideLoaderMutation: 'hideLoaderMutation',
        }),
        ...mapActions('user_module', {
            loginUserAction: 'loginUserAction',
        }),
        login(event) {
            let instance = this;
            if (event.keyCode === 13) {
                instance.loginUser();
            }
        },
        loginUser() {
            this.showLoaderMutation();
            this.loginUserAction({ email: this.email, password: this.password, router: this.$router })
                .then((response) => {
                    this.hideLoaderMutation();
                })
                .catch((error) => {
                    this.hideLoaderMutation();
                    if (error.response.statusText === 'Forbidden') {
                        this.showSnackbarMutation({ message: "Wrong credentials", status: 'error' });
                    } else {
                        this.showSnackbarMutation({ message: "Network error", status: 'error' });
                    }
                    setTimeout(() => {
                        this.hideSnackbarMutation();
                    }, 3000);
                });
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
