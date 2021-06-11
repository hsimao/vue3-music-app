<template>
  <teleport to="body">
    <transition name="slide">
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="hide">
            <i class="icon-close" />
          </div>
        </div>

        <div class="search-input-wrapper">
          <SearchInput v-model="query" placeholder="搜索歌曲" />
        </div>

        <!-- 最近播放、歷史搜尋 -->
        <div v-show="!query">
          <Switches v-model="currentIndex" :items="['最近播放', '歷史搜尋']" />
          <div class="list-wrapper">
            <!-- 最近播放 -->
            <Scroll
              v-if="currentIndex === 0"
              class="list-scroll"
              ref="scrollRef"
            >
              <div class="list-inner">
                <SongList :songs="playHistory" @select="selectSongBySongList" />
              </div>
            </Scroll>

            <!-- 歷史搜尋 -->
            <Scroll
              v-if="currentIndex === 1"
              class="list-scroll"
              ref="scrollRef"
            >
              <div class="list-inner">
                <SearchList
                  :searches="searchHistory"
                  :show-delete="false"
                  @select="addQuery"
                />
              </div>
            </Scroll>
          </div>
        </div>

        <div class="search-result" v-show="query">
          <SearchSuggest
            :query="query"
            :show-singer="false"
            @select-song="selectSongBySuggest"
          />
        </div>

        <Message ref="messageRef">
          <div class="message-title">
            <i class="icon-ok" />
            <span class="text">
              「{{ currentAddSong }}」歌曲已经添加到播放列表
            </span>
          </div>
        </Message>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import SearchInput from '@/components/Search/SearchInput'
import SearchSuggest from '@/components/Search/SearchSuggest'
import SearchList from '@/components/Search/SearchList'
import Switches from '@/components/base/Switches/Switches'
import Scroll from '@/components/hoc/WrapScroll'
import SongList from '@/components/base/SongList/SongList'
import Message from '@/components/base/Message/Message'
import useSearchHistory from '@/components/Search/useSearchHistory'

export default {
  name: 'AddSong',
  components: {
    SearchInput,
    SearchSuggest,
    SearchList,
    Switches,
    Scroll,
    SongList,
    Message
  },
  setup() {
    const messageRef = ref(null)
    const visible = ref(false)
    const query = ref('')
    const currentIndex = ref(0)
    const currentAddSong = ref('')

    const store = useStore()
    const searchHistory = computed(() => store.state.searchHistory)
    const playHistory = computed(() => store.state.playHistory)

    const show = () => (visible.value = true)
    const hide = () => (visible.value = false)
    const addQuery = song => (query.value = song)

    const selectSongBySongList = ({ song }) => {
      addSong(song)
    }

    const selectSongBySuggest = song => {
      addSong(song)
      saveSearch(query.value)
    }

    const addSong = song => {
      store.dispatch('addSong', song)
      showMessage(song)
    }

    const showMessage = song => {
      currentAddSong.value = song.name
      messageRef.value.show()
    }

    const { saveSearch } = useSearchHistory()

    return {
      messageRef,
      visible,
      query,
      currentIndex,
      searchHistory,
      playHistory,
      currentAddSong,
      selectSongBySongList,
      selectSongBySuggest,
      addQuery,
      show,
      hide
    }
  }
}
</script>

<style lang="scss" scoped>
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background: $color-background;
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
  .search-input-wrapper {
    margin: 20px;
  }
  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}

.message-title {
  text-align: center;
  padding: 18px 0;
  font-size: 0;
  .icon-ok {
    font-size: $font-size-medium;
    color: $color-theme;
    margin-right: 4px;
  }
  .text {
    font-size: $font-size-medium;
    color: $color-text;
  }
}
</style>
