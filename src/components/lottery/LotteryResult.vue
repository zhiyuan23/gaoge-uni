<template>
  <u-popup
    :show="show"
    mode="center"
    bg-color="transparent"
    overlay-opacity="0.0"
    :safe-area-inset-bottom="false"
    :close-on-click-overlay="false"
  >
    <view class="flex-col-center text-26 -mt-240">
      <view
        class="anim-others-in relative z-3 w-full"
        :class="[...ui.luckClose]"
      >
        <!-- 关闭按钮 -->
        <image
          :src="`/static/images/icons/ic-close-${themeCode}.png`"
          class="float-right size-60 p-66"
          @click="handleClose"
        />
      </view>

      <!-- pass -->
      <view class="relative z-2 flex-col-center overflow-hidden">
        <view v-if="isPass" class="flex-col-center">
          <!-- 标题图片 -->
          <image
            v-if="ui.luckTitle"
            :src="`${IMG_BASE_URL}/lottery/luck-tit-${isWon ? 'win' : 'lose'}-${themeCode}.png`"
            mode="aspectFit"
            class="relative -mt-100"
            :class="[
              ...ui.luckTitle,
              isZWCS ? 'anim-title-in' : 'anim-others-in',
            ]"
          />
          <!-- 奖品图片 -->
          <image
            :src="prizeImage"
            mode="aspectFit"
            class="relative size-750"
            :class="[
              ui.luckTitle ? '' : '-mt-100',
              isML ? 'anim-prize-scale' : 'anim-prize-fade',
            ]"
          />
        </view>

        <!-- no_pass -->
        <view
          v-else
          class="relative flex-start-center w-700 h-600"
          :class="isML ? 'anim-prize-scale' : 'anim-prize-fade'"
        >
          <view class="absolute size-full top-0">
            <image :src="`${IMG_BASE_URL}/lottery/win-popup-${themeCode}.png`" class="size-full" />
          </view>
          <view class="relative z-1 size-full flex-col-center-center" :class="{ 'pt-20': timeLines.length }">
            <!-- 提示信息 -->
            <view
              class="text-bold flex-col-center-center font-bold mx-40 h-120 text-44"
              :class="isML ? 'leading-80' : 'leading-90' "
              :style="{ color: textColor }"
            >
              <text class="text-center" :class="isML ? (timeLines.length ? 'pl-45' : 'px-90') : 'px-40'">
                {{ displayErrorText }}
              </text>
              <view v-if="isExchanged">
                已兑奖
              </view>
              <view v-if="noExchanged">
                尚未兑奖
              </view>
            </view>

            <!-- 时间信息 -->
            <view
              v-if="timeLines.length"
              class="color-#4C4C4C h-72"
              :class="isML ? 'leading-40 mt-34' : 'leading-48 mt-44' "
            >
              <view :class="{ '-ml-10': isML }">
                {{ timeLines[0] }}
              </view>
              <view :class="{ '-ml-30': isML }">
                {{ timeLines[1] }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="anim-others-in w-full text-center">
        <!-- 操作按钮 -->
        <view class="h-103" :class="isPass ? '' : [...ui.luckFooter]">
          <MainButton
            v-if="buttonConfig"
            type="luck"
            v-bind="ui.luckBtn"
            :label="buttonConfig?.label"
            :icon-url="`${IMG_BASE_URL}/icons/ic-${buttonConfig?.icon}-${themeCode}.png`"
            @click="handleConfirm(buttonConfig?.type, prizeInfo?.giftCouponId)"
          />
        </view>

        <!-- 提示信息 -->
        <view class="mx-110 mt-50 leading-50" :style="{ color: tipsColor }">
          <view v-if="isStoreUser" class="flex-center-center gap-10" @click="handleGoStore">
            我是商户我要兑奖
            <u-icon name="arrow-right-double" :color="tipsColor" size="16" />
          </view>
          <text v-else>
            {{ displayTipsText }}
          </text>
        </view>
      </view>
    </view>

    <!-- 购物车图标 -->
    <view
      v-if="showCart"
      class="anim-others-in fixed top-50% mt-500 w-95 right-15"
    >
      <image :src="`${IMG_BASE_URL}/lottery/win-cart-${themeCode}.png`" mode="widthFix" class="w-full" @click="handleGoShop" />
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import type { PrizeInfo } from '@/types'
import { useTheme } from '@/composables'
import { IMG_BASE_URL, THIRD_PARTY_APPS } from '@/constants'
import { useSeriesStore } from '@/store'
import { formatTime, navigateToMiniApp } from '@/utils'

const props = defineProps<{
  prizeInfo: PrizeInfo;
  useAnimation?: boolean;
}>()

const emit = defineEmits<{
  close: [];
  confirm: [string, any];
}>()

const show = defineModel<boolean>({ required: true })
const seriesStore = useSeriesStore()
const { seriesDetail } = storeToRefs(seriesStore)
const { themeCode, textColor, tipsColor, ui } = useTheme()
const { MALL, STORE } = THIRD_PARTY_APPS

const isML = computed(() => themeCode.value === 'ml')
const isZWCS = computed(() => themeCode.value === 'zwcs')

const prizeInfo = computed(() => props.prizeInfo) // 奖品信息
const prizeImage = computed(() => prizeInfo.value.prizeImage || seriesDetail.value.thanksImg) // 奖品图片

const isPass = computed(() => prizeInfo.value.drawResult === 'pass') // 通过了
const isWon = computed(() => isPass.value && prizeInfo.value.bingo === 1) // 中奖了
const noWon = computed(() => isPass.value && prizeInfo.value.bingo === 0) // 未中奖
const noExchanged = computed(() => prizeInfo.value.isExchanged === 0) // 未兑奖
const isExchanged = computed(() => prizeInfo.value.isExchanged === 1) // 已兑奖
const isExpired = computed(() => prizeInfo.value.isExchanged === 2) // 已过期
const isStoreUser = computed(() => prizeInfo.value.isStoreUser === 1) // 是否为商户用户

// 是否显示购物车图标 - 扫码通过 且 非红包类型
const showCart = computed(() => {
  const { prizeType, msg } = prizeInfo.value
  const isRedEnvelope = prizeType === 'small_red_envelope' || prizeType === 'large_red_envelope'

  // 未通过扫码校验 隐藏
  if (msg) return false

  // 红包类型 且 （已中奖或未兑奖） 隐藏
  if (isRedEnvelope && (isWon.value || noExchanged.value)) return false

  // 其他情况显示
  return true
})

// 显示的提示文字
const displayErrorText = computed(() => {
  return prizeInfo.value.drawResultError || prizeInfo.value.msg || '本次抽奖未成功\n重新扫码再试一次吧'
})

// 显示的时间逻辑
const timeLines = computed(() => {
  const p = prizeInfo.value
  const targetFormat = 'YYYY年MM月DD日 HH:mm:ss'

  const configs = [
    { key: 'scanTime', label: '扫码时间' },
    { key: 'exchangeTime', label: '兑奖时间' },
    { key: 'eventBeginTime', label: '开始时间' },
    { key: 'eventEndTime', label: '结束时间' },
    {
      key: 'exchangeEndTime',
      label: () => isExpired.value ? '过期时间' : '兑奖截止',
    },
  ] as const

  return configs
    .map(({ key, label }) => {
      const rawValue = p[key as keyof PrizeInfo]

      if (rawValue) {
        const formatted = formatTime(rawValue, { format: targetFormat })
        const displayLabel = typeof label === 'function' ? label() : label
        return `${displayLabel}：${formatted}`
      }
      return null
    })
    .filter((line): line is string => line !== null)
})

// 显示的底部说明文字
const displayTipsText = computed(() => {
  const { prizeType, memExchangeTimeLimit, memExchangeTimeUnit, exchangeEndTime } = prizeInfo.value

  const unitText = memExchangeTimeUnit === 'day' ? '天' : '小时'
  const deadline = memExchangeTimeLimit + unitText
  const exchangeEndDate = exchangeEndTime.substring(0, 11)
  const expiredTips = '逾期未兑换将视为自动放弃领奖，不予补发'

  // 逾期未兑奖
  if (isExpired.value) {
    return expiredTips
  }

  // 未中奖 或 已兑换 不显示
  if (noWon.value || isExchanged.value) return null

  const tipsConfig = {
    small_red_envelope: {
      won: `请于${deadline}内完成领取，逾期红包失效`,
      noExchange: `请于中奖后${deadline}内完成领取`,
    },
    large_red_envelope: {
      won: `请于${exchangeEndDate}前填写兑奖信息`,
      noExchange: `请于${exchangeEndDate}前填写兑奖信息`,
    },
    one_yuan_exchange: {
      won: `请于中奖后${deadline}内带上实物瓶盖到兑奖点兑奖`,
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
    return `${config.noExchange}，${expiredTips}`
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
    type: 'withdraw',
    icon: 'coin' as const,
  },
} as const

// 按钮配置
const buttonConfig = computed(() => {
  const { prizeType, isContinueScanCode, msg } = prizeInfo.value

  if (noWon.value || isContinueScanCode || msg?.includes('再扫一瓶')) {
    return {
      label: '再扫一瓶',
      type: 'scan',
      icon: 'scan',
    }
  }

  if ((isWon.value || noExchanged.value) && prizeType) {
    return prizeTypeButtonMap[prizeType as keyof typeof prizeTypeButtonMap]
  }

  return null
})

// 关闭操作
const handleClose = () => {
  show.value = false
  emit('close')
}

// 确认操作
const handleConfirm = (type: string, id: any) => {
  emit('confirm', type, id)
}

// 跳转至商城小程序
const handleGoShop = () => {
  navigateToMiniApp(MALL)
}

// 跳转至门店小程序核销
const handleGoStore = () => {
  const targetPath = `pages/home/index?scan=${prizeInfo.value.scanCode}`

  navigateToMiniApp({
    appId: STORE.appId,
    path: targetPath,
  })
}
</script>

<style lang="scss" scoped>
.anim-prize-fade {
  opacity: 0;
  animation: prizeFade .8s ease-out forwards;
}

@keyframes prizeFade {
  0% { opacity: 0; }
  // 25% { opacity: 0.2; }
  // 50% { opacity: 0.5; }
  // 75% { opacity: 0.8; }
  100% { opacity: 1; }
}

.anim-prize-scale {
  transform: scale(0);
  animation: prizeScale 0.8s ease-out forwards;
}

@keyframes prizeScale {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

.anim-title-in {
  opacity: 0;
  animation: titleFade .4s linear forwards;
}

@keyframes titleFade {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.anim-others-in {
  opacity: 0;
  animation: othersFade .4s linear .4s forwards;
}

@keyframes othersFade {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
