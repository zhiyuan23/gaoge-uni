<template>
  <view class="page-wrap">
    <view :style="{ height: `${navbarTotalHeight}px` }" />
    <view class="h-200rpx">
      111
    </view>
  </view>
</template>

<script setup lang='ts'>
import { useAppStore } from '@/store'

const appStore = useAppStore()
const navbarTotalHeight = computed(() => {
  return appStore.getSystemInfo.statusBarHeight + 44
})

onMounted(async () => {

})
</script>
