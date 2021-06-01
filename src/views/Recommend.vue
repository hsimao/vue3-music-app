<template>
  <div class="recommend">推薦頁面</div>
</template>

<script>
import { getRecommend } from '@/service/recommend'

export default {
  name: 'RecommendPage',
  created() {
    console.log('hello')

    getRecommend()
  }
}
</script>

<style lang="scss" scoped></style>
