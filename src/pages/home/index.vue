<template>
  <view class="flex-col-center">
    <view class="overflow-hidden rounded w-750">
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
    <view class="w-full flex-center-around mt-20">
      <view class="flex-col-center-center text-center w-250">
        <view>
          皇家高歌
        </view>
        <view class="rounded bg-real mt-10 w-100 h-10" />
      </view>
      <view class="flex-col-center-center text-center w-250">
        <view>
          高歌国际
          <view class="rounded bg-inter mt-10 w-100 h-10" />
        </view>
      </view>
      <view class="flex-col-center-center text-center w-250">
        <view>
          高歌联
          <view class="rounded bg-united mt-10 w-100 h-10" />
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
