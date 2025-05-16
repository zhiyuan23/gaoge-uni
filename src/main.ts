import App from '@/App.vue'
import setupPlugins from '@/plugins'
import { createSSRApp } from 'vue'
// 引入UnoCSS
import 'virtual:uno.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(setupPlugins)
  // 全局配置云对象调用选项
  app.config.globalProperties.$uniCloud = {
    importObjectOptions: {
      loading: false, // 关闭所有云对象的默认 Loading
    },
  }

  return {
    app,
  }
}
