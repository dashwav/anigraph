<template>
  <el-card class="box-card">
    <div>
      {{ anime.Media.title.userPreferred }}
    </div>
</el-card>
</template>

<script>
export default {
  name: 'ToolTip',
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
</style>