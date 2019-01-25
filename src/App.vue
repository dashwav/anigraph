<template>
  <div id="app"
    v-loading="this.$store.state.loading"
    element-loading-text="Logging you in...">
    <el-header id='mainHeader'>
      <div class='stuffContainer'>
        <div id='homeTitle'>
          <router-link to='/' class='headerLink'>AniGraph</router-link>
        </div>
        
        <div id='userDiv'>
          <SearchBar id="searchBar" v-show='!["home"].includes($route.name)'/>
          <a v-if='!this.$store.state.access_token' class='headerLink' href='https://anilist.co/api/v2/oauth/authorize?client_id=1446&response_type=token'>Login</a>
          <div class='headerLink' v-else>
            {{ this.$store.state.user_details.username}}
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              <div class='headerLink'>
              <a><i class="el-icon-arrow-down el-icon--right" style='padding-right: 8px; cursor: pointer;'></i></a>
              </div>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>Logout</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          </div>
        </div>
      </div>
    </el-header>
    <el-container id="body">
      <el-alert v-if='this.$store.state.rate_limit' id='rateLimitAlert'
      :title='this.$store.state.rate_limit_text'
      type="warning"
      :closable="false">
      </el-alert>
      <router-view></router-view>
    </el-container>
    <!-- <div id='about'>
      <router-link class='aboutLink' to='/about'>about</router-link>
    </div> -->
  </div>
</template>

<script>
import SearchBar from './components/SearchBar.vue';
export default {
  name: 'app',
  components: {
    SearchBar
  },
  methods: {
    handleCommand() {
      this.$store.commit('logout');
    }
  }
}
</script>

<style>

#rateLimitAlert {
  position:absolute;
  z-index: 9999;
  align-self: flex-start;
  height: 10%;
  margin: 10px;
  z-index: 9999;
  width: 20%;
}

.graphDiv .el-loading-spinner .el-icon-loading {
  color: #FFF;
}

.graphDiv .el-loading-spinner .el-loading-text {
  color: #FFF;
}

#userDiv {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  padding-left: 8px;
  justify-self: flex-end;
}

#searchBar {
  margin: 15px;
}

#about {
  z-index: 1000;
  background-color: rgba(0,0,0,0);
}

.stuffContainer {
  width: 70%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.headerLink {
  text-decoration: none;
  color: white;
}

.aboutLink {
  text-decoration: none;
  color: black;
}

div.detailDialog .el-dialog__body {
  padding: 0px;
}

div.detailDialog .el-dialog__header {
  padding: 0px;
}

svg {
 top:0;
 width:100%;
 height: 100%;
}

#body {
  height: calc(100vh - 60px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
}

.el-header#mainHeader {
  display: flex;
  justify-content: center;
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
