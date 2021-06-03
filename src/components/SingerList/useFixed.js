import { ref, watch, computed, nextTick } from 'vue'

export default function useFixed(props) {
  const groupRef = ref(null)
  const listHeights = ref([])
  const scrollY = ref(0)
  const currentIndex = ref(0)

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) return ''
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
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
      }
    }
  })

  const calculate = () => {
    const list = groupRef.value.children

    let height = 0
    // listHeightsVal.length = 0
    listHeights.value.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeights.value.push(height)
    }
  }

  const onScroll = pos => {
    scrollY.value = -pos.y
  }

  return { groupRef, onScroll, fixedTitle }
}
