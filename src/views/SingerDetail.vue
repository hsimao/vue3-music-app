<template>
  <div class="singer-detail">
    <MusicList :songs="songs" :loading="loading" :title="title" :pic="pic" />
  </div>
</template>

<script>
import createDetailComponent from '@/components/hoc/CreateDetailComponent'
import { getSingerDetail } from '@/service/singer'
import { SINGER_KEY } from '@/assets/js/constant'

export default createDetailComponent({
  name: 'SingerDetailPage',
  storageKey: SINGER_KEY,
  fetch: getSingerDetail
})
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  background: $color-background;
}
</style>
