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
                  :debounce='1000'
                  :trigger-on-focus="false"
                  @select='submit'
                ></el-autocomplete>
                <!-- <el-button type="primary" icon="el-icon-search" @click.stop.prevent="submit()">Submit</el-button> -->
            </form>
        </div>
    </div>
</template>

<script>
import { SearchQuery } from '../queries/SearchQuery.js'
import { GetUser } from '../queries/GetUser.js'
import querystring from 'querystring'
export default {
  name: 'UserEntry',
  props: {
  },
  data() {
      return {
          anime: null,
          searchResults: []
      }
  },
  computed: {
    count () {
      return this.$store.state.count
    }
  },
  mounted() {
    let hashValue = this.$route.hash;
    this.$store.commit('logout');
    if (!hashValue) {
      console.log('halsdkf')
        return
    } else {
        try {
            let tokensString = hashValue.substring(1, hashValue.length); //remove the # in the string
            let parsedTokens = querystring.parse(tokensString);
            console.log(parsedTokens);
            this.$store.commit("update_auth_tokens", parsedTokens);
            const auth = 'Bearer ' + this.$store.state.access_token;
            const query = GetUser;
            var url = 'https://graphql.anilist.co',
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': auth
                },
                body: JSON.stringify({
                    query: query
                })
            };
            fetch(url, options).then(this.handleResponse)
                   .then((data) => {
                     console.log(data);
                    this.$store.commit('add_user_details', data.data.Viewer);
                   })
                   .catch((err) => {
                     console.log(err)
                   });
            this.$router.push("/");
        } catch (e) {
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
        const response = await fetch(url, options);
        const json = await this.handleResponse(response);
        console.log(json);
        const results = json.data.AnimeSearch.media.map((entry) => {
          return {
            "value": entry.title.userPreferred,
            "link": '/anime/' + entry.id + '/graph'
          }
        });
        console.log(results);
        callback(results)
      },
      async handleResponse(response) {
            return response.json().then(function (json) {
                return response.ok ? json : Promise.reject(json);
            });
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