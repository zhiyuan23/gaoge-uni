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

    <!-- 活动规则 -->
    <LotteryRule v-model="showRule" />

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
      :prize-info="lotteryInfo"
      @confirm="handlePrizeAction"
    />
  </view>
</template>

<script setup lang='ts'>
import { executeLottery, scanByDetail, scanByHome } from '@/api/lottery'
import { getMyPrizeList } from '@/api/user/prize'
import { useAuth, useLocation, useTheme } from '@/composables'
import { defaultPrizeInfo, type PrizeInfo } from '@/types'
import { Dialog, navigateTo } from '@/utils'

const { seriesCode, color } = useTheme()
const { openId } = useAuth()

// 弹窗控制
const showRule = ref(false)
const showService = ref(false)
const showMyPrize = ref(false)
const showDraw = ref(false)
const showResult = ref(false)

// 扫码 & 开奖核心数据
const scanType = ref<'weixin' | 'mini'>('mini')
const locationInfo = reactive({ lat: '', lng: '' })
const qrCode = ref('')
const lotteryInfo = ref<PrizeInfo>(defaultPrizeInfo)
const drawLoading = ref(false)

// 我的奖品分页数据
const prizeList = ref<any[]>([])
const prizeLoading = ref(false)
const prizeHasMore = ref(true)
const prizePage = ref(1)
const pageSize = 10

// 微信注入二维码（特殊注入）
const wxQrCodeRef = inject<Ref<string>>('wxQrCode', ref(''))

// 微信扫码自动触发
watchEffect(() => {
  const code = wxQrCodeRef?.value?.trim()
  if (code) {
    scanType.value = 'weixin'
    qrCode.value = code
    showDraw.value = true
  }
  else {
    scanType.value = 'mini'
  }
})

// 打开“我的奖品”弹窗时自动加载
watch(showMyPrize, (val) => {
  if (val && prizeList.value.length === 0) {
    fetchMyPrizeList(true)
  }
})

// API-扫码验证
const fetchScan = async (data: any, type: 'weixin' | 'mini') => {
  if (type === 'weixin') {
    await scanByHome(data)
  }
  else {
    await scanByDetail(data)
  }
}

// API-开奖
const fetchLottery = async (data: any) => {
  const res = await executeLottery(data)
  lotteryInfo.value = res
}

// API-我的奖品列表
const fetchMyPrizeList = async (reset = false) => {
  if (prizeLoading.value) return

  if (reset) {
    prizePage.value = 1
    prizeList.value = []
    prizeHasMore.value = true
  }

  prizeLoading.value = true

  try {
    const res = await getMyPrizeList({
      page: prizePage.value,
      pageSize,
      seriesCode: seriesCode.value,
    })

    if (reset) {
      prizeList.value = res.list || []
    }
    else {
      prizeList.value.push(...(res.list || []))
    }

    prizeHasMore.value = (res.list?.length || 0) === pageSize
    prizePage.value++
  }
  finally {
    prizeLoading.value = false
  }
}

// 加载更多奖品
const handleLoadMore = () => {
  fetchMyPrizeList()
}

// 扫一扫
const scanCode = async () => {
  const { result } = await uni.scanCode()
  qrCode.value = result

  const locRes: any = await useLocation(false)
  const params = {
    scanCode: result,
    locationLon: locRes.lng,
    locationLat: locRes.lat,
    locationProvince: '辽宁省',
    locationCity: '沈阳市',
    locationDistrict: '浑南区',
    locationStreet: '高歌路',
    locationAddress: '',
    locationFullAddress: '',
    locationAdCode: '',
    provinceId: 0,
    cityId: 0,
    districtId: 210112,
    adCode: 0,
    themeCode: seriesCode.value,
    openId: openId.value,
  }

  await fetchScan(params, scanType.value)

  showDraw.value = true
}

// 开奖
const drawLottery = async () => {
  drawLoading.value = true

  const locRes: any = await useLocation()
  locationInfo.lat = locRes.lat
  locationInfo.lng = locRes.lng

  const params = {
    scanCode: qrCode.value,
    locationLon: locRes.lng,
    locationLat: locRes.lat,
    locationProvince: '辽宁省',
    locationCity: '沈阳市',
    locationDistrict: '浑南区',
    locationStreet: '高歌路',
    locationAddress: '',
    locationFullAddress: '',
    locationAdCode: '',
    provinceId: 0,
    cityId: 0,
    districtId: 210112,
    adCode: 0,
    themeCode: seriesCode.value,
    logId: 0,
  }
  await fetchLottery(params)

  showDraw.value = false
  showResult.value = true
  drawLoading.value = false
}

// 奖品操作统一处理
const handlePrizeAction = (type: string, item?: any) => {
  showResult.value = false

  switch (type) {
    case 'fillInfo':
      navigateTo(`/pages/user/prize/redeem-info?id=${item.id}`)
      break
    case 'nearbyStore':
      goExchange()
      break
    case 'receive':
      Dialog('立即领取')
      break
    case 'scan':
      scanCode()
      break
  }
}

// 前往兑奖点地图
const goExchange = () => {
  navigateTo('/pages/shop/index')
}

onLoad(() => {
  // 进入页面预加载我的奖品
  // fetchMyPrizeList(true)
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
