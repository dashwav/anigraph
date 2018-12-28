import Vue from 'vue';
import Router from 'vue-router';
import UserEntry from './components/UserEntry.vue';
import Graph from './components/Graph.vue';
import AnimeGraphV2 from './components/AnimeGraphV2';

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
      component: AnimeGraphV2,
    },
    {
      path: '/graph/:username',
      name: 'graph',
      component: Graph
    }
  ],
});