<template>
  <div class="singer" v-loading="!singers.length">
    <SingerList :data="singers" @select="selectSinger" />
    <router-view :singer="selectedSinger" />
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import SingerList from '@/components/SingerList/SingerList'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'SingerPage',
  components: {
    SingerList
  },
  data() {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  async created() {
    const { singers } = await getSingerList()
    this.singers = singers
  },
  methods: {
    selectSinger(singer) {
      this.selectedSinger = singer
      this.setCacheSinger(singer)
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    },
    setCacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
