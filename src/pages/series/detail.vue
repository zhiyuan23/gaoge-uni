<template>
  <view
    class="page relative overflow-hidden"
    :style="{ background: currentTheme.bgColor }"
  >
    <!-- 背景图  -->
    <image
      class="absolute w-100vw"
      mode="widthFix"
      :src="seriesLocalImgs[themeCode] ?? seriesDetail.backgroundImg"
    />

    <view v-if="bingoList?.length !== 0" class="fixed top-120 right-100">
      <LotteryWinner :list="bingoList" />
    </view>

    <view
      class="absolute text-center top-40 right-0 leading-30"
      :style="{ color: currentTheme.ui.mainBtn.fontColor }"
    >
      <MainButton
        class="px-20"
        type="side"
        label="活动规则"
        v-bind="currentTheme.ui.sideBtn"
        @click="showRule = true"
      />
      <view class="h-25" />
      <MainButton
        class="px-20"
        type="side"
        label="联系客服"
        v-bind="currentTheme.ui.sideBtn"
        @click="showService = true"
      />
    </view>

    <!-- 主体区域 -->
    <view
      class="relative z-9 w-100vw flex-col-center-center font-bold mt-1100 pb-50"
      :style="{ color: currentTheme.ui.mainBtn.fontColor }"
    >
      <view class="h-144">
        <!-- 扫一扫按钮 -->
        <MainButton
          v-if="seriesDetail.status === 'in_progress'"
          label="点击扫一扫"
          v-bind="currentTheme.ui.mainBtn"
          :loading="scanLoading"
          :icon-url="`${IMG_BASE_URL}/icons/ic-btn-scan-${themeCode}.png`"
          @click="onScan"
        />

        <!-- 活动为开始/已结束 -->
        <view v-else class="text-center">
          <view class="text-bold leading-100 text-46" :style="{ color: currentTheme.textColor }">
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
        <MainButton
          type="sub"
          label="我的奖品"
          v-bind="currentTheme.ui.subBtn"
          :icon-url="`${IMG_BASE_URL}/icons/ic-btn-prize-${themeCode}.png`"
          @click="openMyPrize"
        />
        <MainButton
          type="sub"
          label="兑奖点"
          v-bind="currentTheme.ui.subBtn"
          :icon-url="`${IMG_BASE_URL}/icons/ic-btn-location-${themeCode}.png`"
          @click="goExchange"
        />
      </view>
      <view class="tips mt-20 text-14" :class="`tips-${themeCode}`">
        参与活动有机会赢随机红包或加1元换购同产品
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

    <!-- 隐私协议弹窗组件 -->
    <PrivacyPopup
      v-model="showPrivacy"
      :need-auth="true"
      @authorized="authorized"
    />

    <!-- 我的奖品 -->
    <LotteryMyPrize
      v-model="showMyPrize"
      :data="prizeList"
      :loading="prizeLoading"
      :has-more="prizeHasMore"
      @loadmore="handleLoadMore"
      @action="handlePrizeAction"
    />

    <t-overlay background-color="rgba(0, 0, 0, 0.8)" :visible="showOverlay">
      <!-- 开奖弹窗 -->
      <LotteryDraw
        ref="drawLotteryRef"
        v-model="showDraw"
        :loading="drawLoading"
        @confirm="drawLottery"
        @finished="finishedDraw"
      />

      <!-- 扫码结果弹窗 -->
      <LotteryResult
        v-model="showResult"
        :prize-info="drawResultInfo"
        @confirm="handlePrizeAction"
      />
    </t-overlay>

    <!-- 提现成功分享海报 -->
    <LotteryPoster
      ref="posterGenerator"
      :theme-code="themeCode"
      :bg-img="seriesDetail.poster"
      :avatar="userInfo.avatarUrl"
      :nickname="userInfo.nickName"
      :phone="userInfo.mobilePhone"
      :money="drawResultInfo.bonus || ''"
    />
  </view>
</template>

<script setup lang="ts">
import type { LocationResult } from '@/composables/useLocation'
import type { PrizeInfo, SeriesKey } from '@/types'
import { cashWithdraw, cashWithdrawSuccess, executeLottery, getBingoList, getMyPrizeList, scanByHome } from '@/api'
import { useAuthGuard, useLocation } from '@/composables'
import { IMG_BASE_URL, THEMES } from '@/constants'
import { useAuthStore, useProfileStore, useSeriesStore } from '@/store'
import { defaultPrizeInfo } from '@/types'
import { assignLocation, eventBus, navigateTo, Toast } from '@/utils'

const props = defineProps<{
  seriesCode?: SeriesKey;
}>()

const { withAuth, withAuthApi } = useAuthGuard()
const authStore = useAuthStore()
const seriesStore = useSeriesStore()
const profileStore = useProfileStore()

const { isLogin, openId } = storeToRefs(authStore)
const { themeCode, seriesDetail, seriesLocalImgs, beginDate, endDate, endTime } = storeToRefs(seriesStore)
const { userInfo } = storeToRefs(profileStore)

// 奖金阈值-达到后生成分享海报
const BONUS_THRESHOLD = import.meta.env.PROD ? 40 : 0.4

// 当前主题配色
const currentTheme = reactive({
  color: '',
  bgColor: '',
  textColor: '',
  ui: {} as any,
})

// 微信扫码注入二维码
const wxQrCodeRef = inject<Ref<string>>('wxQrCode', ref(''))
const logIdRef = inject<Ref<string>>('logId', ref(''))

// 弹窗控制
const drawLotteryRef = ref()
const showPrivacy = ref(false)
const showRule = ref(false)
const showService = ref(false)
const showMyPrize = ref(false)
const showDraw = ref(false)
const showResult = ref(false)
const isAnimFinished = ref(false)
const isApiFinished = ref(false)

// 操作信息
const pendingAction = ref('')

// 我的奖品分页数据
const prizeList = ref<any[]>([])
const prizeLoading = ref(false)
const prizeHasMore = ref(true)
const prizePage = ref(1)
const pageSize = 20

// 扫码 & 开奖核心数据
const getInitialDrawParams = () => ({
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
const scanLogId = ref(logIdRef)
const scanLoading = ref(false)
const drawLoading = ref(false)
const drawResultInfo = ref<PrizeInfo>(defaultPrizeInfo)
const drawParams = reactive(getInitialDrawParams())
const showOverlay = computed(() => showDraw.value || showResult.value)

const checkAndShowResult = () => {
  if (isAnimFinished.value && isApiFinished.value) {
    showResult.value = true
  }
}

// 重置抽奖状态
const resetDrawParams = () => {
  Object.assign(drawParams, getInitialDrawParams())
  isAnimFinished.value = false
  isApiFinished.value = false
}

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
    currentTheme.textColor = THEMES[newCode].textColor
    currentTheme.ui = THEMES[newCode].ui
  }
}, { immediate: true })

// 监听登录状态变化
watch(isLogin, (newLoginStatus, oldLoginStatus) => {
  if (newLoginStatus && !oldLoginStatus) {
    if (showDraw.value) {
      drawLottery()
    }
    fetchBingoList()
    fetchMyPrizeList(true)
  }
}, { immediate: false })

onLoad(() => {
  getSeriesDetail()
  fetchMyPrizeList(true)
})

// 获取系列详情信息
const getSeriesDetail = async () => {
  await seriesStore.fetchSeriesDetail()

  fetchBingoList()
}

// 点击扫一扫
const onScan = async () => {
  if (!openId.value) {
    await authStore.initUserAuth()
  }

  resetDrawParams()

  const { result } = await uni.scanCode()
  drawParams.scanCode = result

  checkScanCode()
}

// 扫码逻辑（校验扫描码）
const checkScanCode = async () => {
  scanLoading.value = true

  try {
    const data = await useLocation({ onlyIfAuthorized: true })
    if (data.province.name) {
      profileStore.addressInfo.province = data.province.name
    }
    assignLocation(drawParams, data)
    const params = { ...drawParams, openId: openId.value }
    const { logId } = await scanByHome(params)

    scanLogId.value = logId
    showDraw.value = true
  }
  catch (error: any) {
    if (error.code === 'toast') {
      Toast(error.msg)
      return
    }

    drawResultInfo.value = error
    showResult.value = true
  }
  finally {
    scanLoading.value = false
  }
}

// 开奖逻辑（执行抽奖）
const drawLottery = async () => {
  drawLoading.value = true

  let locationData: LocationResult | null = null
  // 获取位置信息
  try {
    locationData = await useLocation()
    profileStore.addressInfo.province = locationData.province.name
  }
  catch (error: any) {
    Toast(error.message)
    drawLoading.value = false
    return
  }

  // 开始抽奖
  try {
    drawLotteryRef.value?.playDrawAnim() // 播放开奖动画

    assignLocation(drawParams, locationData)

    const params = { ...drawParams, scanLogId: scanLogId.value }
    const result = await executeLottery(params)

    drawResultInfo.value = result
    drawResultInfo.value.scanCode = drawParams.scanCode

    if (result.bingo === 1) {
      uni.vibrateLong()
      if (result.prizeType === 'large_red_envelope') {
        setTimeout(() => uni.vibrateLong(), 400)
      }
    }
    fetchMyPrizeList(true)
  }
  catch (error: any) {
    drawResultInfo.value = error
  }
  finally {
    drawLoading.value = false
    isApiFinished.value = true
    checkAndShowResult()
  }
}

// 开奖动画完成完成
const finishedDraw = () => {
  isAnimFinished.value = true
  checkAndShowResult()
}

// 奖品操作统一处理
const handlePrizeAction = (type: string, id: string) => {
  showResult.value = false

  switch (type) {
    case 'fillInfo':
      navigateTo(`/pages/reward/prize/redeem?id=${id}`)
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
    success: async () => {
      if (Number(drawResultInfo.value.bonus) > BONUS_THRESHOLD) {
        posterGenerator.value?.generateSharePoster()
      }
      await cashWithdrawSuccess(data.id)
      fetchMyPrizeList(true)
    },
    fail: ({ result }: any) => {
      if (result === 'cancel' || result === 'fail') {
        return
      }
      Toast(result)
    },
  })
}

// 打开我的奖品
const openMyPrize = async () => {
  const result = await withAuth(() => {
    showMyPrize.value = true
  })

  if (result.reason === 'not_login') {
    pendingAction.value = 'openMyPrize'
    showPrivacy.value = true
  }
}

// 前往兑奖点
const goExchange = async () => {
  const result = await withAuth(async () => {
    await useLocation({ withReverse: false })
    navigateTo('/pages/reward/shop/index')
  })

  if (result.reason === 'not_login') {
    pendingAction.value = 'goExchange'
    showPrivacy.value = true
  }
}

// 手机号授权登录成功操作
const authorized = () => {
  const action = pendingAction.value
  if (action === 'openMyPrize') {
    openMyPrize()
  }
  if (action === 'goExchange') {
    goExchange()
  }
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

// 跳转到填写信息页，提交信息成功后更新我的奖品列表
onMounted(() => {
  eventBus.on('refreshPrizeList', fetchMyPrizeList)
})

onUnmounted(() => {
  eventBus.off('refreshPrizeList', fetchMyPrizeList)
})
</script>

<style>
.tips-ml { color: rgb(0 0 0 / 30%); }
.tips-zbqr { color: #EBD670; }
.tips-zwcs { color: #BDCD5E; }
</style>
