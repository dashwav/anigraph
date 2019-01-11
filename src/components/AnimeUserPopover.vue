<template>
  <el-card class="box-card">
    <div class="userInfo">
      Anime Progress
      <el-progress
        class='progressBar'
        :text-inside="true"
        :color='getColor()'
        :stroke-width="18"
        :percentage='Math.round(100 * (completed / total))'>
      </el-progress>
    </div>
</el-card>
</template>

<script>
export default {
  name: 'UserEntry',
  props: {
    completed: Number,
    planning: Number,
    total: Number
  },
  data() {
      return {
      }
  },
  methods: {
    getColor() {
      const percentage = Math.round(100 * (this.completed / this.total))
      if (percentage < 35) {
        return 'red'
      } else if (percentage < 75) {
        return 'orange'
      } else {
        return 'green'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.userInfo {
  width: 200px;
}
.progressBar {
  padding: 5px;
}
</style>