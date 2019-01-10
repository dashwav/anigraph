<template>
  <div class="listGraphs">
    <div class="userSummary">
      <el-container>
        <el-header>Header</el-header> 
        <el-container>
          <el-aside width="200px"></el-aside>
          <el-main>Main</el-main>
        </el-container>
    </el-container>
    </div>
    <el-collapse>
      <ListEntry 
        v-for="(entry, index) in list"
        :key="entry.id"
        :entry="entry"
        :index="index">
      </ListEntry>
    </el-collapse>

    <!-- <li 
    class="entry-item"
    v-for="entry in list"
    :key='entry.id'
    style="list-style-type: none;">
      <ListEntry :entry='entry'></ListEntry>
    </li> -->
  </div>
</template>

<script>
import { UserList } from '../queries/UserList.js';
import { GetUser } from '../queries/GetUser.js';
import vivagraphjs from 'vivagraphjs';
import ListEntry from './ListEntry.vue';
export default {
  name: 'UserEntry',
  props: {
  },
  components: {
    ListEntry
  },
  data() {
      return {
          username: this.$route.params.username,
          medium: 'ANIME',
          list: null
      }
  },
  created() {
      this.fetchUser()
  },
  methods: {
      async fetchAnilist(data) {
        // Definitely just stole this from the anilist API example
        // Leaving the comments in cause they are useful
        // Here we define our query as a multi-line string
        // Storing it in a separate .graphql/.gql file is also possible
        var query = UserList;
        // Define our query variables and values that will be used in the query request
        var variables = {
            userId: data.data.User.id,
            listType: this.medium
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
        fetch(url, options).then(this.handleResponse)
                        .then(this.buildGraph)
                        .catch(this.handleError);
        
      },
      async fetchUser() {
          // Here we define our query as a multi-line string
        // Storing it in a separate .graphql/.gql file is also possible
        var query = GetUser;
        // Define our query variables and values that will be used in the query request
        var variables = {
            userName: this.username
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
        fetch(url, options).then(this.handleResponse)
                        .then(this.fetchAnilist)
                        .catch(this.handleError);
      },
      async buildGraph(data) {
        var createGraph = require('ngraph.graph');
        var listGraph = createGraph();
        listGraph.forEachNode(function(node){
          console.log(node);
        });
        const completed = data.data.MediaListCollection.lists[0].entries;
        var secondaryNodes = [];
        completed.forEach(function(entry){
          if (this.isBaseNode(entry)) {
            listGraph.addNode(entry.media.id, {
              base: true,
              entry: entry
            });
          } else {
            secondaryNodes.push(entry);
          }
        }, this);
        secondaryNodes.forEach(function(entry) {
          entry.media.relations.edges.forEach(function(mediaEdge) {
            if (["PREQUEL", "PARENT", "OTHER"].includes(mediaEdge.relationType)) {
              const node = listGraph.getNode(mediaEdge.node.id);
              if (node) {
                listGraph.addNode(entry.id, {
                  base: false,
                  entry: entry
                });
                listGraph.addLink(mediaEdge.id, entry.id);
              }
            }
          })
        });
        const retArray = [];
        listGraph.forEachNode(function(node){
          if (!node.data) {
            return
          }
          console.log(node);
          if (node.data.base) {
            //retArray.push(node);
            console.log(retArray);
          }
          retArray.push(node);
        });
        this.list = retArray;
      },
      isBaseNode(anime) {
          const edges = anime.media.relations.edges;
          const prequels = edges.filter(link => (link.relationType === "PREQUEL" || link.relationType === "PARENT"));
          if (prequels.length === 0) {
              return true;
          }
          return false;
      },
      handleResponse(response) {
            return response.json().then(function (json) {
                return response.ok ? json : Promise.reject(json);
            });
        },
        handleListData(anilistGraph) {
            
            graph.addLink(1, 2);

            // specify where it should be rendered:
            
        },
        handleError(error) {
            alert('Error, check console');
            console.error(error);
        },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.entryItem {
  list-style: none;
}

.node-image {
    border-radius: 50%;
}

.listGraphs {
  width: 70%;
}

#graphSpan {
    height: 100%;
    width: 100%;
}
</style>