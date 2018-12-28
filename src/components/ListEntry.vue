<template>
    <el-collapse-item :name="index">
        <template slot='title'>
            {{ entry.data.entry.media.title.userPreferred }}  
        </template>
        <div class="graphDiv" :id="'graphDiv-' + entry.id"></div>
    </el-collapse-item>
</template>

<script>
export default {
  name: 'UserEntry',
  props: {
      entry: Object,
      index: Number,
  },
  data() {
      return {
      }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.graphDiv {
    height: 500px;
}
</style>