<template>
  <div class="player" v-show="playlist.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
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

        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <div class="middle-l" :style="middleLStyle">
            <!-- 唱盤 -->
            <div ref="cdWrapperRef" class="cd-wrapper">
              <div ref="cdRef" class="cd">
                <img
                  ref="cdImageRef"
                  class="image"
                  :class="cdClass"
                  :src="currentSong.pic"
                />
              </div>
            </div>

            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>

          <!-- 歌詞 -->
          <Lyric
            :songReady="songReady"
            :style="middleRStyle"
            ref="lyricRef"
            :currentTime="currentTime"
            @updateLyric="updateLyric"
          />
        </div>

        <div class="bottom">
          <!-- cd、歌詞 切換選單 dot 樣式 -->
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span
              class="dot"
              :class="{ active: currentShow === 'lyric' }"
            ></span>
          </div>

          <!-- 播放進度條 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatCurrentTime }}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar
                ref="progressBarRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              />
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
    </transition>

    <MiniPlayer :progress="progress" :toggle-play="togglePlay" />

    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    />
  </div>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import useMode from './useMode'
import usePlay from './usePlay'
import useFavorite from './useFavorite'
import useCD from './useCD'
import useMiddleInteractive from './useMiddleInteractive'
import useAnimation from './useAnimation'
import setPlayHistory from './usePlayHistory'
import ProgressBar from '@/components/Player/ProgressBar'
import Lyric from '@/components/Player/Lyric'
import MiniPlayer from '@/components/Player/MiniPlayer'
import { formatTime } from '@/assets/js/utils'
import { PLAY_MODE } from '@/assets/js/constant'

export default {
  name: 'Player',
  components: {
    ProgressBar,
    MiniPlayer,
    Lyric
  },
  setup() {
    // data
    const audioRef = ref(null)
    const lyricRef = ref(null)
    const progressBarRef = ref(null)
    const songReady = ref(false)
    const currentTime = ref(0)
    const playingLyric = ref('')
    let progressChanging = false

    // vuex
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => store.state.playing)
    const playMode = computed(() => store.state.playMode)
    const playlist = computed(() => store.state.playlist)

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

    const formatCurrentTime = computed(() => formatTime(currentTime.value))
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
      store.commit('setPlaying', true)
    })

    watch(playing, newPlaying => {
      if (!songReady.value) return
      const audioEl = audioRef.value

      if (newPlaying) {
        audioEl.play()
        lyricRef.value.playLyric()
      } else {
        audioEl.pause()
        lyricRef.value.stopLyric()
      }
    })

    watch(fullScreen, async newFullScreen => {
      if (newFullScreen) {
        await nextTick()
        progressBarRef.value.setOffset(progress.value)
      }
    })

    // methods
    const goBack = () => {
      store.commit('setFullScreen', false)
    }

    const ready = () => {
      if (songReady.value) return
      songReady.value = true
      lyricRef.value.playLyric()
      savePlay(currentSong.value)
    }

    const error = () => {
      songReady.value = true
    }

    const end = () => {
      currentTime.value = 0

      if (playMode.value === PLAY_MODE.loop) {
        loop()
      } else {
        next()
      }
    }

    const updateTime = e => {
      if (!progressChanging) {
        currentTime.value = e.target.currentTime
      }
    }

    const updateLyric = lyric => {
      playingLyric.value = lyric
    }

    const onProgressChanging = progress => {
      progressChanging = true
      currentTime.value = currentSong.value.duration * progress
      lyricRef.value.playLyric()
      lyricRef.value.stopLyric()
    }

    const onProgressChanged = progress => {
      progressChanging = false
      audioRef.value.currentTime = currentTime.value =
        currentSong.value.duration * progress
      lyricRef.value.playLyric()

      if (!playing.value) {
        store.commit('setPlaying', true)
      }
    }

    // hooks
    const { togglePlay, next, prev, loop, pause } = usePlay({
      audioRef,
      songReady
    })
    const { modeIcon, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    const { cdClass, cdRef, cdImageRef } = useCD()
    const { savePlay } = setPlayHistory()
    const {
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd
    } = useMiddleInteractive()
    const {
      cdWrapperRef,
      enter,
      afterEnter,
      leave,
      afterLeave
    } = useAnimation()

    return {
      audioRef,
      lyricRef,
      progressBarRef,
      fullScreen,
      currentSong,
      currentTime,
      playingLyric,
      formatCurrentTime,
      formatDurationTime,
      songReady,
      goBack,
      progress,
      playIcon,
      playlist,
      togglePlay,
      pause,
      prev,
      next,
      end,
      ready,
      error,
      disableClass,
      updateTime,
      updateLyric,
      onProgressChanging,
      onProgressChanged,
      // mode
      modeIcon,
      changeMode,
      // favorite
      getFavoriteIcon,
      toggleFavorite,
      // cd
      cdRef,
      cdImageRef,
      cdClass,
      // middle interactive
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      // animation
      cdWrapperRef,
      enter,
      afterEnter,
      leave,
      afterLeave
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

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
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

    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
