<template>
  <view class="relative h-100vh overflow-hidden">
    <!-- 背景图 -->
    <!-- <image
      class="relative w-100vw"
      src="@/static/images/series/bg_ml.png"
      mode="widthFix"
    /> -->

    <view class="absolute top-40 right-10">
      <view class="subbtn" @click="showRule = true">
        活动规则
      </view>
      <view class="subbtn" @click="showService = true">
        联系客服
      </view>
    </view>

    <!-- 主体区域 -->
    <view class="absolute w-100vw flex-col-center-center font-bold mt-1090 top-0">
      <view class="h-150">
        <!-- 扫一扫按钮 -->
        <view v-if="true" class="button w-540 h-100" @click="scanCode">
          <image class="size-72 pr-8" src="@/static/images/icons/ic-scan.png" />
          <text class="text-46">
            点击扫一扫
          </text>
        </view>

        <!-- 活动为开始/已结束 -->
        <view v-else class="text-center">
          <view class="color-ml leading-100 text-46">
            活动为开始，敬请期待
          </view>
          <view class="color-black font-normal leading-22 text-22">
            2026年3月1日-2026年12月31日
          </view>
        </view>
      </view>

      <view class="flex-center-between w-540 text-30">
        <view class="button w-240 h-70" @click="goMyPrize">
          <image class="size-48 pr-8" src="@/static/images/icons/ic-prize.png" />
          我的奖品
        </view>
        <view class="button w-240 h-70" @click="goExchange">
          <image class="size-48 pr-8" src="@/static/images/icons/ic-location.png" />
          兑奖门店
        </view>
      </view>
    </view>

    <!-- 活动规则 -->
    <LotteryRule
      v-model="showRule"
      type="ml"
    />

    <!-- 客服电话 -->
    <LotteryService
      v-model="showService"
      type="ml"
    />

    <!-- 扫码结果弹窗 -->
    <LotteryResult
      v-model="showResult"
      :prize-info="prizeInfo"
    />
  </view>
</template>

<script setup lang='ts'>
import { defaultPrizeInfo } from '@/types/modules/prize'
import { navigateTo } from '@/utils'

// 活动说明/客服电话
const showRule = ref(false)
const showService = ref(false)

// 中奖弹窗相关
const showResult = ref(false)
const prizeInfo = ref(defaultPrizeInfo)

// 扫一扫
const scanCode = async () => {
  const { result } = await uni.scanCode()
  console.log('扫描结果：', result)
  showResult.value = true
}

// 前往我的奖品
const goMyPrize = () => {
  navigateTo('/pages/lottery/my-prize')
}

// 前往兑奖点
const goExchange = () => {
  navigateTo('/pages/lottery/exchange')
}

onLoad(() => {
  const data = {
    status: 'won',
    type: 'physical',
    title: '该瓶盖已中奖1元畅饮',
    isExchanged: false,
    scanTime: '2025年10月01日 13:59:59',
    exchangeTime: '2025年10月02日 13:59:59',
  }
  prizeInfo.value = data
})
</script>

<style scoped>
:deep(uni-page-wrapper) {
  overflow: hidden;
}

.button {
  @apply bg-ml
}

.subbtn {
  @apply flex-center rounded-3 bg-ml text-center text-white mb-28 w-48 h-146 leading-30
}
</style>
