import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

export default function createLoadingLikeDirective(Component) {
  const name = Component.name

  return {
    mounted(el, binding) {
      const app = createApp(Component)
      const instance = app.mount(document.createElement('div'))
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance

      const title = binding.arg
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }

      if (binding.value) {
        append(el)
      }
    },
    updated(el, binding) {
      const title = binding.arg
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }

  function append(el) {
    const style = getComputedStyle(el)
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, 'g-relative')
    }
    el.appendChild(el[name].instance.$el)
  }

  function remove(el) {
    removeClass(el, 'g-relative')
    el.removeChild(el[name].instance.$el)
  }
}
