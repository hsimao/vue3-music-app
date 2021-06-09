<template>
  <div class="album">
    <MusicList :songs="songs" :loading="loading" :title="title" :pic="pic" />
  </div>
</template>

<script>
import { getAlbum } from '@/service/recommend'
import createDetailComponent from '@/components/hoc/CreateDetailComponent'
import { ALBUM_KEY } from '@/assets/js/constant'

export default createDetailComponent({
  name: 'AlbumPage',
  storageKey: ALBUM_KEY,
  fetch: getAlbum
})
</script>

<style lang="scss" scoped>
.album {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
