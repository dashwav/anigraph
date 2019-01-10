<template>
  <el-card class="box-card">
    <div class="animeDiv">
      {{ anime.Media.title.userPreferred }}
    </div>
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
.animeDiv {
    height: 500px;
}
</style>