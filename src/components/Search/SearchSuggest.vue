<template>
  <div
    ref="rootRef"
    class="search-suggest"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer">
        <div class="icon">
          <i class="icon-mine" />
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li class="suggest-item" v-for="song in songs" :key="song.id">
        <div class="icon">
          <i class="icon-music" />
        </div>
        <div class="name">
          <p class="text">{{ song.singer }}-{{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'
import usePullUpLoad from './usePullUpLoad'

export default {
  name: 'SearchSuggest',
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)
    const loadingText = ref('')
    const noResultText = ref('抱歉, 無搜尋結果')

    const loading = computed(() => !singer.value && !songs.value.length)
    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value
    })
    const pullUpLoading = computed(() => isPullUpLoad.value && hasMore.value)

    watch(
      () => props.query,
      newQuery => {
        if (newQuery) {
          searchFirst()
        }
      }
    )

    const searchFirst = async () => {
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true

      const result = await search(props.query, page, props.showSinger)
      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
      await nextTick()
      await makeItScrollable()
    }

    const searchMore = async () => {
      if (!hasMore.value) return
      page.value++
      const result = await search(props.query, page.value, props.showSinger)
      const newSongs = await processSongs(result.songs)
      songs.value = songs.value.concat(newSongs)
      hasMore.value = result.hasMore
      await nextTick()
      await makeItScrollable()
    }

    // 判斷回傳結果數量是否有撐滿當前可視畫面, 若沒將自動加載下一頁
    const makeItScrollable = async () => {
      if (scroll.value.maxScrollY >= -1) {
        await searchMore()
      }
    }

    const { scroll, rootRef, isPullUpLoad } = usePullUpLoad(searchMore)

    return {
      singer,
      songs,
      loading,
      loadingText,
      noResult,
      noResultText,
      pullUpLoading,
      // pullUpLoad
      rootRef
    }
  }
}
</script>

<style lang="scss" scoped>
.search-suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^='icon-'] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
