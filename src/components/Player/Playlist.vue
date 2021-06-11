<template>
  <teleport to="body">
    <transition name="list-fade">
      <div class="playlist" v-show="visible && playlist.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click="changeMode" />
              <span class="text">{{ modeText }}</span>

              <span class="clear" @click="showConfirm">
                <i class="icon-clear" />
              </span>
            </h1>
          </div>

          <Scroll class="list-content" ref="scrollRef">
            <transition-group ref="listRef" name="list" tag="ul">
              <li
                class="item"
                :class="currentItemClass(song)"
                v-for="song in sequenceList"
                :key="song.id"
                @click="selectSong(song)"
              >
                <i class="current" :class="getCurrentIcon(song)" />
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)" />
                </span>
                <span
                  class="delete"
                  :class="{ disable: removing }"
                  @click.stop="removeSong(song)"
                >
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </Scroll>

          <div class="list-add">
            <div class="add" @click="showAddSong">
              <i class="icon-add" />
              <span class="text">添加歌曲到清單</span>
            </div>
          </div>

          <div class="list-footer" @click="hide">
            <span>關閉</span>
          </div>
        </div>

        <Confirm
          ref="confirmRef"
          text="是否清空播放列表？"
          confirm-btn-text="清空"
          @confirm="confirmClear"
        />

        <AddSong ref="addSongRef" />
      </div>
    </transition>
  </teleport>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import useMode from './useMode'
import useFavorite from './useFavorite'
import Scroll from '@/components/base/Scroll/Scroll'
import Confirm from '@/components/base/Confirm/Confirm'
import AddSong from '@/components/AddSong/AddSong'

export default {
  name: 'Playlist',
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  setup() {
    const visible = ref(false)
    const removing = ref(false)
    const scrollRef = ref(null)
    const listRef = ref(null)
    const confirmRef = ref(null)
    const addSongRef = ref(null)

    // vuex
    const store = useStore()
    const playlist = computed(() => store.state.playlist)
    const sequenceList = computed(() => store.state.sequenceList)
    const currentSong = computed(() => store.getters.currentSong)

    // watch
    watch(currentSong, async newSong => {
      if (!visible.value || !newSong.value) {
        return
      }
      await nextTick()
      scrollToCurrent()
    })

    // methods
    const getCurrentIcon = song => {
      return song.id === currentSong.value.id ? 'icon-play' : ''
    }

    const currentItemClass = song => {
      return song.id === currentSong.value.id ? 'active' : ''
    }

    const show = async () => {
      visible.value = true
      await nextTick()
      refreshScroll()
      scrollToCurrent()
    }

    const hide = () => {
      visible.value = false
    }

    const refreshScroll = () => {
      scrollRef.value.scroll.refresh()
    }

    const scrollToCurrent = () => {
      const index = sequenceList.value.findIndex(
        song => song.id === currentSong.value.id
      )
      if (index === -1) return
      const target = listRef.value.$el.children[index]
      scrollRef.value.scroll.scrollToElement(target, 600)
    }

    const selectSong = song => {
      const index = playlist.value.findIndex(item => item.id === song.id)
      store.commit('setCurrentIndex', index)
      store.commit('setPlaying', true)
    }

    const removeSong = song => {
      if (removing.value) return
      removing.value = true

      store.dispatch('removeSong', song)

      // 播放列表都沒有時需要隱藏
      if (!playlist.value.length) {
        hide()
      }

      // 預防刪除動畫尚未結束時又觸發一次刪除, 導致 index 異常
      setTimeout(() => {
        removing.value = false
      }, 300)
    }

    const showConfirm = () => {
      confirmRef.value.show()
    }

    const confirmClear = () => {
      store.dispatch('clearSongList')
      hide()
    }

    const showAddSong = () => {
      addSongRef.value.show()
    }

    // hook
    const { modeIcon, modeText, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    return {
      scrollRef,
      listRef,
      confirmRef,
      addSongRef,
      visible,
      playlist,
      sequenceList,
      removing,
      getCurrentIcon,
      currentItemClass,
      selectSong,
      removeSong,
      show,
      hide,
      showConfirm,
      confirmClear,
      showAddSong,
      // mode
      modeIcon,
      modeText,
      changeMode,
      // favorite
      getFavoriteIcon,
      toggleFavorite
    }
  }
}
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 20px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          color: $color-theme-d;
          font-size: 24px;
        }
        .text {
          flex: 1;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            color: $color-text-d;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .list-content {
      overflow: hidden;
      max-height: 240px;
      .item {
        display: flex;
        overflow: hidden;
        align-items: center;
        padding: 0 30px 0 20px;
        height: 40px;
        &.active {
          .text {
            color: $color-text;
          }
        }

        .current {
          flex: 0 0 20px;
          width: 20px;
          color: $color-theme;
          font-size: $font-size-small;
        }
        .text {
          flex: 1;
          color: $color-text-d;
          font-size: $font-size-medium;

          @include no-wrap();
        }
        .favorite {
          margin-right: 15px;
          color: $color-theme;
          font-size: $font-size-small;

          @include extend-click();
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          color: $color-theme;
          font-size: $font-size-small;

          @include extend-click();
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-add {
      margin: 20px auto 30px auto;
      width: 140px;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-footer {
      background: $color-background;
      color: $color-text-l;
      text-align: center;
      font-size: $font-size-medium-x;
      line-height: 50px;
    }
  }
}
</style>
