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
    </div>

    <audio ref="audioRef" />
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

    watch(currentSong, newSong => {
      if (!newSong.id || !newSong.url) {
        return
      }
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })

    const goBack = () => {
      store.commit('setFullScreen', false)
    }

    return { audioRef, fullScreen, currentSong, goBack }
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
  }
}
</style>
