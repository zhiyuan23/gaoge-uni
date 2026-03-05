<template>
  <view>
    <SeriesList />

    <!-- 微信扫一扫未匹配到主题进入首页弹出扫码结果 -->
    <t-overlay background-color="rgba(0, 0, 0, 0.8)" :visible="showResult">
      <LotteryResult
        v-model="showResult"
        :prize-info="drawResultInfo"
        @confirm="onScan"
      />
    </t-overlay>
  </view>
</template>

<script setup lang="ts">
import type { PrizeInfo } from '@/types'
import SeriesList from '@/pages/series/list.vue'
import { defaultPrizeInfo } from '@/types'
import { reLaunch, sleep } from '@/utils'

const showResult = ref(false)
const drawResultInfo = ref<PrizeInfo>(defaultPrizeInfo)

onLoad(async (options) => {
  const prizeInfo = options?.prizeInfo ? JSON.parse(options.prizeInfo) : null
  if (prizeInfo) {
    drawResultInfo.value = prizeInfo
    await sleep(500)
    showResult.value = true
  }
})

// 点击再扫一瓶
const onScan = async () => {
  const { result } = await uni.scanCode()
  reLaunch(`/pages/series/index?scanCode=${result}`)
}
</script>
