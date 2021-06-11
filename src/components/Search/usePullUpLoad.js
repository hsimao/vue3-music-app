import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/observe-dom'
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'

BScroll.use(PullUp)
BScroll.use(ObserveDOM)

export default function usePullUpLoad(requestData, preventPullUpLoad) {
  const scroll = ref(null)
  const rootRef = ref(null)
  const isPullUpLoad = ref(false)

  onMounted(() => {
    const scrollVal = (scroll.value = new BScroll(rootRef.value, {
      pullUpLoad: true,
      observeDOM: true,
      click: true
    }))

    const pullingUpHandler = async () => {
      if (preventPullUpLoad.value) {
        scrollVal.finishPullUp()
        return
      }
      isPullUpLoad.value = true
      await requestData()
      scrollVal.finishPullUp()
      scrollVal.refresh()
      isPullUpLoad.value = false
    }

    scrollVal.on('pullingUp', pullingUpHandler)
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })

  onDeactivated(() => {
    scroll.value.disable()
  })

  return { scroll, rootRef, isPullUpLoad }
}
