<template>
  <div class="graphDiv">
    <anime-user-popover 
      v-if='this.$store.state.user_details.username'
      id='userDetails'
      :completed='this.completed_episodes'
      :planning='this.planned_episodes'
      :total='this.total_episodes'
      ></anime-user-popover>
    <svg>
      <g ref='scene'>
        <g ref='linksContainer'>
          <path v-for='edge in edges'
            :key='edge.id'
            stroke='#999'
            :data-from='edge.fromId'
            :data-to='edge.toId'
            marker-end='url(#Triangle)'></path>
        </g>
        <g ref='nodeContainer'>
          <circle v-for='node in nodes'
          class='anime-thumbnail badge'
          :key='node.id'
          :data-id='node.id'
          stroke='black'
          stroke-width='1'
          cx="33" cy="33" r="33" :fill='"url(#image-" + node.id + ")"'
          />
          <circle  v-for='node in getListNodes(nodes)'
          class='anime-thumbnail badge'
          :key='node.id + "badge"'
          :data-id='node.id + "badge"'
          stroke='black'
          stroke-width='1'
          cx="8" cy="8" r="8" :fill='getColor(node.data.anime.Media)'
          />
          
        </g>
      </g>
      <defs>
        <marker id='Triangle' viewBox='0 0 10 10' refX='5' refY='5' markerUnits='strokeWidth' markerWidth='10' markerHeight='5' orient='auto'>
          <path d='M 0 0 L 10 5 L 0 10 z' fill='#999'></path>
        </marker>
        <pattern v-for='node in nodes'
            :id='"image-" + node.id'
            :key='node.id'
            :width='67' :height='67'
            patternUnits='userSpaceOnUse'
        >
          <image x="-17" y="0" height="100" width="100"
            :xlink:href='node.data.anime.Media.coverImage.large' />
        </pattern>
      </defs>
    </svg>
    <div class='tooltip' v-if='tooltip.visible' :style='{
       left: tooltip.x + "px",
       top: tooltip.y + "px"
      }'>
      <ToolTip  :anime=tooltip.anime ></ToolTip>
    </div>
    <AnimeDetails
      :anime=tooltip.anime
      :centerDialogVisible=dialog
      v-on:close='handleClose'></AnimeDetails>
    
  </div>
</template>

<script>
import panZoom from 'panzoom';
import createLayout from 'ngraph.forcelayout';
import createGraph from 'ngraph.graph';
import { getFromTo } from '../lib/geom.js';
import { GetAnime } from '../queries/GetAnime.js';
import ToolTip from './ToolTip.vue';
import AnimeDetails from './AnimeDetails.vue';
import AnimeUserPopover from './AnimeUserPopover.vue';

export default {
  name: 'AnimeGraph',
  props: ['anime'],
  data() {
    return {
      nodes: [],
      edges: [],
      graph: null,
      dialog: false,
      tooltip: {
        visible: false,
        anime: null,
        text: '',
        x: 0,
        y: 0
      },
      completed_episodes: 0,
      planned_episodes: 0,
      total_episodes: 0,
      color_map: {
        'COMPLETED': '#00FF00',
        'DROPPED': '#FF0000',
        'PLANNING': '#FFFF00 ',
        'PAUSED': '#FF6600',
        'CURRENT': '#0000FF',
        'REPEATING': '#0000FF',
      }
    };
  },

  components: {
    ToolTip,
    AnimeDetails,
    AnimeUserPopover
  },

  created() {
    this.getAllNodes(this.$route.params.anime);
  },

  mounted() {
    const { scene } = this.$refs;
    this.zoomHandle = panZoom(scene, {
      zoomDoubleClickSpeed: 1, 
    });
    const rect = this.$el.getBoundingClientRect();
    this.zoomHandle.moveTo(rect.width / 2, rect.height / 2);
    this.initEvents(scene);
    
  },

  methods: {
    handleClose() {
      this.dialog = false;
    },

    getColor(item) {
      console.log(item.mediaListEntry.status);
      if (!item.mediaListEntry){
        return '#000';
      }
      return this.color_map[item.mediaListEntry.status];

    },

    getListNodes(nodes)  {
       return nodes.filter(node => node.data.anime.Media.mediaListEntry)
    },

    handleMouseEnter(e) {
      const nodeId = getNodeIdFromDOM(e.target);
      if (!nodeId) return;
      if (nodeId.includes('badge')) return;

      this.clearHighlight();

      forAll(this.$refs.scene, `path[data-from="${nodeId}"], path[data-to="${nodeId}"]`, addClass('hl'));

      const { anime } = this.graph.getNode(nodeId).data;
      this.showTooltip(e.target, anime);
    },

    handleMouseClick(e) {
      const nodeId = getNodeIdFromDOM(e.target);
      if (nodeId.includes('badge')) return;
      this.dialog = !this.dialog
    },

    showTooltip(el, text) {
      const rect = el.getBoundingClientRect();
      const { tooltip } = this;
      tooltip.x = rect.left + rect.width / 2;
      tooltip.y = rect.top - 42 * 2;
      tooltip.anime = text;
      tooltip.visible = true;
    },

    async handleMouseLeave() {
      this.clearHighlight();
      this.tooltip.visible = false;
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    clearHighlight() {
      forAll(this.$refs.scene, '.hl', removeClass('hl'));
    },

    onGraphChanged(changes) {
      this.iterations = 0;
      changes.forEach(change => {
        if (change.changeType === 'add') {
          if (change.node) this.addNode(change.node);
          if (change.link) this.addLink(change.link);
        } else {
          throw new Error('Not implemented');
        }
      });

      this.frame();
    },

    addNode(graphNode) {
      const { id, data } = graphNode;
      const pos = this.layout.getNodePosition(id);

      this.nodes.push({
        pos,
        id,
        data,
        width: data.width,
        height: data.height
      });
    },

    addLink(graphLink) {
      const { id, fromId, toId } = graphLink;
      const pos = this.layout.getLinkPosition(id);
      const fromHeight = this.graph.getNode(fromId).data.height;
      const toHeight = this.graph.getNode(toId).data.height;
      this.edges.push({ pos, fromId, toId, fromHeight, toHeight });
    },

    disposeGraph() {
      if (this.graph) {
        this.graph.off('changed', this.onGraphChanged, this);
        this.nodes = [];
        this.edges = [];
      }
      if (this.layout) {
        this.layout.dispose();
        this.layout = null;
      }
      if (this.layoutLoop) {
        cancelAnimationFrame(this.layoutLoop);
        this.layoutLoop = null;
      }
    },

    initEvents(scene) {
      scene.addEventListener('mouseenter', this.handleMouseEnter.bind(this), true);
      scene.addEventListener('mouseleave', this.handleMouseLeave.bind(this), true);
      scene.addEventListener('mousedown', this.handleMouseClick.bind(this), true);
    },

    initializeGraph(newGraph) {
      if (!newGraph) return;

      this.layout = createLayout(newGraph, {
        springLength: 80,
        springCoeff: 0.0004,
        dragCoeff: 0.05,
        gravity: -50,
        theta: 0.5
      });

      this.nodes = [];
      this.edges = [];

      const graph = newGraph;

      graph.forEachNode((node) => {
        this.addNode(node);
      });

      graph.forEachLink((link) => {
        this.addLink(link);
      });

      this.boundFrame = this.frame.bind(this);
      this.frame();
    },

    frame() {
      if (!this.layout) return;

      this.layout.step();
      this.edges.forEach(edge => {
        let ui = edge.ui;
        if (!ui) {
          ui = this.$refs.linksContainer.querySelector(`path[data-from="${edge.fromId}"][data-to="${edge.toId}"]`);
          edge.ui = ui;
        }
        if (ui) ui.setAttributeNS(null, 'd', computeLinkPath(edge.pos, edge.fromHeight, edge.toHeight));
      });

      this.nodes.forEach(node => {
        let ui = node.ui;
        if (!ui) {
          ui = this.$refs.nodeContainer.querySelector(`[data-id="${node.id}"]`);
          node.ui = ui;
        }
        if (ui) {
          ui.setAttributeNS(null, 'transform', 'translate(' + (node.pos.x - 33) + ',' + (node.pos.y - 33) + ')');
        }
        const badgeUi = this.$refs.nodeContainer.querySelector(`[data-id="${node.id}badge"]`);
        if (badgeUi) {
          badgeUi.setAttributeNS(null, 'transform', 'translate(' + (node.pos.x + 20) + ',' + (node.pos.y - 30) + ')');
        }
      });

      this.iterations += 1;
      if (this.layout.lastMove > 20 || this.iterations < 100) {
        // we assume we are note converged yet.
        this.layoutLoop = requestAnimationFrame(this.boundFrame);
      }
    },

    async getAllNodes(animeId) {
    
      var init = false;
      var queue = [];
      var visited = new Map();
      this.graph  = createGraph({ uniqueLinkIds: false });

      // Get the first anime and set the queue and visited vars for it
      const baseAnime = await this.fetchAnime(animeId);
      queue.unshift(baseAnime);
      visited.set(baseAnime.Media.id, true);

      var count = 0;
      while (queue.length > 0) {
        // TODO: Add in amount of found nodes into loading indicator
        count++;

        var currentNode = queue.pop();
        // Add a node for currently viewed node
        if (!init){
          this.addAnimeNode(this.graph, currentNode, 'BASE');
          init = true;
        } else {
          this.addAnimeNode(this.graph, currentNode, 'CONN');
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
            if (newNode.Media.mediaListEntry) {
              this.completed_episodes += newNode.Media.mediaListEntry.progress;
              if (newNode.Media.mediaListEntry.status == 'PLANNING') {
                this.planned_episodes += newNode.Media.episodes - newNode.Media.mediaListEntry.progress;
              }
            }
            this.total_episodes += newNode.Media.episodes;
            queue.unshift(newNode);
            visited.set(edge.Media.id, true);
          } else {
            // If node has been visited before and has been added to graph
            const foundNode = this.graph.getNode(edge.Media.id);
            if (foundNode) {
              this.graph.addLink(foundNode.data.anime.Media.id, currentNode.Media.id);
            }
          }
        }, this);
        await Promise.all(promises);
      }
      this.initializeGraph(this.graph)
    },

    addAnimeNode(graph, data, type) {
        graph.addNode(data.Media.id, {
          width: 33,
          height: 33,
          anime: data,
          type: type
        });
       
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
            if (this.$store.state.access_token) {
              options.headers.Authorization = this.$store.state.access_token
            }
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
  },
  
};

function computeLinkPath(edge, fromHeight, toHeight) {
  const { from, to } = getFromTo(edge, fromHeight, toHeight);
  let data = 'M';

  data += Math.round(from.x) + ',' + Math.round(from.y);
  data += 'L' + Math.round(to.x) + ',' + Math.round(to.y);

  return data;
}

function getNodeIdFromDOM(el) {
  const isNode = (el && el.classList.contains('anime-thumbnail'));
  if (!isNode) return;

  return el.getAttribute('data-id');
}

function forAll(scene, query, action) {
  (Array.from(scene.querySelectorAll(query))).forEach(action);
}

function addClass(className) {
  return el => el.classList.add(className);
}

function removeClass(className) {
  return el => el.classList.remove(className);
}
</script>

<style scoped>
#userDetails {
  margin: 10px;
  z-index: 1000;
  position:absolute;
  left: 0;
  background: rgba(255, 255, 255, 0.6);
}

.badge:after{
    content:'3';
    position: absolute;
    background: rgba(0,0,255,1);
    height:2rem;
    top:1rem;
    right:1.5rem;
    width:2rem;
    text-align: center;
    line-height: 2rem;;
    font-size: 1rem;
    border-radius: 50%;
    color:white;
    border:1px solid blue;
}

.graphDiv {
  width: 100%;
  height:100%;
}
svg {
  width: 100%;
  height: 100%;
}
path.hl {
  stroke: RGB(51, 182, 121);
  stroke-width: 2px;
}
.anime-thumbnail {
  cursor: pointer;
}
.tooltip {
  position: absolute;
  pointer-events: none;
  transform: translate(-50%, 0);
  white-space: nowrap;
}
</style>
