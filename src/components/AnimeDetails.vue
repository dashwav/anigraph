<template>
  <el-dialog class='detailDialog'
    :visible="centerDialogVisible"
    v-on:close='handleClose'
    >
    <div class="detailHeader"
    :style="{
      backgroundImage: 'url(' + anime.Media.bannerImage + ')'
    }">
      <div class="detailTitle">
        {{ anime.Media.title.userPreferred }}
      </div>
    </div>
    <div class="detailBody">
      <div class="content">
        <div class="detailBasic">
          {{ anime.Media.episodes}}
        </div>
        <div class="detailDescription">
          <div class="detailDescriptionTitle">
          Description
          </div>
          <div class="detailDescriptionText" v-html='anime.Media.description'>
            {{ anime.Media.description }}
          </div>
        </div>
      </div>
    </div>

  </el-dialog>
  <!-- <modal name="animeDetails">
    <el-card class="box-card detailCard">
      <div
      slot="header" 
      class="detailHeader"
      :style='{
        backgroundImage: "url(" + anime.Media.bannerImage + ")",
      }'>
      <div class="detailTitle">
        {{ anime.Media.title.userPreferred }}
        </div>
      </div>
      <div class="detailBody">

      </div>
    </el-card>
  </modal> -->
</template>

<script>
export default {
  name: 'UserEntry',
  props: {
      anime: Object,
      centerDialogVisible: false
  },
  data() {
      return {
      }
  },
  methods: {
    handleClose() {
      this.$emit('close');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
div.detailCard .el-card__header {
  padding: 0px;
}

.detailCard {
  border: none;
  height: 100%;
}

.content {
  height: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 25% 75%;
  
}

.detailTitle {
  font-size: 2em;
  z-index: 20;
}

.detailBody {
  height: 360px;
  padding: 40px;
}

.detailHeader {
  display: flex;
  color: white;
  padding: 30px 20px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: rgba(25,25,25, .4);
  position: relative;
}

.detailHeader::after {
  height: 100%;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 5;
  background-color: rgba(31,40,53,.5);
  content: '';
}

.detailBasic {
  height:25%;
  grid-row: 1;
}

.detailDescription {
  grid-row: 2;
  display:grid;
  grid-template-rows: 25px auto;
  text-align: left;
  font-weight: bolder;
}

.detailDescriptionText {
  grid-row: 2;
  font-weight: initial;

  overflow-y: auto;
}


</style>