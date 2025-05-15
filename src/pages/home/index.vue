<template>
  <view class="flex flex-col items-center justify-center">
    <view class="h-400rpx w-750rpx">
      <u-swiper
        height="400rpx"
        :list="bannerImgs"
        indicator
        indicator-mode="line"
        circular
        radius="0"
        interval="10000"
        duration="500"
      />
    </view>
    <view class="h-400rpx w-750rpx" />

    <!-- #ifdef MP-WEIXIN -->
    <!-- 隐私协议组件 -->
    <agree-privacy v-model="showAgreePrivacy" :disable-check-privacy="false" @agree="handleAgree" />
    <!-- #endif -->
  </view>
</template>

<script setup lang='ts'>
// #ifdef MP-WEIXIN
import { useShare } from '@/hooks'
// #endif
import { useHomeStore, useUserStore } from '@/store'

// #ifdef MP-WEIXIN
// 分享使用示例
const { onShareAppMessage, onShareTimeline } = useShare({
  title: '高歌体育',
  path: 'pages/home/index',
  imageUrl: '',
})
onShareAppMessage()
onShareTimeline()
// #endif

const title = ref<string>()
title.value = import.meta.env.VITE_APP_TITLE

// 首页数据
const homeStore = useHomeStore()
const bannerImgs = computed(() => homeStore.banner_imgs)

const showAgreePrivacy = ref(false)

const userStore = useUserStore()
console.log('userStore.user_name', userStore.user_name)

// 同意隐私协议
function handleAgree() {
  console.log('同意隐私政策')
}

onMounted(() => {
  homeStore.fetchBannerImgs()
})
</script>
