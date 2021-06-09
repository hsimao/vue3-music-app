<template>
  <div class="recommend" v-loading:[loadingText]="loading">
    <Scroll class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <Slider v-if="showSlider" :sliders="sliders" />
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">熱門歌單推薦</h1>
          <ul>
            <li
              v-for="item in albums"
              class="item"
              :key="item.id"
              @click="selectItem(item)"
            >
              <div class="icon">
                <img width="60" height="60" v-lazy="item.pic" />
              </div>
              <div class="text">
                <h2 class="name">{{ item.username }}</h2>
                <p class="title">{{ item.title }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedAlbum" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getRecommend } from '@/service/recommend'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import storage from 'good-storage'
import { ALBUM_KEY } from '@/assets/js/constant'
import Slider from '@/components/base/Slider/Slider'
import Scroll from '@/components/hoc/WrapScroll'

export default {
  name: 'RecommendPage',
  components: {
    Slider,
    Scroll
  },
  setup() {
    const sliders = ref([])
    const showSlider = ref(false)
    const selectedAlbum = ref(null)
    const albums = ref([])
    const router = useRouter()

    const loadingText = ref('正在載入中...')

    onMounted(async () => {
      const result = await getRecommend()
      sliders.value = result.sliders
      showSlider.value = sliders.value.length > 0
      albums.value = result.albums
    })

    const loading = computed(() => {
      return !sliders.value.length && !showSlider.value.length
    })

    const selectItem = album => {
      selectedAlbum.value = album
      cacheAlbum(album)
      router.push(`/recommend/${album.id}`)
    }

    const cacheAlbum = album => {
      storage.session.set(ALBUM_KEY, album)
    }

    return {
      sliders,
      showSlider,
      albums,
      selectedAlbum,
      loading,
      loadingText,
      selectItem
    }
  }
}
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
        }
        .name {
          margin-bottom: 10px;
          color: $color-text;
        }
        .title {
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
