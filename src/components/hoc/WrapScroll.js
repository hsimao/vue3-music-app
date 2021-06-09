import {
  ref,
  computed,
  watch,
  nextTick,
  h,
  mergeProps,
  withCtx,
  renderSlot
} from 'vue'
import { useStore } from 'vuex'
import Scroll from '@/components/base/Scroll/Scroll'

// 高階函式 Scroll 組件封裝
// 不更改原本 Scroll 組件的邏輯, 保留通用性
// 並將業務邏輯抽離出在此擴充
export default {
  name: 'WrapScroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(
      Scroll,
      // props
      mergeProps({ ref: 'scrollRef' }, ctx.$props, {
        onScroll: e => ctx.$emit('scroll', e)
      }),
      {
        // slot
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, 'default')]
        })
      }
    )
  },
  setup() {
    const scrollRef = ref(null)
    const scroll = computed(() => scrollRef.value.scroll)

    // 依據播放列表數據異動, 來自動刷新 scroll 組件, 讓可視高度以及 scroll 區域可以同步更新
    // 應用場景：在底部的 mini player 出現或隱藏時, scroll 區塊都可同步更新
    const store = useStore()
    const playlist = computed(() => store.state.playlist)

    watch(playlist, async () => {
      await nextTick()
      scroll.value.refresh()
    })

    return { scrollRef, scroll }
  }
}
