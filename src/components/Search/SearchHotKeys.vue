<template>
  <div class="search-hot-keys">
    <h1 class="title">熱門搜尋</h1>
    <ul v-if="keys.length">
      <li
        class="item"
        v-for="item in keys"
        :key="item.id"
        @click="$emit('selected', item.key)"
      >
        <span>{{ item.key }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SearchHotKeys',
  props: {
    keys: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.search-hot-keys {
  margin: 0 20px 20px 20px;
  .title {
    margin-bottom: 20px;
    font-size: $font-size-medium;
    color: $color-text-l;
  }
  .item {
    display: inline-block;
    padding: 5px 10px;
    margin: 0 20px 10px 0;
    border-radius: 6px;
    background: $color-highlight-background;
    font-size: $font-size-medium;
    color: $color-text-d;
  }
}
</style>
