<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" :alt="currentSong.name" />
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>

      <!-- 播放 tool -->
      <div class="bottom">
        <div class="operators">
          <div class="icon i-left">
            <i class="icon-sequence" />
          </div>
          <div class="icon i-left">
            <i class="icon-prev" @click="prev" />
          </div>
          <div class="icon i-center">
            <i :class="playIcon" @click="togglePlay" />
          </div>
          <div class="icon i-right">
            <i class="icon-next" @click="next" />
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite" />
          </div>
        </div>
      </div>
    </div>

    <audio ref="audioRef" @pause="pause" />
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Player',
  setup() {
    const audioRef = ref(null)
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => store.state.playing)
    const currentIndex = computed(() => store.state.currentIndex)
    const playlist = computed(() => store.state.playlist)

    const playIcon = computed(() =>
      playing.value ? 'icon-pause' : 'icon-play'
    )

    watch(currentSong, newSong => {
      if (!newSong.id || !newSong.url) {
        return
      }
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })

    watch(playing, newPlaying => {
      const audioEl = audioRef.value
      newPlaying ? audioEl.play() : audioEl.pause()
    })

    const goBack = () => {
      store.commit('setFullScreen', false)
    }

    const togglePlay = () => {
      store.commit('setPlaying', !playing.value)
    }

    const pause = () => {
      store.commit('setPlaying', false)
    }

    const handlePlayByIndex = index => {
      const list = playlist.value
      if (!list.length) return
      if (list.length === 1) return loop()

      store.commit('setCurrentIndex', index)

      if (!playing.value) {
        store.commit('setPlaying', true)
      }
    }

    const next = () => {
      let index = currentIndex.value + 1
      if (index === playlist.value.length) {
        index = 0
      }
      handlePlayByIndex(index)
    }

    const prev = () => {
      let index = currentIndex.value - 1
      if (index === -1) {
        index = playlist.value.length - 1
      }
      handlePlayByIndex(index)
    }

    // 循環播放
    const loop = () => {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
    }

    return {
      audioRef,
      fullScreen,
      currentSong,
      goBack,
      playIcon,
      togglePlay,
      pause,
      prev,
      next
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        color: $color-theme;
        font-size: $font-size-large-x;
        transform: rotate(-90deg);
      }
      .title {
        margin: 0 auto;
        width: 70%;
        color: $color-text;
        text-align: center;
        font-size: $font-size-large;
        line-height: 40px;

        @include no-wrap();
      }
      .subtitle {
        color: $color-text;
        text-align: center;
        font-size: $font-size-medium;
        line-height: 20px;
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
  }
}
</style>
