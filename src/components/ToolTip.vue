<template>
  <el-card class="box-card">
    {{ anime.Media.title.userPreferred }}
</el-card>
</template>

<script>
export default {
  name: 'UserEntry',
  props: {
      anime: Object,
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