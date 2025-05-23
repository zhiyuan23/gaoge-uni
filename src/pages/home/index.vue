<template>
  <view class="flex-col-center">
    <view class="w-750rpx overflow-hidden rounded">
      <u-swiper
        height="550rpx"
        :list="bannerImgs"
        indicator
        indicator-mode="line"
        circular
        radius="0"
        interval="10000"
        duration="500"
      />
    </view>
    <view class="mt-20rpx w-full flex-center-around">
      <view class="w-250rpx flex-col-center-center text-center">
        <view>
          皇家高歌
        </view>
        <view class="mt-10rpx h-10rpx w-100rpx rounded bg-real" />
      </view>
      <view class="w-250rpx flex-col-center-center text-center">
        <view>
          高歌国际
          <view class="mt-10rpx h-10rpx w-100rpx rounded bg-inter" />
        </view>
      </view>
      <view class="w-250rpx flex-col-center-center text-center">
        <view>
          高歌联
          <view class="mt-10rpx h-10rpx w-100rpx rounded bg-united" />
        </view>
      </view>
    </view>

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
