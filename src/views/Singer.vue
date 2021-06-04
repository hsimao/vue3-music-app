<template>
  <div class="singer" v-loading="!singers.length">
    <SingerList :data="singers" @select="selectSinger" />
    <router-view :singer="selectedSinger" />
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import SingerList from '@/components/SingerList/SingerList'

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
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
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
