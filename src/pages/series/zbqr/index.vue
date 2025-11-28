<template>
  <view class="h-100vh overflow-hidden">
    <!-- 背景图 -->
    <image
      class="relative w-100vw"
      src="@/static/images/series/bg_zbqr.png"
      mode="widthFix"
    />
    <!-- 扫一扫按钮 -->
    <view class="relative w-100vw flex-center-center">
      <view class="button fixed top-80% w-540 h-100" @click="scanCode">
        <view class="size-72">
          <image src="@/static/images/icons/ic-scan.png" mode="widthFix" />
        </view>
        <text class="font-bold pl-8 text-46">
          点击扫一扫
        </text>
      </view>
    </view>

    <!-- 扫码结果弹窗 -->
    <ResultDialog
      v-model="showDialog"
      :prize-info="prizeInfo"
    />
  </view>
</template>

<script setup lang='ts'>
import ResultDialog from '@/components/result-dialog/index.vue'
import { defaultPrizeInfo } from '@/types/modules/prize'

const showDialog = ref(true)

const prizeInfo = ref(defaultPrizeInfo)

// 扫一扫
async function scanCode() {
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
