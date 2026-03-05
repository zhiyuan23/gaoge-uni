<script setup lang="ts">
import { useAuthStore } from '@/store'

onLaunch(async () => {
  useAuthStore().silentLogin()
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
@import '@/static/styles/common.scss';
@import '@/static/styles/font.scss';
</style>
