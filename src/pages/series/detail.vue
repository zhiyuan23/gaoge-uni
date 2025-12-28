<template>
  <view v-if="themeCode" class="page theme relative overflow-hidden" :style="{ background: currentTheme.bgColor }">
    <!-- 背景图 -->
    <image
      class="absolute w-100vw -mt-165"
      :src="`/static/images/series/main-${themeCode}.png`"
      mode="widthFix"
    />

    <view class="absolute text-center text-white top-40 right-10 leading-30">
      <view class="flex-center-end w-100" @click="showRule = true">
        <view class="u-press vertical-btn">
          活动规则
        </view>
      </view>
      <view class="h-28" />
      <view class="flex-center-end w-100" @click="showService = true">
        <view class="u-press vertical-btn">
          联系客服
        </view>
      </view>
    </view>

    <!-- 主体区域 -->
    <view class="relative z-9 w-100vw flex-col-center-center font-bold mt-1090 pb-50">
      <view class="h-150">
        <!-- 扫一扫按钮 -->
        <MainButton
          v-if="seriesDetail.status === 'in_progress'"
          label="点击扫一扫"
          icon="scan"
          @click="onScan"
        />

        <!-- 活动为开始/已结束 -->
        <view v-else class="text-center">
          <view class="color-[var(--color)] leading-100 text-46">
            <text v-if="seriesDetail.status === 'not_started'">
              活动未开始，敬请期待
            </text>
            <text v-if="seriesDetail.status === 'end'">
              活动已结束，感谢参与
            </text>
          </view>
          <view class="color-black font-normal leading-22 text-22">
            {{ beginDate }}-{{ endDate }}
          </view>
        </view>
      </view>

      <view class="flex-center-between w-540 text-30">
        <view class="u-press button w-240 h-70" @click="showMyPrize = true">
          <u-icon name="gift" :color="currentTheme.color" size="22" />
          我的奖品
        </view>
        <view class="u-press button w-240 h-70" @click="goExchange">
          <u-icon name="map" :color="currentTheme.color" size="22" class="pr-10" />
          兑奖点
        </view>
      </view>
    </view>

    <!-- 活动规则 -->
    <LotteryRule
      v-model="showRule"
      :rule-info="seriesDetail.ruleDescription"
      :end-date="endTime"
    />

    <!-- 客服电话 -->
    <LotteryService v-model="showService" />

    <!-- 我的奖品 -->
    <LotteryMyPrize
      v-model="showMyPrize"
      :data="prizeList"
      :loading="prizeLoading"
      :has-more="prizeHasMore"
      @loadmore="handleLoadMore"
      @action="handlePrizeAction"
    />

    <!-- 开奖弹窗 -->
    <LotteryDraw
      v-model="showDraw"
      :loading="drawLoading"
      loading-text="开奖中..."
      @confirm="drawLottery"
    />

    <!-- 扫码结果弹窗 -->
    <LotteryResult
      v-model="showResult"
      :prize-info="drawResultInfo"
      @confirm="handlePrizeAction"
    />
  </view>
</template>

<script setup lang='ts'>
import type { LocationResult } from '@/composables/useLocation'
import { cashWithdraw, executeLottery, getMyPrizeList, scanByDetail, scanByHome } from '@/api/lottery'
import { useLocation } from '@/composables'
import { THEMES } from '@/constants'
import useAuthStore from '@/store/auth'
import useSeriesStore from '@/store/series'
import { defaultPrizeInfo, type PrizeInfo } from '@/types'
import { delay, navigateTo, Toast } from '@/utils'

const authStore = useAuthStore()
const seriesStore = useSeriesStore()

const { isLogin, openId } = storeToRefs(authStore)
const { themeCode, seriesDetail, beginDate, endDate, endTime } = storeToRefs(seriesStore)

const currentTheme = reactive({
  color: '',
  bgColor: '',
})

// 弹窗控制
const showRule = ref(false)
const showService = ref(false)
const showMyPrize = ref(false)
const showDraw = ref(false)
const showResult = ref(false)

// 我的奖品分页数据
const prizeList = ref<any[]>([])
const prizeLoading = ref(false)
const prizeHasMore = ref(true)
const prizePage = ref(1)
const pageSize = 10

// 扫码 & 开奖核心数据
const drawLoading = ref(false)
const drawResultInfo = ref<PrizeInfo>(defaultPrizeInfo)
const drawParams = reactive({
  scanCode: '',
  locationLon: '',
  locationLat: '',
  locationProvince: '',
  locationCity: '',
  locationDistrict: '',
  locationStreet: '',
  locationAddress: '',
  locationFullAddress: '',
  locationAdCode: '',
  provinceId: '',
  cityId: '',
  districtId: '',
  adCode: '',
  themeCode: themeCode.value,
}) as any

// 微信扫码注入二维码
const wxQrCodeRef = inject<Ref<string>>('wxQrCode', ref(''))

// 微信扫码自动触发
watchEffect(() => {
  const code = wxQrCodeRef?.value?.trim()
  if (code && openId.value) {
    drawParams.scanCode = code
    checkCode('weixin')
  }
})

// 打开“我的奖品”弹窗时自动加载
watch(showMyPrize, (newShow) => {
  if (newShow) {
    fetchMyPrizeList(true)
  }
})

// 自动同步主题色（微信扫码进入无主题代码，无法使用useTheme）
watch(themeCode, (newCode) => {
  if (newCode && THEMES[newCode]) {
    currentTheme.color = THEMES[newCode].color
    currentTheme.bgColor = THEMES[newCode].bgColor
  }
}, { immediate: true })

// 未登录状态，登录后自动开奖
watch(isLogin, (newLoginStatus, oldLoginStatus) => {
  if (newLoginStatus && !oldLoginStatus && showDraw.value) {
    drawLottery()
  }
}, { immediate: false })

/**
 * 将 useLocation 返回的位置信息赋值到 drawParams 对象
 * @param target - 目标 reactive 对象（drawParams）
 * @param data - useLocation 返回的定位数据
 */
const assignLocation = (target: typeof drawParams, data: LocationResult) => {
  Object.assign(target, {
    locationLat: data.lat || '',
    locationLon: data.lng || '',
    locationProvince: data.province?.name || '',
    locationCity: data.city?.name || '',
    locationDistrict: data.district?.name || '',
    locationAdCode: data.adCode || '',
    locationAddress: data.street || '',
    locationFullAddress: data.fullAddress || '',
    provinceId: data.province?.code || '',
    cityId: data.city?.code || '',
    districtId: data.district?.code || '',
    adCode: data.adCode || '',
  })
}

onLoad(() => {
  getSeriesDetail()
})

// 获取系列详情信息
const getSeriesDetail = () => {
  seriesStore.fetchSeriesDetail()
}

// 获取我的奖品列表
const fetchMyPrizeList = async (reset = false) => {
  if (prizeLoading.value) return

  if (reset) {
    prizePage.value = 1
    prizeList.value = []
    prizeHasMore.value = true
  }

  prizeLoading.value = true

  try {
    const params = {
      page: prizePage.value,
      pageSize,
      themeCode: themeCode.value,
    }
    const { rows, total } = await getMyPrizeList(params)

    if (reset) {
      prizeList.value = rows || []
    }
    else {
      prizeList.value.push(...(rows || []))
    }

    prizeHasMore.value = prizeList.value.length < total

    if (rows.length > 0) {
      prizePage.value += 1
    }
  }
  finally {
    prizeLoading.value = false
  }
}

// 加载更多奖品
const handleLoadMore = () => {
  fetchMyPrizeList()
}

// 点击扫一扫
const onScan = async () => {
  const { result } = await uni.scanCode()
  drawParams.scanCode = result

  checkCode('mini')
}

// 校验扫描码
const checkCode = async (type: 'weixin' | 'mini') => {
  const data = await useLocation(false)
  assignLocation(drawParams, data)

  const fn = type === 'weixin' ? scanByDetail : scanByHome
  const params = { ...drawParams, openId: openId.value }
  const { themeCode } = await fn(params)

  if (type === 'weixin') {
    seriesStore.setThemeCode(themeCode)

    getSeriesDetail()
  }

  showDraw.value = true
}

// 开奖
const drawLottery = async () => {
  drawLoading.value = true

  try {
    const data = await useLocation()
    assignLocation(drawParams, data)

    const params = { ...drawParams, logId: 0 }

    drawResultInfo.value = await executeLottery(params)

    if (drawResultInfo.value.bingo === 1) {
      uni.vibrateLong()

      if (drawResultInfo.value.prizeType === 'large_red_envelope') {
        setTimeout(() => uni.vibrateLong(), 400)
      }
    }

    showDraw.value = false
    showResult.value = true
  }
  finally {
    await delay(200)
    drawLoading.value = false
  }
}

// 奖品操作统一处理
const handlePrizeAction = (type: string, id: string) => {
  showResult.value = false

  switch (type) {
    case 'fillInfo':
      navigateTo(`/pages/prize/redeem-info?id=${id}`)
      break
    case 'nearbyStore':
      goExchange()
      break
    case 'withdraw':
      handleWithdraw(id)
      break
    case 'scan':
      onScan()
      break
  }
}

// 立即领取
const handleWithdraw = async (id: string) => {
  const data = await cashWithdraw(id)

  uni.requestMerchantTransfer({
    mchId: data.mchId,
    package: data.packageInfo,
    appId: data.appId,
    success: () => {
      fetchMyPrizeList(true)
    },
    fail: ({ result }: any) => {
      if (result !== 'cancel') {
        Toast(result)
      }
    },
  })
}

// 前往兑奖点地图
const goExchange = () => {
  navigateTo('/pages/shop/index')
}

defineExpose({
  fetchMyPrizeList,
})
</script>

<style scoped>
.theme {
  --color: v-bind(currentTheme.color);
}

:deep(uni-page-wrapper) {
  overflow: hidden;
}

.button {
  @apply color-[var(--color)] border-5-solid-[var(--color)];
}

.vertical-btn {
  @apply flex-center rounded-3 bg-[var(--color)] w-48 h-146;
}
</style>
