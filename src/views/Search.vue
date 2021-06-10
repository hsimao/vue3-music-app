<template>
  <div class="search">
    <div class="search-input-wrapper">
      <SearchInput v-model="query" />
    </div>
    <div class="search-content">
      <SearchHotKeys :keys="hotKeys" @selected="updateQuery" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { getHotKeys } from '@/service/search'
import SearchInput from '@/components/Search/SearchInput'
import SearchHotKeys from '@/components/Search/SearchHotKeys'

export default {
  name: 'SearchPage',
  components: {
    SearchInput,
    SearchHotKeys
  },
  setup() {
    const query = ref('')
    const hotKeys = ref([])

    getHotKeys().then(result => {
      hotKeys.value = result.hotKeys
    })

    const updateQuery = key => {
      query.value = key
    }

    return {
      query,
      hotKeys,
      updateQuery
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

  .search-content {
    flex: 1;
    overflow: hidden;
  }
}
</style>
