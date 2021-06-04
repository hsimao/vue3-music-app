<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" ref="bgImage" :style="bgImageStyle" />
    <Scroll class="list" :style="scrollStyle" v-loading="!songs.length">
      <div class="song-list-wrapper">
        <SongList :songs="songs" />
      </div>
    </Scroll>
  </div>
</template>

<script>
import SongList from '@/components/base/SongList/SongList'
import Scroll from '@/components/base/Scroll/Scroll'

export default {
  name: 'MusicList',
  components: {
    SongList,
    Scroll
  },
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    title: String,
    pic: String
  },
  data() {
    return {
      imageHeight: 0
    }
  },
  computed: {
    bgImageStyle() {
      return { backgroundImage: `url(${this.pic})` }
    },
    scrollStyle() {
      return { top: `${this.imageHeight}px` }
    }
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
  },
  methods: {
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    padding-top: 70%;
    height: 0;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    overflow: hidden;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
