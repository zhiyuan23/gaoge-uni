<script setup lang="ts">
import type { PrizeInfo } from '@/types'
import SeriesList from '@/pages/series/list.vue'
import { defaultPrizeInfo } from '@/types'
import { delay } from '@/utils'

const showResult = ref(false)
const drawResultInfo = ref<PrizeInfo>(defaultPrizeInfo)

onLoad(async (options) => {
  const prizeInfo = options?.prizeInfo ? JSON.parse(options.prizeInfo) : null
  if (prizeInfo) {
    drawResultInfo.value = prizeInfo
    await delay(500)
    showResult.value = true
  }
})
</script>

<template>
  <view>
    <SeriesList />

    <!-- 扫码结果弹窗 -->
    <LotteryResult
      v-model="showResult"
      :prize-info="drawResultInfo"
    />
  </view>
</template>
