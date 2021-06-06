<template>
  <div class="progress-bar">
    <div class="bar-inner">
      <div class="progress" ref="progress" :style="progressStyle" />
      <div class="progress-btn-wrapper" :style="btnStyle">
        <div class="progress-btn" />
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16

export default {
  name: 'ProgressBar',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      offset: 0
    }
  },
  computed: {
    progressStyle() {
      return `width: ${this.offset}px`
    },
    btnStyle() {
      return `transform: translate3d(${this.offset}px, 0, 0)`
    }
  },
  watch: {
    progress(newProgress) {
      const barWidth = this.$el.clientWidth - progressBtnWidth
      this.offset = barWidth * newProgress
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      border-radius: 4px;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
