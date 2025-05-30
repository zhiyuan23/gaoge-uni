<script setup lang='ts'>
import { useAppStore, usePlayerStore, useTeamStore } from '@/store'
import { mpUpdate } from '@/utils/index'

const appStore = useAppStore()
const playerStore = usePlayerStore()
const teamStore = useTeamStore()

onLaunch(() => {
  appStore.initSystemInfo()
  playerStore.getPlayerList()

  teamStore.getAssetList()
  teamStore.getFinanceDetail()

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
