<template>
  <div class="top-detail">
    <MusicList
      :songs="songs"
      :loading="loading"
      :title="title"
      :pic="pic"
      rank
    />
  </div>
</template>

<script>
import { getTopDetail } from '@/service/topList'
import { TOP_KEY } from '@/assets/js/constant'
import createDetailComponent from '@/components/hoc/CreateDetailComponent'

export default createDetailComponent({
  name: 'TopDetailPage',
  storageKey: TOP_KEY,
  fetch: getTopDetail
})
</script>

<style lang="scss" scoped>
.top-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
