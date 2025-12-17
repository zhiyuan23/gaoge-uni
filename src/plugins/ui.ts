import type { App } from 'vue'
import uviewPlus from 'uview-plus'

const setupUI = (app: App) => {
  // 必须先注册 uview-plus
  app.use(uviewPlus)

  // 注册完成后，再进行配置（setConfig 必须在 use 之后）
  uni.$u.setConfig({
    config: {
      // 默认单位为 rpx
      unit: 'rpx',

      // 关键：图标字体只加载一次
      loadFontOnce: true,
    },
    props: {
      button: {
        type: 'primary',
        shape: 'circle',
      },
      input: {
        border: 'surround',
        align: 'left',
      },
      icon: {
        size: 28,
      },
      // radio: {
      //   size: 30
      // },
      // 其他组件默认 props 配置...
    },
  })
}

export default setupUI
