import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

export default function useMiniSlider() {
  const sliderWrapperRef = ref(null)
  const slider = ref(null)

  const store = useStore()
  const fullScreen = computed(() => store.state.fullScreen)
  const playlist = computed(() => store.state.playlist)
  const currentIndex = computed(() => store.state.currentIndex)

  const sliderShow = computed(() => !fullScreen.value && playlist.value.length)

  const sliderInit = () => {
    slider.value = new BScroll(sliderWrapperRef.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      slide: {
        autoplay: false,
        loop: true
      }
    })

    slider.value.on('slidePageChanged', ({ pageX }) => {
      store.commit('setCurrentIndex', pageX)
    })
  }

  onMounted(() => {
    let sliderVal

    watch(sliderShow, async newSliderShow => {
      if (newSliderShow) {
        await nextTick()
        if (!sliderVal) {
          sliderInit()
          sliderVal = slider.value
        } else {
          sliderVal.refresh()
        }
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    watch(currentIndex, newIndex => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })

    // 監聽 playlist, 捕獲當有刪除 playlist 操作時, 需要重新 refresh scroll
    watch(playlist, async () => {
      if (sliderVal && sliderShow.value) {
        await nextTick()
        // sliderVal.refresh()
      }
    })
  })

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })

  return { slider, sliderWrapperRef, sliderShow }
}
