<template>
  <AppHeader />
  <Tabs />
  <router-view :style="viewStyle" />
  <Player />
</template>

<script>
import AppHeader from '@/components/AppHeader/AppHeader'
import Tabs from '@/components/Tabs/Tabs'
import Player from '@/components/Player/Player'
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    AppHeader,
    Tabs,
    Player
  },
  computed: {
    ...mapState(['playlist']),
    viewStyle() {
      // mini player 高度
      const bottom = this.playlist.length ? '60px' : '0'
      return { bottom }
    }
  }
}
</script>

<style lang="scss" scoped></style>
