<template>
  <div class="singer-detail">
    <MusicList :songs="songs" :title="title" :pic="pic" />
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '@/components/MusicList/MusicList'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'SingerDetailPage',
  components: {
    MusicList
  },
  props: {
    singer: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      songs: []
    }
  },
  computed: {
    cacheSinger() {
      let singerData = null
      const singer = this.singer

      if (singer) {
        singerData = singer
      } else {
        const cachedSinger = storage.session.get(SINGER_KEY)
        if (cachedSinger?.mid === this.singerMid) {
          singerData = cachedSinger
        }
      }

      return singerData
    },
    pic() {
      return this.cacheSinger?.pic
    },
    title() {
      return this.cacheSinger?.name
    },
    singerMid() {
      return this.$route.params.id
    }
  },
  async created() {
    await this.init()
  },
  methods: {
    async init() {
      if (!this.cacheSinger) {
        // 回到第一層路由
        const firstLevelPath = this.$route.matched[0].path
        return this.$router.push(firstLevelPath)
      }

      const result = await getSingerDetail(this.cacheSinger)
      this.songs = await processSongs(result.songs)
    }
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
