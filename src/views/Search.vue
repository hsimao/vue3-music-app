<template>
  <div class="search">
    <div class="search-input-wrapper">
      <SearchInput v-model="query" />
      <pre>{{ query }}</pre>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import SearchInput from '@/components/Search/SearchInput'

export default {
  name: 'SearchPage',
  components: {
    SearchInput
  },
  setup() {
    const query = ref('')

    return {
      query
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;

  .search-input-wrapper {
    margin: 20px;
  }
}
</style>
