<template>
  <AppHeader />
  <Tabs />
  <router-view />
  <Player />
</template>

<script>
import AppHeader from '@/components/AppHeader/AppHeader'
import Tabs from '@/components/Tabs/Tabs'
import Player from '@/components/Player/Player'

export default {
  name: 'App',
  components: {
    AppHeader,
    Tabs,
    Player
  }
}
</script>

<style lang="scss" scoped></style>
