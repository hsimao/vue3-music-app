<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div ref="cdRef" class="cd">
          <img
            ref="cdImageRef"
            width="40"
            height="40"
            :class="cdClass"
            :src="currentSong.pic"
          />
        </div>
      </div>

      <div class="slider-wrapper">
        <h2 class="name">{{ currentSong.name }}</h2>
        <p class="desc">{{ currentSong.singer }}</p>
      </div>

      <div class="control">
        <ProgressCircle :radius="32" :progress="progress">
          <i class="icon-mini" :class="miniPlayIcon" @click.stop="togglePlay" />
        </ProgressCircle>
      </div>
    </div>
  </transition>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import useCD from './useCD'
import ProgressCircle from '@/components/Player/ProgressCircle'

export default {
  name: 'MiniPlayer',
  components: {
    ProgressCircle
  },
  props: {
    progress: {
      type: Number,
      default: 0
    },
    togglePlay: Function
  },
  setup() {
    const store = useStore()
    const playing = computed(() => store.state.playing)
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)

    const miniPlayIcon = computed(() =>
      playing.value ? 'icon-pause-mini' : 'icon-play-mini'
    )

    const showNormalPlayer = () => {
      store.commit('setFullScreen', true)
    }

    const { cdClass, cdRef, cdImageRef } = useCD()

    return {
      fullScreen,
      currentSong,
      showNormalPlayer,
      miniPlayIcon,
      // cd
      cdClass,
      cdRef,
      cdImageRef
    }
  }
}
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }

  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;

    .name {
      margin-bottom: 2px;
      @include no-wrap();
      font-size: $font-size-medium;
      color: $color-text;
    }
    .desc {
      @include no-wrap();
      font-size: $font-size-small;
      color: $color-text-d;
    }
  }

  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }

  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>
