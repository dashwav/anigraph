<template>
  <form >
    <el-autocomplete
      class="inline-input"
      v-model="anime"
      :fetch-suggestions="search"
      placeholder="Please Input"
      :debounce='300'
      :trigger-on-focus="false"
      @select='submit'
    >
      <i
        class="el-input__icon el-icon-search"
        slot="suffix"
        ></i>
    </el-autocomplete>
    </form>
</template>

<script>
import { SearchQuery } from '../queries/SearchQuery.js';
import querystring from 'querystring';
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

<style>
.el-autocomplete {
  width: 100%;
}
</style>
