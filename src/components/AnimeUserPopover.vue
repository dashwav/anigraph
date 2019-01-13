<template>
  <el-card class="box-card">
    <div class="userInfo">
      Episodes Watched
      <el-progress
        class='progressBar'
        :text-inside="true"
        :color='getColor(Math.round(100 * (completed / total)))'
        :stroke-width="18"
        :percentage='Math.round(100 * (completed / total))'>
      </el-progress>
      Total Planned
      <el-progress
        class='progressBar'
        :text-inside="true"
        :color='getColor(Math.round(100 * ((completed + planning) / total)))'
        :stroke-width="18"
        :percentage='Math.round(100 * ((completed + planning) / total))'>
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
    getColor(percentage) {
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