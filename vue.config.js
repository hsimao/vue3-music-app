module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 全域引入 variable、mixin
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  }
}
