<template>
  <span>
    <svg>
      <g ref='scene'>
        <!--
          Note: I wish I could entirely use vue template to set the UI.
          Unfortunately this produces choppy layout. So I set most of the static
          components with vue, and update positions from javascript.
        -->
        <g ref='linksContainer'>
          <path v-for='edge in edges'
            stroke='#999'
            :data-from='edge.fromId'
            :data-to='edge.toId'
            marker-end='url(#Triangle)'></path>
        </g>
        <g ref='nodeContainer'>
          <image v-for='node in nodes'
            :width='node.width' :height='node.height'
            class='video-thumbnail'
            :data-id='node.id'
            :xlink:href='node.data.image.url' />
        </g>
      </g>
      <div class='tooltip' v-if='tooltip.visible' :style='{
       left: tooltip.x + "px",
       top: tooltip.y + "px"
      }'>
      <ToolTip :anime=tooltip.anime></ToolTip>
      </div>
      <div class="graphDivContainer" id="graphDiv"></div>
  </span>
</template>

<script>
import vivagraphjs from 'vivagraphjs';
import { GetAnime } from '../queries/GetAnime.js';
import ToolTip from './ToolTip';

var $ = require('jquery');

const nodeSize = 52;

export default {
  name: 'AnimeGraph',
  props: {
  },
  data() {
      return {
          anime: this.$route.params.anime,
          medium: 'ANIME',
          graph: null,
          nodes: [],
          edges: [],
          requests: 0,
          tooltip: {
            visible: false,
            anime: null,
            x: 0,
            y: 0
          }
      }
  },
  created(){ this.getAllNodes(this.$route.params.anime) },
  mounted() {
    const { scene } = this.$refs;
    this.initEvents(scene);
  },
  methods: {
      async getAllNodes(animeId) {
        
          var init = false;
          var queue = [];
          var visited = new Map();
          var animeGraph = vivagraphjs.Graph.graph();

          // Get the first anime and set the queue and visited vars for it
          const baseAnime = await this.fetchAnime(animeId);
          queue.unshift(baseAnime);
          visited.set(baseAnime.Media.id, true);

          var count = 0;
          while (queue.length > 0) {
            // TODO: Add in amount of found nodes into loading indicator
            count++;
            console.log('Nodes: ' + count);

            var currentNode = queue.pop();
            // Add a node for currently viewed node
            if (!init){
              this.addAnimeNode(animeGraph, currentNode, 'BASE');
              init = true;
            } else {
              this.addAnimeNode(animeGraph, currentNode, 'CONN');
            }

            const promises = currentNode.Media.relations.edges.map(async function(edge) {
              if (edge.relationType === 'ADAPTATION') {
                // Don't need source material/adaptations
                return
              }
              if (!visited.get(edge.Media.id)) {
                // If this is a new node
                // TODO: Rate limit
                // RE: Rate Limit - Add a few layers deep to GetAnime,
                // ... and if there are edges deeper than that with relations, 
                // ... get those manually if edge.Media.X doesn't exist
                var newNode = null;
                if (!edge.Media.title){
                    newNode = await this.fetchAnime(edge.Media.id);
                } else {
                  newNode = edge;
                }
                queue.unshift(newNode);
                visited.set(edge.Media.id, true);
              } else {
                // If node has been visited before and has been added to graph
                const foundNode = animeGraph.getNode(edge.Media.id);
                if (foundNode) {
                  animeGraph.addLink(foundNode.data.anime.Media.id, currentNode.Media.id);
                }
              }
            }, this);
            await Promise.all(promises);

          }

          var graphics = vivagraphjs.Graph.View.svgGraphics();
          var layout = vivagraphjs.Graph.Layout.forceDirected(animeGraph, {
            springLength : 140,
            springCoeff : 0.00005,
            dragCoeff : 0.02,
            gravity : -5
          });
          
          graphics.node(function(node) {
                var defs = vivagraphjs.Graph.svg('defs');
                graphics.getSvgRoot().append(defs);
                
                var radius = 42;
                // First, we create a fill pattern and add it to SVG's defs:
                var pattern = vivagraphjs.Graph.svg('pattern')
                  .attr('id', "imageFor_" + node.id)
                  .attr('patternUnits', "userSpaceOnUse")
                  .attr('width', 100)
                  .attr('height', 100)
                var image = vivagraphjs.Graph.svg('image')
                  .attr('x', '-28')
                  .attr('y', '0')
                  .attr('height', radius * 3.2)
                  .attr('width', radius * 3.2)
                  .link(node.data.anime.Media.coverImage.medium);
                pattern.append(image);
                defs.append(pattern);

                // TODO: Add in special styling depending on type of connection
                // The function is called every time renderer needs a ui to display node
                var ui = vivagraphjs.Graph.svg('g')
                  .attr('slot', 'popover');
                var circle = vivagraphjs.Graph.svg('circle')
                  .attr('cx', radius)
                  .attr('cy', radius)
                  .attr('id', node.id)
                  .attr('fill', 'url(#imageFor_' + node.id + ')')
                  .attr('r', radius)
                  // Create SVG text element with user id as content
                ui.append(circle);
                return ui;
              }, this)
              .placeNode(function(nodeUI, pos){
                  // Shift image to let links go to the center:
                  nodeUI.attr('transform', 'translate(' + (pos.x - 42) + ',' + (pos.y - 42) + ')');
              });

          

          var renderer = vivagraphjs.Graph.View.renderer(animeGraph, {
                  container: document.getElementById('graphDiv'),
                  graphics : graphics,
                  layout: layout,
              });
          renderer.run();

      },

      initEvents(scene) {
        // TODO: This should be disposed properly
        scene.addEventListener('mouseenter', this.handleMouseEnter.bind(this), true);
        scene.addEventListener('mouseleave', this.handleMouseLeave.bind(this), true);
      },
      
      addAnimeNode(graph, data, type) {
        graph.addNode(data.Media.id, {
          anime: data,
          type: type
        });
       
      },

      handleMouseEnter(e) {
        const nodeId = getNodeIdFromDOM(e.target);
        if (!nodeId) return;
        //this.clearHighlight();
        //forAll(this.$refs.scene, `path[data-from="${nodeId}"], path[data-to="${nodeId}"]`, addClass('hl'));
        const { title } = this.graph.getNode(nodeId).data;
        this.showTooltip(e.target, title);
      },

      handleMouseLeave() {
        this.clearHighlight();
        this.tooltip.visible = false;
      },

      showTooltip(el, text) {
        const rect = el.getBoundingClientRect();
        const { tooltip } = this;
        tooltip.anime = anime;
        tooltip.x = rect.left + rect.width / 2;
        tooltip.y = rect.top - 42 / 2;
        tooltip.visible = true;
      },

      async fetchAnime(id) {
        this.requests++;
        console.log('Request #: ' + this.requests);
        // Definitely just stole this from the anilist API example
        // Leaving the comments in cause they are useful
        // Here we define our query as a multi-line string
        // Storing it in a separate .graphql/.gql file is also possible
        var query = GetAnime;
        // Define our query variables and values that will be used in the query request
        var variables = {
            animeId: id,
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
        return json.data;
      },
      async handleResponse(response) {
            return response.json().then(function (json) {
                return response.ok ? json : Promise.reject(json);
            });
      },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
span {
  height: 100%;
  width: 100%;
}
svg {
 top:0;
 width:100%;
 height: 100%;
}

.graphDivContainer {
    height: 100%;
    width: 100%;
}
</style>