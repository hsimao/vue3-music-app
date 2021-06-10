import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/observe-dom'
import { ref, onMounted, onUnmounted } from 'vue'

BScroll.use(PullUp)
BScroll.use(ObserveDOM)

export default function usePullUpLoad(requestData) {
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

  return { scroll, rootRef, isPullUpLoad }
}
