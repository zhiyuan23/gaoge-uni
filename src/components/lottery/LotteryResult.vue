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
      <view class="mb-30 w-640 h-140">
        <image
          src="/static/images/icons/ic-close.png"
          class="float-right size-60 mr-20 p-40"
          @click="handleClose"
        />
      </view>

      <view class="relative z-2 flex-col-center overflow-hidden">
        <!-- 中奖提示 -->
        <view v-if="isWon" class="flex-start">
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
            <image :src="`/static/images/lottery/popup-bg-${themeCode}.png`" class="size-full" />
          </view>

          <!-- 未中奖信息 -->
          <view class="relative z-1 flex-col-center-center w-593 h-466">
            <view class="flex-col-center-center font-bold pt-60 h-140 text-44" :style="{ color: lotteryColor }">
              <text class="text-center mx-25 leading-75">
                {{ displayErrorText }}
              </text>
              <view v-if="isExchanged" class="mt-24">
                已兑换
              </view>
              <view v-if="noExchanged" class="mt-24">
                尚未兑换
              </view>
            </view>

            <!-- 时间信息 -->
            <view v-if="timeLines.length" class="mt-48 h-72 leading-48">
              <view v-for="line in timeLines" :key="line">
                {{ line }}
              </view>
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
        <view class="mx-120 mt-40">
          <text class="color-white leading-46">
            {{ displayTipsText }}
          </text>
        </view>
      </view>
    </view>

    <!-- 购物车图标 -->
    <view v-if="showCart" class="fixed top-50% mt-500 w-95 h-101 right-15">
      <image
        :src="`/static/images/lottery/popup-cart-${themeCode}.png`"
        mode="aspectFit"
        class="size-full"
        @click="handleGoShop"
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

const { themeCode, lotteryColor } = useTheme()

const show = defineModel<boolean>({ required: true })

const prizeInfo = computed(() => props.prizeInfo ?? defaultPrizeInfo)

const isPass = computed(() => prizeInfo.value.drawResult === 'pass') // 通过了
const isWon = computed(() => isPass.value && prizeInfo.value.bingo === 1) // 中奖了
const noWon = computed(() => isPass.value && prizeInfo.value.bingo === 0) // 未中奖
const noExchanged = computed(() => prizeInfo.value.isExchanged === 0) // 未兑奖
const isExchanged = computed(() => prizeInfo.value.isExchanged === 1) // 已兑奖
const isExpired = computed(() => prizeInfo.value.isExchanged === 2) // 已过期

// 是否显示购物车图标
const showCart = computed(() => {
  const isRedEnvelope = prizeInfo.value.prizeType === 'small_red_envelope'
    || prizeInfo.value.prizeType === 'large_red_envelope'

  return !(isRedEnvelope && noExchanged.value)
})

// 显示的提示文字
const displayErrorText = computed(() => {
  if (noWon.value) {
    return '这瓶没中奖哦\n再扫一瓶试试'
  }

  return prizeInfo.value.drawResultError || '抽奖失败\n请重新扫码抽奖'
})

// 显示的时间逻辑
const timeLines = computed(() => {
  const p = prizeInfo.value

  const configs = [
    { key: 'scanTime' as const, label: '扫码时间', condition: () => true },
    { key: 'exchangeTime' as const, label: '兑奖时间', condition: () => true },
    { key: 'eventBeginTime' as const, label: '开始时间', condition: () => true },
    { key: 'eventEndTime' as const, label: '结束时间', condition: () => true },
    {
      key: 'exchangeEndTime' as const,
      label: () => isExpired.value ? '过期时间' : '兑奖截止',
      condition: () => !!p.exchangeEndTime,
    },
  ] as const

  return configs
    .map(({ key, label, condition }) => {
      const value = p[key] as string | undefined
      if (value && condition()) {
        const displayLabel = typeof label === 'function' ? label() : label
        return `${displayLabel}：${value}`
      }
      return null
    })
    .filter((line): line is string => line !== null)
})

// 显示的底部说明文字
const displayTipsText = computed(() => {
  const { prizeType, isExchanged } = prizeInfo.value

  const expiredTips = '逾期未兑换将视为自动放弃领奖，不予补发'

  // 逾期未兑奖
  if (isExpired.value) {
    return expiredTips
  }

  // 未中奖 或 已兑换 不显示
  if (noWon.value || isExchanged) return null

  const tipsConfig = {
    small_red_envelope: {
      won: '请于24小时内完成领取，逾期红包失效',
      noExchange: '请于中奖后24小时内完成领取',
    },
    large_red_envelope: {
      won: '请于中奖后30天内填写兑奖信息',
      noExchange: '请于中奖后30天内填写兑奖信息',
    },
    one_yuan_exchange: {
      won: '请于中奖后30天内带上实物瓶盖到兑奖点兑奖',
      noExchange: '需持实物瓶盖兑奖',
    },
  } as const

  if (!prizeType || !(prizeType in tipsConfig)) return null

  const config = tipsConfig[prizeType as keyof typeof tipsConfig]

  // 已中奖但未兑换
  if (isWon.value) {
    return `*${config.won}\n中奖记录可在「我的奖品」中查看`
  }

  // 未兑换状态
  if (noExchanged.value) {
    return `${config.noExchange}${expiredTips}`
  }

  return null
})

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
  const { prizeType, isExchanged } = prizeInfo.value

  if (noWon.value) {
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

const handleClose = () => {
  show.value = false
  emit('close')
}

const handleConfirm = (type: string, id: any) => {
  emit('confirm', type, id)
}

const handleGoShop = () => {
  navigateToMiniApp({
    appId: 'wx6fb110526c12fc40',
    path: 'sub1/pages/ys-Exchange/ys-Exchange',
  })
}
</script>
