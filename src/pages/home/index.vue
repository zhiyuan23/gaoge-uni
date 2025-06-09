<template>
  <view class="flex-col-center">
    <view class="overflow-hidden rounded w-750">
      <u-swiper
        height="600rpx"
        :list="bannerImgs"
        indicator
        indicator-mode="line"
        circular
        radius="0"
        interval="10000"
        duration="500"
      />
    </view>
    <view class="w-full flex-center-around mt-30">
      <view v-for="team in playingTeam" :key="team.code" class="flex-col-center-center text-center w-250">
        <view class="text-30">
          {{ team.name }}
        </view>
        <view class="text-gray-400 text-22">
          {{ team.code.toUpperCase() }}
        </view>
        <view class="rounded mt-10 w-120 h-10" :class="`bg-${team.code}`" />
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
import { useHomeStore } from '@/store'

// #ifdef MP-WEIXIN
const { onShareAppMessage, onShareTimeline } = useShare({
  title: '高歌超级杯',
  path: 'pages/home/index',
  imageUrl: '/static/images/img_share_1.jpg',
})
onShareAppMessage()
onShareTimeline()
// #endif

const title = ref<string>()
title.value = import.meta.env.VITE_APP_TITLE

// 首页数据
const homeStore = useHomeStore()
const { bannerImgs, playingTeam } = storeToRefs(homeStore)

const showAgreePrivacy = ref(false)

// 同意隐私协议
function handleAgree() {
  console.log('同意隐私政策')
}

onMounted(() => {
  homeStore.getBannerImgs()
  homeStore.getPlayingTeam()
})
</script>
