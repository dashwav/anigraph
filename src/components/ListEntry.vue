<template>
    <el-collapse-item :name="index">
        <template slot='title'>
            {{ entry.data.entry.media.title.userPreferred }}  
        </template>
        <div class="graphDiv" :id="'graphDiv-' + entry.id">
            <div v-if='activeNames.includes(index)'>asdfasdf</div>
        </div>
    </el-collapse-item>
</template>

<script>
import AnimeGraph from './AnimeGraph.vue'
export default {
  name: 'UserEntry',
  props: {
      entry: Object,
      index: Number,
  },
  components: {
      AnimeGraph,
  },
  data() {
      return {
          activeNames: []
      }
  },
  methods: {
      handleChange(val) {
        console.log(val);
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.graphDiv {
    height: 500px;
}
</style>