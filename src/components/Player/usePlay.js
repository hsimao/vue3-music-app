import { computed } from 'vue'
import { useStore } from 'vuex'

export default function usePlay({ audioRef, songReady }) {
  const store = useStore()

  const playing = computed(() => store.state.playing)
  const playlist = computed(() => store.state.playlist)
  const currentIndex = computed(() => store.state.currentIndex)

  const togglePlay = () => {
    if (!songReady.value) return

    store.commit('setPlaying', !playing.value)
  }

  const handlePlayByIndex = index => {
    const list = playlist.value
    if (!list.length || !songReady.value) return
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

  const pause = () => {
    store.commit('setPlaying', false)
  }

  // 循環播放
  const loop = () => {
    const audioEl = audioRef.value
    audioEl.currentTime = 0
    audioEl.play()
  }

  return { togglePlay, next, prev, pause }
}
