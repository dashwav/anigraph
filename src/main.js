import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VModal from 'vue-js-modal'
import Vuex from 'vuex';
import { addSeconds } from 'date-fns'
Vue.use(VModal)
Vue.use(Vuex)
import './plugins/element';

Vue.config.productionTip = false;

const store = new Vuex.Store({
  state() {
    return {
      token_type: localStorage.getItem("token_type"),
      access_token: localStorage.getItem("access_token"),
      expires_in: localStorage.getItem("expires_in"),
      user_details: {
        username: null,
        user_id: null,
        avatar_url: null,
        lists: null
      }
    };
  },
  mutations: {
    logout(state) {
      state.token_type = '';
      state.access_token = '';
      state.expires_in = '';
    },
    add_user_details(state, userDetails) {
      state.user_details.username =  userDetails.User.name;
      state.user_details.user_id = userDetails.User.id;
      state.user_details.avatar_url = userDetails.User.avatar.medium;
      state.user_details.lists = userDetails.MediaListCollection.lists;
    },
    update_auth_tokens(state, tokenData) {
      localStorage.setItem("access_token", tokenData.access_token);
      state.access_token = localStorage.getItem("access_token");

      localStorage.setItem("token_type", tokenData.token_type);
      state.token_type = localStorage.getItem("token_type");

      const expires_in = addSeconds(new Date(), tokenData.expires_in);
      state.expires_in = expires_in;
      localStorage.setItem("expires_in", expires_in);
    }
  }
})

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
