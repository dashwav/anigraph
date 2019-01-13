<template>
  <el-dialog class='detailDialog'
    :visible="isVisible"
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
          <div class="basicText">
            <div class="detailFormat simple">
              <div class="title">
              Format: 
              </div>
              <div v-if='anime.Media.format !== "TV"' class="text">
                {{ anime.Media.format.toLowerCase()}}
              </div>
              <div v-else class="text">
                {{ anime.Media.format }}
              </div>
            </div>
            <div class="detailEpisodes simple">
              <div class="title">
              Episodes: 
              </div>
              <div class="text">
                {{ anime.Media.episodes}}
              </div>
            </div>
            <div class="detailStatus simple">
              <div class="title">
              Status: 
              </div>
              <div class="text">
                {{ anime.Media.status.toLowerCase()}}
              </div>
            </div>
          </div>
          <div class="basicStats">
            <div class="detailScore simple">
              <div class="title">
              Average Score: 
              </div>
              <div v-if='anime.Media.averageScore' class="text">
                {{ anime.Media.averageScore + '%'}} 
              </div>
              <div v-else class="text">
                No ratings yet.
              </div>
            </div>
            <div class="detailGenres simple">
              <div class="title">
              Genres: 
              </div>
              <div class="text">
                {{ anime.Media.genres.join(', ')  }}
              </div>
            </div>
          </div>
          <div class='basicImage'>
              <img class='coverImage' :src='anime.Media.coverImage.medium'/>
            </div>
        </div>
        <div class="detailDescription">
          <div class="title">
          Description
          </div>
          <div class="text" v-html='anime.Media.description'>
            {{ anime.Media.description }}
          </div>
        </div>
        <div class="detailOptions">
          <a :href='anime.Media.siteUrl'>
          <el-button type="primary" round>
            View on Anilist
          </el-button>
          </a>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AnimeDetails',
  props: {
      anime: Object,
      // eslint-disable-next-line
      isVisible: false
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
.title {
  font-weight: bolder;
}

.text {
  font-weight: initial;
}

.detailBasic .text {
  padding-left: 5px;
}

.simple {
  display: flex;
  padding: 5px 0;
}

div.detailCard .el-card__header {
  padding: 0px;
}

.el-dialog__headerbtn {
  z-index:20;
}

.detailCard {
  border: none;
  height: 100%;
}

.content {
  height: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 25% 70% 60px;
  
}

.detailTitle {
  font-size: 2em;
  z-index: 20;
}

.detailFormat {
  text-transform: capitalize;
}

.detailStatus {
  text-transform: capitalize;
}

.detailBody {
  height: 400px;
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
  grid-row: 1;
  display:grid;
  grid-template-columns: 33% 33% 33%;
}

.basicText {
  grid-column: 1;
}

.basicStats {
  grid-column: 2;
}

.basicImage {
  grid-column: 3;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.basicImage .coverImage {
  margin-top:-30px;
  margin-right: 5px;
}

.detailDescription {
  grid-row: 2;
  display:grid;
  grid-template-rows: 25px auto;
  text-align: left;
}

.detailDescription .text {
  grid-row: 2;
  overflow-y: auto;
}

.detailOptions {
  grid-row: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

</style>