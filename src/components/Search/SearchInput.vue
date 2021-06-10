<template>
  <div class="search-input">
    <i class="icon-search" />
    <input
      class="input-inner"
      :placeholder="placeholder"
      :value="modelValue"
      @input="changeInput"
    />
    <i class="icon-dismiss" v-show="modelValue" @click="clear" />
  </div>
</template>

<script>
import { debounce } from 'throttle-debounce'

export default {
  name: 'SearchInput',
  props: {
    modelValue: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: '搜尋歌曲、歌手'
    }
  },
  methods: {
    changeInput: debounce(300, function(e) {
      const value = e.target.value.trim()
      this.$emit('update:modelValue', value)
    }),
    clear() {
      this.$emit('update:modelValue', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.search-input {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 32px;
  background: $color-highlight-background;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: $color-text-d;
  }
  .input-inner {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: $color-text-d;
  }
}
</style>
