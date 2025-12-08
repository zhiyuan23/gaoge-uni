<template>
  <view class="relative h-100vh overflow-hidden">
    <!-- 背景图 -->
    <image
      class="relative w-100vw"
      src="@/static/images/series/bg_zbqr.png"
      mode="widthFix"
    />
    <!-- 扫一扫按钮 -->
    <view class="absolute w-100vw flex-center-center mt-1100 top-0">
      <view class="button w-540 h-100" @click="scanCode">
        <image class="size-72" src="@/static/images/icons/ic-scan.png" />
        <text class="font-bold pl-8 text-46">
          点击扫一扫
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang='ts'>
import { defaultPrizeInfo } from '@/types/modules/prize'

const showDialog = ref(false)

const prizeInfo = ref(defaultPrizeInfo)

// 扫一扫
const scanCode = async () => {
  const { result } = await uni.scanCode()
  console.log('扫描结果：', result)
  showDialog.value = true
}

onLoad(() => {
  const data = {
    status: 'won', // won  lost  fail
    type: 'physical', // physical  cash
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
</style>
