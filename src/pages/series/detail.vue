<script setup lang="ts">
import type { LocationResult } from '@/composables/useLocation'
import type { PrizeInfo, SeriesKey } from '@/types'
import { cashWithdraw, executeLottery, getBingoList, getMyPrizeList, scanByHome } from '@/api'
import { useAuthGuard, useLocation } from '@/composables'
import { IMG_BASE_URL, THEMES } from '@/constants'
import { useAuthStore, useProfileStore, useSeriesStore } from '@/store'
import { defaultPrizeInfo } from '@/types'
import { delay, navigateTo, Toast } from '@/utils'

const props = defineProps<{
  seriesCode?: SeriesKey;
}>()

const { withAuth, withAuthApi } = useAuthGuard()
const authStore = useAuthStore()
const seriesStore = useSeriesStore()
const profileStore = useProfileStore()

const { isLogin, isMember, openId, loading: authLoading } = storeToRefs(authStore)
const { themeCode, seriesDetail, beginDate, endDate, endTime } = storeToRefs(seriesStore)
const { userInfo } = storeToRefs(profileStore)

const currentTheme = reactive({
  color: '',
  bgColor: '',
})

// 微信扫码注入二维码
const wxQrCodeRef = inject<Ref<string>>('wxQrCode', ref(''))
const logIdRef = inject<Ref<string>>('logId', ref(''))

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
const scanLogId = ref(logIdRef)
const scanLoading = ref(false)
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
})

// 轮播中奖人数据
const bingoList = ref([])

// 提现成功分享海报
const posterGenerator = ref<any>(null)

// 微信扫码进入活动页
watch(wxQrCodeRef, (newCode) => {
  const code = newCode?.trim()
  if (!code) return

  scanLoading.value = true

  if (openId.value) {
    drawParams.scanCode = code
    showDraw.value = true
    scanLoading.value = false
  }
}, { immediate: true })

// 微信扫码进入系列详情页 设置系列代码
watch(() => props.seriesCode, (newCode) => {
  if (newCode) {
    drawParams.themeCode = newCode
    seriesStore.setThemeCode(newCode)
  }
}, { immediate: true })

// 自动同步主题色（微信扫码进入无主题代码，无法使用useTheme）
watch(themeCode, (newCode) => {
  if (newCode && THEMES[newCode]) {
    currentTheme.color = THEMES[newCode].color
    currentTheme.bgColor = THEMES[newCode].bgColor
  }
}, { immediate: true })

// 监听登录状态变化
watch(isLogin, (newLoginStatus, oldLoginStatus) => {
  if (newLoginStatus && !oldLoginStatus) {
    if (showDraw.value) {
      drawLottery()
    }
    fetchMyPrizeList(true)
    fetchBingoList()
  }
}, { immediate: false })

// 监听我的奖品弹窗变化
watch(showMyPrize, (newShow) => {
  if (newShow && prizeList.value.length === 0) {
    fetchMyPrizeList(true)
  }
})

/**
 * 将 useLocation 返回的位置信息赋值到 drawParams 对象
 * @param target - 目标 reactive 对象（drawParams）
 * @param data - useLocation 返回的定位数据
 */
const assignLocation = (target: typeof drawParams, data: LocationResult) => {
  Object.assign(target, {
    locationLat: data.lat,
    locationLon: data.lng,
    locationProvince: data.province.name,
    locationCity: data.city.name,
    locationDistrict: data.district.name,
    locationAdCode: data.adCode,
    locationAddress: data.street,
    locationFullAddress: data.fullAddress,
    provinceId: data.province.code,
    cityId: data.city.code,
    districtId: data.district.code,
    adCode: data.adCode,
  })
}

onLoad(() => {
  getSeriesDetail()
  fetchMyPrizeList(true)
})

// 获取系列详情信息
const getSeriesDetail = async () => {
  await seriesStore.fetchSeriesDetail()

  fetchBingoList()
}

// 获取中奖人名单
const fetchBingoList = async () => {
  const themeId = seriesDetail.value.id as string
  bingoList.value = await withAuthApi(() => getBingoList(themeId))
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
    const res = await withAuthApi(() => getMyPrizeList(params))
    const { rows = [], total = 0 } = res ?? {}

    if (reset) {
      prizeList.value = rows
    }
    else {
      prizeList.value = [...prizeList.value, ...rows]
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
  console.log('点击扫一扫')
  const { result } = await uni.scanCode()
  drawParams.scanCode = result

  checkScanCode()
}

// 校验扫描码
const checkScanCode = async () => {
  scanLoading.value = true

  try {
    const data = await useLocation(false)
    assignLocation(drawParams, data)

    const params = { ...drawParams, openId: openId.value }
    const { logId } = await scanByHome(params)

    scanLogId.value = logId
    showDraw.value = true
  }
  catch (error: any) {
    drawResultInfo.value = error
    showResult.value = true
  }
  finally {
    scanLoading.value = false
  }
}

// 开奖
const drawLottery = async () => {
  drawLoading.value = true

  try {
    const data = await useLocation()
    assignLocation(drawParams, data)

    const params = { ...drawParams, logId: scanLogId.value }
    const result = await executeLottery(params)

    drawResultInfo.value = result

    if (result.bingo === 1) {
      fetchMyPrizeList(true)
      uni.vibrateLong()

      if (result.prizeType === 'large_red_envelope') {
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
      navigateTo(`/pages-reward/prize/redeem?id=${id}`)
      break
    case 'nearbyStore':
      goExchange('')
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
      if (Number(drawResultInfo.value.bonus) > 0.4) {
        posterGenerator.value?.generateSharePoster()
      }
    },
    fail: ({ result }: any) => {
      if (result !== 'cancel') {
        Toast(result)
      }
    },
  })
}

// 打开我的奖品
const openMyPrize = (e: any) => {
  withAuth(e, () => {
    showMyPrize.value = true
  })
}

// 前往兑奖点
const goExchange = (e: any) => {
  withAuth(e, async () => {
    await useLocation(true, false)
    navigateTo('/pages-reward/shop/index')
  })
}

defineExpose({
  fetchMyPrizeList,
})
</script>

<template>
  <view class="page theme relative overflow-hidden" :style="{ background: currentTheme.bgColor }">
    <!-- 背景图 -->
    <image
      class="absolute w-100vw -mt-165"
      :src="`${IMG_BASE_URL}/lottery/detail-${themeCode}.png`"
      mode="widthFix"
    />

    <view v-if="bingoList?.length !== 0" class="fixed top-134 right-100">
      <LotteryWinner :list="bingoList" />
    </view>

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
          :loading="scanLoading"
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

      <view class="relative flex-center-between w-540 text-30">
        <view class="u-press button w-240 h-70" @click="openMyPrize">
          <u-icon name="gift" :color="currentTheme.color" size="22" />
          我的奖品
        </view>
        <view class="u-press button w-240 h-70" @click="goExchange">
          <u-icon name="map" :color="currentTheme.color" size="22" class="pr-10" />
          兑奖点
        </view>
        <view v-if="!isLogin && !isMember" class="absolute w-full flex-center-between opacity-0 h-70">
          <u-button open-type="getPhoneNumber" @getphonenumber="openMyPrize" />
          <u-button open-type="getPhoneNumber" @getphonenumber="goExchange" />
        </view>
        <view v-if="authLoading" class="absolute w-full h-70" />
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

    <!-- 提现成功分享海报 -->
    <LotteryPoster
      ref="posterGenerator"
      :bg-img="seriesDetail.poster"
      :avatar="userInfo.avatarUrl"
      :nickname="userInfo.nickName"
      :money="drawResultInfo.bonus || ''"
    />
  </view>
</template>

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
