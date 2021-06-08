<template>
  <scroll class="lyric-scroll" ref="lyricScrollRef">
    <div class="lyric-wrapper">
      <div v-if="currentLyric" ref="lyricListRef">
        <p
          class="text"
          :class="{ current: currentLineNum === index }"
          v-for="(line, index) in currentLyric.lines"
          :key="line.num"
        >
          {{ line.txt }}
        </p>
      </div>
      <div class="pure-music" v-show="pureMusicLyric">
        <p>{{ pureMusicLyric }}</p>
      </div>
    </div>
  </scroll>
</template>

<script>
import Scroll from '@/components/base/Scroll/Scroll'
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export default {
  name: 'Lyric',
  components: {
    Scroll
  },
  emits: ['updateLyric'],
  props: {
    songReady: {
      type: Boolean,
      default: false
    },
    currentTime: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    const currentLyric = ref(null)
    const currentLineNum = ref(0)
    const lyricScrollRef = ref(null)
    const lyricListRef = ref(null)
    const pureMusicLyric = ref('')

    const store = useStore()
    const currentSong = computed(() => store.getters.currentSong)

    const lyricPlayTime = computed(() => props.currentTime * 1000)

    watch(currentSong, async newSong => {
      if (!newSong.url || !newSong.id) {
        return
      }
      resetLyric()

      initLyric(newSong)
    })

    const initLyric = async newSong => {
      const lyric = await getLyric(newSong)
      store.commit('addSongLyric', { song: newSong, lyric })

      // 預防還在等歌詞回應的這段時間, 當下去改變了當前播放歌曲
      if (currentSong.value.lyric !== lyric) return

      currentLyric.value = new Lyric(lyric, handleUpdateLyric)

      const hasLyric = currentLyric.value.lines.length > 0

      if (hasLyric && props.songReady) {
        playLyric()
      } else {
        // "[00:00:00]此歌曲为没有填词的纯音乐，请您欣赏" => 此歌曲为没有填词的纯音乐，请您欣赏
        pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
        emit('updateLyric', pureMusicLyric.value)
      }
    }

    const resetLyric = () => {
      stopLyric()
      currentLyric.value = null
      currentLineNum.value = 0
      emit('updateLyric', '')
    }

    const handleUpdateLyric = ({ lineNum, txt }) => {
      emit('updateLyric', txt)
      currentLineNum.value = lineNum
      const scrollComponent = lyricScrollRef.value
      const listEl = lyricListRef.value

      if (!listEl) return

      // 播放歌曲超過第五行時, 每次換行都自動滾動到當前位置
      if (lineNum > 5) {
        const lineEl = listEl.children[lineNum - 5]
        scrollComponent.scroll.scrollToElement(lineEl, 1000)
      } else {
        scrollComponent.scroll.scrollTo(0, 0, 1000)
      }
    }

    const playLyric = () => {
      const currentLyricVal = currentLyric.value
      if (currentLyricVal) {
        currentLyricVal.seek(lyricPlayTime.value)
      }
    }

    const stopLyric = () => {
      const currentLyricVal = currentLyric.value
      if (currentLyricVal) {
        currentLyricVal.stop()
      }
    }

    return {
      currentLyric,
      currentLineNum,
      pureMusicLyric,
      playLyric,
      stopLyric,
      lyricScrollRef,
      lyricListRef
    }
  }
}
</script>

<style lang="scss" scoped>
.lyric-scroll {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .lyric-wrapper {
    width: 80%;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;

    .text {
      line-height: 32px;
      color: $color-text-l;
      font-size: $font-size-medium;

      &.current {
        color: $color-text;
      }
    }

    .pure-music {
      padding-top: 50%;
      line-height: 32px;
      color: $color-text-l;
      font-size: $font-size-medium;
    }
  }
}
</style>
