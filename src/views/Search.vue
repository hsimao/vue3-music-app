<template>
  <div class="search">
    <div class="search-input-wrapper">
      <SearchInput v-model="query" />
    </div>

    <Scroll ref="scrollRef" class="search-content" v-show="!query">
      <div>
        <!-- 熱門搜尋 -->
        <SearchHotKeys :keys="hotKeys" @selected="updateQuery" />
        <!-- 歷史搜尋 -->
        <SearchHistory
          class="search-history"
          v-show="searchHistoryList.length"
          @clearSearch="clearAll"
        >
          <SearchList
            :searches="searchHistoryList"
            @select="updateQuery"
            @delete="deleteSearch"
          />
        </SearchHistory>
      </div>
    </Scroll>

    <!-- 搜尋結果 -->
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
import { ref, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import useSearchHistory from '@/components/Search/useSearchHistory'
import { getHotKeys } from '@/service/search'
import Scroll from '@/components/hoc/WrapScroll'
import SearchInput from '@/components/Search/SearchInput'
import SearchHotKeys from '@/components/Search/SearchHotKeys'
import SearchSuggest from '@/components/Search/SearchSuggest'
import SearchHistory from '@/components/Search/SearchHistory'
import SearchList from '@/components/Search/SearchList'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'SearchPage',
  components: {
    Scroll,
    SearchInput,
    SearchHotKeys,
    SearchSuggest,
    SearchHistory,
    SearchList
  },
  setup() {
    const query = ref('')
    const hotKeys = ref([])
    const selectedSinger = ref(null)
    const scrollRef = ref(null)

    const router = useRouter()
    const store = useStore()

    const searchHistoryList = computed(() => store.state.searchHistory)

    watch(query, async newQuery => {
      if (!newQuery) {
        await nextTick()
        refreshScroll()
      }
    })

    getHotKeys().then(result => {
      hotKeys.value = result.hotKeys
    })

    const refreshScroll = () => {
      scrollRef.value.scroll.refresh()
    }

    const updateQuery = key => {
      query.value = key
      saveSearch(key)
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

    const { saveSearch, deleteSearch, clearAll } = useSearchHistory()

    return {
      scrollRef,
      query,
      hotKeys,
      updateQuery,
      selectSong,
      selectSinger,
      selectedSinger,
      searchHistoryList,
      deleteSearch,
      clearAll
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

  .search-history {
    position: relative;
    margin: 0 20px;
  }
}
</style>
