<template>
  <div ref="rootRef">
    <slot />
  </div>
</template>

<script>
import { ref } from 'vue'
import useScroll from './useScroll'

export default {
  name: 'Scroll',
  props: {
    click: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const rootRef = ref(null)
    useScroll(rootRef, props)

    return { rootRef }
  }
}
</script>
