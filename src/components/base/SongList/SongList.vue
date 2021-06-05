<template>
  <ul class="song-list">
    <li
      class="item"
      v-for="(song, index) in songs"
      :key="song.id"
      @click="selectSong(song, index)"
    >
      <div class="content">
        <h2 class="name">{{ song.name }}</h2>
        <p class="desc">{{ getDesc(song) }}</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SongList',
  props: {
    songs: {
      type: Array,
      default: () => []
    }
  },
  emits: ['select'],
  methods: {
    getDesc(song) {
      return `${song.singer}·${song.album}`
    },
    selectSong(song, index) {
      this.$emit('select', { song, index })
    }
  }
}
</script>

<style lang="scss" scoped>
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .content {
      overflow: hidden;
      flex: 1;
      line-height: 20px;
      .name {
        color: $color-text;

        @include no-wrap();
      }
      .desc {
        margin-top: 4px;
        color: $color-text-d;

        @include no-wrap();
      }
    }
  }
}
</style>
