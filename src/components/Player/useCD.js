import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default function useCD() {
  const cdRef = ref(null)
  const cdImageRef = ref(null)

  const store = useStore()
  const playing = computed(() => store.state.playing)

  const cdClass = computed(() => (playing.value ? 'playing' : ''))

  watch(playing, newPlaying => {
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  // 同步內層 img 角度到外層
  const syncTransform = (wrapper, inner) => {
    const wrapperTransfrom = getComputedStyle(wrapper).transform
    const innerTransfrom = getComputedStyle(inner).transform

    if (wrapperTransfrom === 'none') {
      wrapper.style.transform = innerTransfrom
    } else {
      // 如果 wrapper 已經有同步過一次角度, 再次同步時需要兩個疊加
      wrapper.style.transform = innerTransfrom.concat(' ', wrapperTransfrom)
    }
  }

  return { cdClass, cdRef, cdImageRef }
}
