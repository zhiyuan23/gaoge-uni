<template>
  <u-popup
    :show="show"
    mode="center"
    bg-color="transparent"
    overlay-opacity="0.8"
    :safe-area-inset-bottom="false"
    :close-on-click-overlay="false"
  >
    <view class="flex-col-center -mt-80">
      <!-- 关闭按钮 -->
      <view class="mb-40 w-640">
        <image
          src="/static/images/icons/ic-close.png"
          class="float-right size-60"
          @click="handleClose"
        />
      </view>

      <view class="relative z-2 flex-col-center overflow-hidden">
        <!-- 中奖提示 -->
        <view v-if="prizeInfo?.drawResult === 'pass' && prizeInfo?.bingo === 1" class="flex-start">
          <image
            :src="prizeInfo.prizeImage"
            mode="aspectFit"
            class="relative w-680 h-490"
          />
        </view>

        <!-- 未中奖提示 -->
        <view v-else class="relative flex-start-center w-680 h-490">
          <!-- 背景图 -->
          <view class="absolute w-full h-490 top-0">
            <image :src="`/static/images/lottery/popup-bg-${seriesCode}.png`" class="size-full" />
          </view>

          <!-- 未中奖信息 -->
          <view class="relative z-1 flex-col-center-center w-593 h-466">
            <view class="flex-col-center-center font-bold pt-75 h-140 text-44" :style="{ color: lotteryColor }">
              <view class="text-center mx-25 leading-75">
                该瓶盖已中奖红包2元
              </view>
              <view class="mt-25">
                {{ prizeInfo.isExchanged === 1 ? '已兑换' : '尚未兑换' }}
              </view>
            </view>
            <view class="mt-50 h-72 leading-48">
              <view>扫码时间：{{ prizeInfo.scanTime }}</view>
              <view>兑奖截止：{{ prizeInfo.exchangeTime }}</view>
            </view>
          </view>
          <!-- /未中奖信息 -->
        </view>
      </view>

      <view class="w-full text-center mt-42 h-230">
        <!-- 操作按钮 -->
        <view class="h-102">
          <MainButton
            v-if="buttonConfig"
            :label="buttonConfig?.label"
            :icon="buttonConfig?.icon"
            @click="handleConfirm(buttonConfig?.type, prizeInfo?.giftCouponId)"
          />
        </view>

        <!-- 提示话术 -->
        <view class="mx-40 mt-40">
          <view class="color-white leading-46">
            请于24小时内完成领取，逾期红包失效<br>中奖记录可在「我的奖品」中查看
          </view>
        </view>
      </view>
    </view>

    <!-- 购物车图标 -->
    <view class="fixed top-50% mt-500 w-95 h-101 right-15">
      <image
        :src="`/static/images/lottery/popup-cart-${seriesCode}.png`"
        mode="aspectFit"
        class="size-full"
        @click="handleGoToShop"
      />
    </view>
  </u-popup>
</template>

<script setup lang='ts'>
import { useTheme } from '@/composables'
import { defaultPrizeInfo, type PrizeInfo } from '@/types/modules/prize'
import { navigateToMiniApp } from '@/utils'

const props = defineProps<{
  prizeInfo?: PrizeInfo;
}>()

const emit = defineEmits<{
  close: [];
  confirm: [string, any];
}>()

const { seriesCode, lotteryColor } = useTheme()

const show = defineModel<boolean>({ required: true })

const prizeInfo = computed(() => props.prizeInfo ?? defaultPrizeInfo)

const handleClose = () => {
  show.value = false
  emit('close')
}

const handleConfirm = (type: string, id: any) => {
  emit('confirm', type, id)
}

const handleGoToShop = () => {
  navigateToMiniApp({
    appId: 'wx6fb110526c12fc40',
    path: 'sub1/pages/ys-Exchange/ys-Exchange',
  })
}

// 中奖类型按钮映射
const prizeTypeButtonMap = {
  large_red_envelope: {
    label: '填写兑奖信息',
    type: 'fillInfo',
    icon: 'edit' as const,
  },
  one_yuan_exchange: {
    label: '前往附近兑奖点',
    type: 'nearbyStore',
    icon: 'location' as const,
  },
  small_red_envelope: {
    label: '开心收下',
    type: 'receive',
    icon: 'coin' as const,
  },
} as const

// 按钮配置
const buttonConfig = computed(() => {
  const { prizeType, isExchanged, drawResult, bingo } = prizeInfo.value

  if (drawResult === 'pass' && bingo === 0) {
    return {
      label: '再扫一瓶',
      type: 'scan',
      icon: 'scan',
    }
  }

  if (prizeType && isExchanged !== 1 && prizeType in prizeTypeButtonMap) {
    return prizeTypeButtonMap[prizeType as keyof typeof prizeTypeButtonMap]
  }

  return null
})
</script>
