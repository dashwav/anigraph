import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VModal from 'vue-js-modal'
import Vuex from 'vuex';
import VueAnalytics from 'vue-analytics'
import { addSeconds } from 'date-fns'

import './plugins/element';

Vue.use(VModal)
Vue.use(Vuex)
Vue.use(VueAnalytics, {
  id: 'UA-124202815-2',
  router
})
Vue.config.productionTip = false;

const store = new Vuex.Store({
  state() {
    return {
      loading: false,
      rate_limit: false,
      rate_limit_text: 'We are being rate-limited by anilist, some search results may be delayed.. ',
      remaining_requests: 90,
      token_type: localStorage.getItem("token_type"),
      access_token: localStorage.getItem("access_token"),
      expires_in: localStorage.getItem("expires_in"),
      user_details: {
        username: localStorage.getItem("username"),
        user_id:localStorage.getItem("user_id"),
        avatar_url: localStorage.getItem("avatar_url"),
        lists: localStorage.getItem("lists")
      }
    };
  },
  mutations: {
    logout(state) {
      localStorage.clear();
      state.token_type = '';
      state.access_token = '';
      state.expires_in = '';
      state.user_details = {
        username: null,
        user_id: null,
        avatar_url: null,
        lists: null
      }
    },
    add_user_details(state, userDetails) {
      state.user_details.username =  userDetails.User.name;
      localStorage.setItem("username", userDetails.User.name);
      state.user_details.user_id = userDetails.User.id;
      localStorage.setItem("user_id", userDetails.User.id);
      state.user_details.avatar_url = userDetails.User.avatar.medium;
      localStorage.setItem("avatar_url", userDetails.User.avatar.medium);
      state.user_details.lists = userDetails.MediaListCollection.lists;
      localStorage.setItem("lists", userDetails.MediaListCollection.lists);
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
