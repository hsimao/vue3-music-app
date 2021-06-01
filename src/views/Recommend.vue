<template>
  <div class="recommend">
    <div class="slider-wrapper">
      <div class="slider-content">
        <Slider v-if="showSlider" :sliders="sliders" />
      </div>
    </div>
  </div>
</template>

<script>
import { getRecommend } from '@/service/recommend'
import { ref, onBeforeMount } from 'vue'
import Slider from '@/components/base/Slider/Slider'

export default {
  name: 'RecommendPage',
  components: {
    Slider
  },
  setup() {
    const sliders = ref([])
    const showSlider = ref(false)

    onBeforeMount(async () => {
      const result = await getRecommend()
      sliders.value = result.sliders
      showSlider.value = sliders.value.length > 0
    })

    return { sliders, showSlider }
  }
}
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: hidden auto;

  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
        }
        .name {
          margin-bottom: 10px;
          color: $color-text;
        }
        .title {
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
