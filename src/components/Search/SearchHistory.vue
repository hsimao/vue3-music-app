<template>
  <div class="search-history">
    <h1 class="title">
      <span class="text">歷史搜尋</span>
      <span class="clear" @click="showConfirm">
        <i class="icon-clear" />
      </span>
    </h1>
    <Confirm
      ref="confirmRef"
      text="是否清空所有歷史搜尋"
      confirm-btn-text="清空"
      @confirm="$emit('clearSearch')"
    />
    <slot />
  </div>
</template>

<script>
import Confirm from '@/components/base/Confirm/Confirm'

export default {
  name: 'SearchHistory',
  components: {
    Confirm
  },
  methods: {
    showConfirm() {
      this.$refs.confirmRef.show()
    }
  }
}
</script>

<style lang="scss" scoped>
.search-history {
  .title {
    display: flex;
    align-items: center;
    height: 40px;
    font-size: $font-size-medium;
    color: $color-text-l;
    .text {
      flex: 1;
    }
    .clear {
      @include extend-click();
      .icon-clear {
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
  }
}
</style>
