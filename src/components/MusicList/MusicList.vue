<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" ref="bgImage" :style="bgImageStyle">
      <!-- 隨機播放按鈕 -->
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div
          class="play-btn"
          @click="randomPlay(songs)"
          v-show="songs.length > 0"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>

      <!-- 毛玻璃遮罩 -->
      <div class="filter" :style="filterStyle" />
    </div>

    <Scroll
      class="list"
      :probe-type="3"
      @scroll="onScroll"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
    >
      <div class="song-list-wrapper">
        <SongList :songs="songs" :rank="rank" @select="selectSong" />
      </div>
    </Scroll>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import SongList from '@/components/base/SongList/SongList'
import Scroll from '@/components/hoc/WrapScroll'

const RESERVED_HEIGHT = 40

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
    title: {
      type: String,
      default: ''
    },
    pic: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: true
    },
    noResultText: {
      type: String,
      default: '抱歉，沒有可播放的歌曲'
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageHeight: 0,
      scrollY: 0,
      maxTranslateY: 0
    }
  },
  computed: {
    ...mapState(['playlist']),
    // 依據滾動曲目列表來動態改變圖片顯示
    // 向上滾動遮蔽, 以及向下滾動放大效果
    bgImageStyle() {
      const scrollY = this.scrollY
      let zIndex = 0
      let paddingTop = '70%'
      let height = 0
      let translateZ = 0
      let scale = 1

      if (scrollY > this.maxTranslateY) {
        zIndex = 10
        paddingTop = 0
        height = `${RESERVED_HEIGHT}px`
        translateZ = 1 // fix ios 高度異常問題
      }

      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imageHeight)
      }

      return {
        height,
        paddingTop,
        zIndex,
        transform: `scale(${scale}) translateZ(${translateZ}px)`,
        backgroundImage: `url(${this.pic})`
      }
    },
    playBtnStyle() {
      const display = this.scrollY >= this.maxTranslateY ? 'none' : ''
      return { display }
    },
    filterStyle() {
      let blur = 0
      const scrollY = this.scrollY
      const imageHeight = this.imageHeight

      if (scrollY >= 0) {
        blur =
          Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) * 20
      }

      return { backdropFilter: `blur(${blur}px)` }
    },
    scrollStyle() {
      // mini player 高度
      const bottom = this.playlist.length ? '60px' : '0'
      return { top: `${this.imageHeight}px`, bottom }
    },
    noResult() {
      return !this.loading && !this.songs.length
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions(['selectPlay', 'randomPlay']),
    init() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT
    },
    goBack() {
      this.$router.back()
    },
    onScroll(pos) {
      this.scrollY = -pos.y
    },
    selectSong({ song, index }) {
      this.selectPlay({ list: this.songs, index })
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
      color: $color-theme;
      font-size: $font-size-large-x;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 20;
    width: 80%;
    color: $color-text;
    text-align: center;
    font-size: $font-size-large;
    line-height: 40px;
    transform: translateZ(2px);

    @include no-wrap();
  }
  .bg-image {
    position: relative;
    width: 100%;
    background-size: cover;
    transform-origin: top;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        margin: 0 auto;
        padding: 7px 0;
        width: 135px;
        border: 1px solid $color-theme;
        border-radius: 100px;
        color: $color-theme;
        text-align: center;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        margin-right: 6px;
        vertical-align: middle;
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
    z-index: 0;
    width: 100%;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
