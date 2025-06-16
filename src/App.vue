<script setup lang='ts'>
import {
  useAppStore,
  usePlayerStore,
  useTeamStore,
  useUserStore,
} from '@/store'
import { mpUpdate } from '@/utils/index'

const appStore = useAppStore()
const userStore = useUserStore()
const playerStore = usePlayerStore()
const teamStore = useTeamStore()

const initApp = () => {
  appStore.initSystemInfo()
  userStore.authLogin()

  playerStore.getMyPlayerInfo()
  playerStore.getPlayerList()

  teamStore.getAssetList()
  teamStore.getFinanceDetail()
}

onLaunch(() => {
  initApp()

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
