import { createSSRApp } from 'vue'
import App from '@/App.vue'
import setupPlugins from '@/plugins'
import 'tdesign-uniapp/common/style/theme/index.css'
import 'virtual:uno.css' // UnoCSS

export const createApp = () => {
  const app = createSSRApp(App)

  // 注册全局插件（路由、Pinia、权限、UI库等）
  app.use(setupPlugins)

  return { app }
}
