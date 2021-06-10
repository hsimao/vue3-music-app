<template>
  <div class="search">
    <div class="search-input-wrapper">
      <SearchInput v-model="query" />
    </div>
    <div class="search-content" v-show="!query">
      <SearchHotKeys :keys="hotKeys" @selected="updateQuery" />
    </div>

    <div class="search-result" v-show="query">
      <SearchSuggest
        :query="query"
        @select-song="selectSong"
        @select-singer="selectSinger"
      />
    </div>

    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getHotKeys } from '@/service/search'
import SearchInput from '@/components/Search/SearchInput'
import SearchHotKeys from '@/components/Search/SearchHotKeys'
import SearchSuggest from '@/components/Search/SearchSuggest'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'SearchPage',
  components: {
    SearchInput,
    SearchHotKeys,
    SearchSuggest
  },
  setup() {
    const query = ref('')
    const hotKeys = ref([])
    const selectedSinger = ref(null)

    const router = useRouter()
    const store = useStore()

    getHotKeys().then(result => {
      hotKeys.value = result.hotKeys
    })

    const updateQuery = key => {
      query.value = key
    }

    const selectSong = song => {
      store.dispatch('addSong', song)
    }

    const selectSinger = singer => {
      selectedSinger.value = singer
      cacheSinger(singer)

      router.push(`/search/${singer.mid}`)
    }

    const cacheSinger = singer => {
      storage.session.set(SINGER_KEY, singer)
    }

    return {
      query,
      hotKeys,
      updateQuery,
      selectSong,
      selectSinger,
      selectedSinger
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

  .search-content,
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
