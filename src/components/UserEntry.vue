<template>
    <div class="inputContainer">
        <el-col :span="8" :offset="4">This is where you put ur username lamo</el-col>
        <el-col :span="8">
            <form>
                <el-input type="text" name="username" v-model="username"></el-input>
                <el-button type="submit" @click.stop.prevent="submit()">Submit</el-button>
            </form>
        </el-col>
    </div>
</template>

<script>
export default {
  name: 'UserEntry',
  props: {
  },
  data() {
      return {
          username: null
      }
  },
  methods: {
      submit() {
          this.$router.push("/graph/"+this.username)
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.inputContainer {
    position: relative;
    top: 50%;
    width: 60%;
    border: 5px solid black;
}
</style>