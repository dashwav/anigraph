import Vue from 'vue';
import Router from 'vue-router';
import UserEntry from './components/UserEntry.vue';
import Graph from './components/Graph.vue';
import AnimeGraph from './components/AnimeGraph';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: UserEntry,
    },
    {
      path: '/anime/:anime/graph',
      name: "Anime Graph",
      component: AnimeGraph,
    },
    {
      path: '/graph/:username',
      name: 'graph',
      component: Graph
    }
  ],
});