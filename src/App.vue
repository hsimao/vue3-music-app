<template>
  <AppHeader />
  <Tabs />
  <router-view />
</template>

<script>
import AppHeader from '@/components/AppHeader/AppHeader'
import Tabs from '@/components/Tabs/Tabs'

export default {
  name: 'App',
  components: {
    AppHeader,
    Tabs
  }
}
</script>

<style lang="scss" scoped></style>
