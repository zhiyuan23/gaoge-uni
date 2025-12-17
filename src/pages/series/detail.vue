<template>
  <view class="page relative h-screen overflow-hidden">
    <!-- 背景图 -->
    <image
      class="relative w-100vw"
      src="@/static/images/series/bg_zwcs.png"
      mode="widthFix"
    />

    <view class="absolute text-center text-white top-40 right-10 leading-30">
      <view class="flex-center-end w-100" @click="showRule = true">
        <view class="u-press flex-center rounded-3 bg-[var(--color)] w-48 h-146">
          活动规则
        </view>
      </view>
      <view class="h-28" />
      <view class="flex-center-end w-100" @click="showService = true">
        <view class="u-press flex-center rounded-3 bg-[var(--color)] w-48 h-146">
          联系客服
        </view>
      </view>
    </view>

    <!-- 主体区域 -->
    <view class="absolute w-100vw flex-col-center-center font-bold mt-1090 top-0">
      <view class="h-150">
        <!-- 扫一扫按钮 -->
        <MainButton
          v-if="true"
          label="点击扫一扫"
          icon="scan"
          @click="scanCode"
        />

        <!-- 活动为开始/已结束 -->
        <view v-else class="text-center">
          <view class="color-[var(--color)] leading-100 text-46">
            活动为开始，敬请期待
          </view>
          <view class="color-black font-normal leading-22 text-22">
            2026年3月1日-2026年12月31日
          </view>
        </view>
      </view>

      <view class="flex-center-between w-540 text-30">
        <view class="u-press button w-240 h-70" @click="showMyPrize = true">
          <u-icon name="gift" :color="color" size="22" />
          我的奖品
        </view>
        <view class="u-press button w-240 h-70" @click="goExchange">
          <u-icon name="map" :color="color" size="22" class="pr-10" />
          兑奖点
        </view>
      </view>
    </view>

    <!-- 开奖弹窗 -->
    <LotteryDraw v-model="showDraw" :type="seriesCode" />

    <!-- 活动规则 -->
    <LotteryRule v-model="showRule" />

    <!-- 客服电话 -->
    <LotteryService v-model="showService" />

    <!-- 我的奖品 -->
    <LotteryMyPrize
      v-model="showMyPrize"
      :data="prizeList"
      :loading="loading"
      :has-more="hasMore"
      @loadmore="handleLoadMore"
      @action="handleAction"
    />

    <!-- 扫码结果弹窗 -->
    <LotteryResult v-model="showResult" :prize-info="prizeInfo" />
  </view>
</template>

<script setup lang='ts'>
import { useTheme } from '@/composables'
import useMyPrizeStore from '@/store/user/prize'
import { defaultPrizeInfo } from '@/types'
import { Dialog, navigateTo } from '@/utils'

const myPrizeStore = useMyPrizeStore()
const { seriesCode, color } = useTheme()

// 开奖弹窗
const showDraw = ref(false)

// 活动说明/客服电话
const showRule = ref(false)
const showService = ref(false)

// 中奖弹窗相关
const showResult = ref(false)
const prizeInfo = ref(defaultPrizeInfo)

// 我的奖品弹窗相关
const showMyPrize = ref(false)

// 使用当前 seriesCode 对应的数据
const prizeList = computed(() => myPrizeStore.getList(seriesCode))
const loading = computed(() => myPrizeStore.getLoading(seriesCode))
const hasMore = computed(() => myPrizeStore.getHasMore(seriesCode))

// 我的奖品-打开弹窗时加载第一页
watch(showMyPrize, (val) => {
  if (val && prizeList.value.length === 0) {
    myPrizeStore.fetchList(seriesCode, true)
  }
})

// 我的奖品-加载更多
const handleLoadMore = () => {
  myPrizeStore.fetchList(seriesCode)
}

// 我的奖品-操作处理
const handleAction = async (type: any, item: any) => {
  switch (type) {
    case 'fillInfo':
      navigateTo(`/pages/user/prize/redeem-info?id=${item.id}`)
      break
    case 'nearbyStore':
      navigateTo('/pages/shop/index')
      break
    case 'receive':
      Dialog('立即领取')
      break
  }
}

// 扫一扫
const scanCode = async () => {
  showDraw.value = true
}

// 前往兑奖点
const goExchange = () => {
  navigateTo('/pages/shop/index')
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

  myPrizeStore.fetchList(seriesCode, true)
})
</script>

<style scoped>
.page {
  --color: v-bind(color);
}

:deep(uni-page-wrapper) {
  overflow: hidden;
}

.button {
  @apply color-[var(--color)] border-5-solid-[var(--color)];
}
</style>
