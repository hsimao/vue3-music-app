<template>
  <div class="singer-detail">
    <MusicList :songs="songs" :title="title" :pic="pic" />
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '@/components/MusicList/MusicList'

export default {
  name: 'SingerDetailPage',
  components: {
    MusicList
  },
  props: {
    singer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      songs: []
    }
  },
  computed: {
    pic() {
      return this.singer?.pic
    },
    title() {
      return this.singer?.name
    }
  },
  async created() {
    const result = await getSingerDetail(this.singer)
    this.songs = await processSongs(result.songs)
  }
}
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
