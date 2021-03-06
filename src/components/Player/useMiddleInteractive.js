import { ref } from 'vue'

export default function useMiddleInteractive() {
  const currentShow = ref('cd')
  const middleLStyle = ref(null)
  const middleRStyle = ref(null)

  // 不需要響應的 state
  const touch = {}
  let currentView = 'cd'

  const onMiddleTouchStart = e => {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
    touch.directionLocked = ''
  }

  const onMiddleTouchMove = e => {
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY

    if (!canChange(deltaX, deltaY)) return

    const left = currentView === 'cd' ? 0 : -window.innerWidth

    // 限制 0 ~ -window.innerWidth 區間
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))

    // 當前拖移距離比例
    touch.percent = Math.abs(offsetWidth / window.innerWidth)

    updateCurrentShow()
    updateMiddleLStyle(0, 1 - touch.percent)
    updateMiddleRStyle(0, offsetWidth)
  }

  // 禁止 x 軸跟 y 軸可以同時動作
  // 依據 x、y 軸偏移距離比較, 來判斷是否要進行切頁
  const canChange = (deltaX, deltaY) => {
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    if (!touch.directionLocked) {
      // 依據左右拖曳距離, 設定鎖定方向
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }

    return touch.directionLocked !== 'v'
  }

  const onMiddleTouchEnd = () => {
    let offsetWidth
    let opacity
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    updateMiddleLStyle(300, opacity)
    updateMiddleRStyle(300, offsetWidth)
  }

  const updateCurrentShow = () => {
    if (currentView === 'cd') {
      // 如果當前是 cd view, 拖曳距離超過 20% 就切換到歌詞頁面
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      // 如果當前不是 cd view, 拖曳距離小於 80% 就切換到 cd 頁面
      if (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }
  }

  const updateMiddleLStyle = (duration = 0, opacity = 1) => {
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }
  }

  const updateMiddleRStyle = (duration = 0, offsetWidth) => {
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`
    }
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
