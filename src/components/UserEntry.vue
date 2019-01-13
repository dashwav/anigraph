<template>
    <div class="inputContainer">
        <div id='infoText'>
            <p id='actualText'>
                This is where you put ur anime lamo {{ this.$store.state.count }}
            </p>
        </div>
        <div id='infoSearch' >
            <form id='searchContent'>
                <el-autocomplete
                  class="inline-input"
                  v-model="anime"
                  :fetch-suggestions="search"
                  placeholder="Please Input"
                  :debounce='300'
                  :trigger-on-focus="false"
                  @select='submit'
                ></el-autocomplete>
                <!-- <el-button type="primary" icon="el-icon-search" @click.stop.prevent="submit()">Submit</el-button> -->
            </form>
        </div>
    </div>
</template>

<script>
import { SearchQuery } from '../queries/SearchQuery.js';
import querystring from 'querystring';
import { UserList } from '../queries/UserList.js';
import jwt_decode from 'jwt-decode';
export default {
  name: 'UserEntry',
  props: {
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
      submit(selected) {
        this.$router.push(selected.link);
      },

      async search(string, callback) {
        var query = SearchQuery;
        // Define our query variables and values that will be used in the query request
        var variables = {
            query: string
        };
        // Define the config we'll need for our Api request
        var url = 'https://graphql.anilist.co',
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    variables: variables
                })
            };
        // Make the HTTP Api request
        if (this.$store.state.remaining_requests < 3) {
          var ts = Math.round((new Date()).getTime() / 1000);
          var refresh = this.$store.state.request_reset - ts;
          this.$store.state.rate_limit = true;
          this.$store.state.rate_limit_text = 'We have hit the Anilist API rate-limit, some search results may be delayed.'
          while (refresh > 1){
            await this.sleep(1);
            refresh--;
          }
          this.rate_limit = false;
        }
        const response = await fetch(url, options);
        const json = await this.handleResponse(response);
        const results = json.data.AnimeSearch.media.map((entry) => {
          return {
            "value": entry.title.userPreferred,
            "link": '/anime/' + entry.id + '/graph'
          }
        });
        callback(results)
      },
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
.el-autocomplete {
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