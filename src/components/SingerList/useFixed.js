import { ref, watch, computed, nextTick } from 'vue'

export default function useFixed(props) {
  const TITLE_HEIGHT = 29
  const groupRef = ref(null)
  const listHeights = ref([])
  const scrollY = ref(0)
  const currentIndex = ref(0)
  const distance = ref(0)

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) return ''
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  const fixedStyle = computed(() => {
    const diff =
      distance.value > 0 && distance.value < TITLE_HEIGHT
        ? distance.value - TITLE_HEIGHT
        : 0

    return { transform: `translate3d(0, ${diff}px, 0)` }
  })

  watch(
    () => props.data,
    async () => {
      await nextTick()
      calculate()
    }
  )

  watch(scrollY, newY => {
    for (let i = 0; i < listHeights.value.length - 1; i++) {
      const heightTop = listHeights.value[i]
      const heightBottom = listHeights.value[i + 1]
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
      }
    }
  })

  const calculate = () => {
    const list = groupRef.value.children

    let height = 0
    listHeights.value.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeights.value.push(height)
    }
  }

  const onScroll = pos => {
    scrollY.value = -pos.y
  }

  return { groupRef, onScroll, fixedTitle, fixedStyle, currentIndex }
}
