<script setup lang='ts'>
import { useAppStore } from '@/store'
import { mpUpdate } from '@/utils/index'

onLaunch(() => {
  console.log('App Launch')
  // 获取系统信息
  const appStore = useAppStore()
  appStore.initSystemInfo()

  // #ifdef MP-WEIXIN
  mpUpdate()
  // #endif
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
/* 每个页面公共css */
// @import 'uview-plus/index.scss';
@import '@/static/styles/common.scss';
</style>
