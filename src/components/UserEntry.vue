<template>
    <div class="inputContainer">
        <div id='infoText'>
            <p id='actualText'>
                This is where you put ur anime lamo {{ this.$store.state.count }}
            </p>
        </div>
        <div id='infoSearch' >
            <SearchBar id='searchContent'/>
        </div>
    </div>
</template>

<script>
import { SearchQuery } from '../queries/SearchQuery.js';
import querystring from 'querystring';
import { UserList } from '../queries/UserList.js';
import SearchBar from './SearchBar.vue';
import jwt_decode from 'jwt-decode';
export default {
  name: 'UserEntry',
  props: {
  },
  components: {
    SearchBar,
  },
  data() {
      return {
          anime: null,
          searchResults: [],
          rateLimit: false,
          rateLimitText: 'We have hit an anilist API rate-limit, search results may be slow'
      }
  },
  computed: {
    count () {
      return this.$store.state.count
    }
  },
  mounted() {
    let hashValue = this.$route.hash;
    // this.$store.commit('logout');
    if (!hashValue) {
        return
    } else {
        this.$store.state.loading = true;
        try {
            let tokensString = hashValue.substring(1, hashValue.length); //remove the # in the string
            let parsedTokens = querystring.parse(tokensString);
            this.$store.commit("update_auth_tokens", parsedTokens);
            const auth = 'Bearer ' + this.$store.state.access_token;
            var query = UserList;
            const token = jwt_decode(this.$store.state.access_token)
            const variables = {
              userId: token.sub
            }
            var url = 'https://graphql.anilist.co',
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': auth
                },
                body: JSON.stringify({
                    query: query,
                    variables: variables
                })
            };
            fetch(url, options).then(this.handleResponse)
                   .then((data) => {
                    this.$store.commit('add_user_details', data.data);
                   })

            this.$store.state.loading = false;
            this.$router.push("/");
        } catch (e) {

            this.$store.state.loading = false;
            this.$router.push("/");
        }
    }
  },
  methods: {
      async handleResponse(response) {
        this.$store.state.remaining_requests = response.headers.get('X-RateLimit-Remaining');
        this.$store.state.request_reset = response.headers.get('X-RateLimit-Reset');
            return response.json().then(function (json) {
                return response.ok ? json : Promise.reject(json);
            });
      },

      sleep(s) {
        const ms = s * 1000;
        return new Promise(resolve => setTimeout(resolve, ms));
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#searchContent {
  width: 100%;
}

.inputContainer {
    position: relative;
    top: 50%;
    width: 70%;
    display: flex;
    justify-content: center;
}

#searchContent {
    padding: 0px 10px;
    display: flex;
}

.textInput {
  padding: 0px 10px;
}

#infoText {
  padding: 0px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#infoSearch {
  width: 50%;
  max-width: 500px;
}
#actualText {
  display: inline-block;
  vertical-align: middle;
  line-height: normal;
}
</style>