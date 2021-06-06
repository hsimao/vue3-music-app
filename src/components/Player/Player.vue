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

      <div class="bottom">
        <!-- 播放進度條 -->
        <div class="progress-wrapper">
          <span class="time time-l">{{ formatCurrentTime }}</span>
          <div class="progress-bar-wrapper">
            <ProgressBar :progress="progress" />
          </div>
          <span class="time time-r">{{ formatDurationTime }}</span>
        </div>

        <div class="operators">
          <!-- 播放模式： 依序、隨機、循環 -->
          <div class="icon i-left">
            <i :class="modeIcon" @click="changeMode" />
          </div>

          <!-- 前一首 -->
          <div class="icon i-left" :class="disableClass">
            <i class="icon-prev" @click="prev" />
          </div>

          <!-- 播放、暫停 -->
          <div class="icon i-center" :class="disableClass">
            <i :class="playIcon" @click="togglePlay" />
          </div>

          <!-- 下一首 -->
          <div class="icon i-right" :class="disableClass">
            <i class="icon-next" @click="next" />
          </div>

          <!-- 收藏 -->
          <div class="icon i-right">
            <i
              :class="getFavoriteIcon(currentSong)"
              @click="toggleFavorite(currentSong)"
            />
          </div>
        </div>
      </div>
    </div>

    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
    />
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import useMode from './useMode'
import usePlay from './usePlay'
import useFavorite from './useFavorite'
import ProgressBar from '@/components/Player/ProgressBar'
import { formatTime } from '@/assets/js/utils'

export default {
  name: 'Player',
  components: {
    ProgressBar
  },
  setup() {
    // data
    const audioRef = ref(null)
    const songReady = ref(false)
    const currentTime = ref(0)

    // vuex
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => store.state.playing)

    // computed
    const playIcon = computed(() =>
      playing.value ? 'icon-pause' : 'icon-play'
    )

    const disableClass = computed(() => {
      return songReady.value ? '' : 'disable'
    })

    const progress = computed(
      () => currentTime.value / currentSong.value.duration
    )

    const formatCurrentTime = computed(() => formatTime(currentTime))
    const formatDurationTime = computed(() =>
      formatTime(currentSong.value.duration)
    )

    // watch
    watch(currentSong, newSong => {
      if (!newSong.id || !newSong.url) {
        return
      }
      songReady.value = false
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })

    watch(playing, newPlaying => {
      if (!songReady.value) return
      const audioEl = audioRef.value
      newPlaying ? audioEl.play() : audioEl.pause()
    })

    // methods
    const goBack = () => {
      store.commit('setFullScreen', false)
    }

    const ready = () => {
      if (songReady.value) return
      songReady.value = true
    }

    const error = () => {
      songReady.value = true
    }

    const updateTime = e => {
      currentTime.value = e.target.currentTime
    }

    // hooks
    const { togglePlay, next, prev, pause } = usePlay({ audioRef, songReady })
    const { modeIcon, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    return {
      audioRef,
      fullScreen,
      currentSong,
      formatCurrentTime,
      formatDurationTime,
      goBack,
      progress,
      playIcon,
      togglePlay,
      pause,
      prev,
      next,
      ready,
      error,
      disableClass,
      updateTime,
      // mode
      modeIcon,
      changeMode,
      // favorite
      getFavoriteIcon,
      toggleFavorite
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
