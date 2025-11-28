<template>
  <view class="h-100vh overflow-hidden">
    <!-- 背景图 -->
    <image
      class="relative w-100vw"
      src="@/static/images/series/bg_zwcs.png"
      mode="widthFix"
    />
    <!-- 扫一扫按钮 -->
    <view class="relative w-100vw flex-center-center">
      <view class="button fixed top-80% w-540 h-100" @click="scanCode">
        <image class="size-72" src="@/static/images/icons/ic-scan.png" />
        <text class="font-bold pl-8 text-46">
          点击扫一扫
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang='ts'>
import { Dialog } from '@/utils/modals'

// 扫一扫
async function scanCode() {
  const { result } = await uni.scanCode()
  console.log('扫描结果：', result)
  Dialog(`请扫描正确的产品码`)
}

onLoad(() => {
  console.log('query')
})
</script>
