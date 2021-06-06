import { useStore } from 'vuex'
import { computed } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant'

export default function useMode() {
  const store = useStore()
  const playMode = computed(() => store.state.playMode)

  const modeIcon = computed(() => {
    switch (playMode.value) {
      case PLAY_MODE.sequence:
        return 'icon-sequence'
      case PLAY_MODE.random:
        return 'icon-random'
      case PLAY_MODE.loop:
        return 'icon-loop'
      default:
        return 'icon-sequence'
    }
  })

  const changeMode = () => {
    // 0 1 2
    const mode = (playMode.value + 1) % 3

    store.dispatch('changeMode', mode)
  }

  return { modeIcon, changeMode }
}
