<template>
  <div id="app">
    <el-header></el-header>
    <el-container id="body">
      <router-view></router-view>
    </el-container>
  </div>
</template>

<script>
import UserEntry from './components/UserEntry.vue'

export default {
  name: 'app',
  components: {
    UserEntry
  }
}
</script>

<style>
svg {
 top:0;
 width:100%;
 height: 100%;
}

#body {
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
}

.el-header {
  height: 10%;
  background-color: #1f2631
}

* {
  margin: 0;
}

#app {
  height: 100%;
}

html {
  height: 100%;
}

body {
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
