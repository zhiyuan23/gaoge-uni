<template>
  <view class="fixed z-9 w-100vw flex-center-center bg-white h-104 border-b-1-solid-#e6e6e6 border-t-1-solid-#e6e6e6">
    <SearchBar
      v-model="searchText"
      :city-name="selectedRegion?.city?.name || '请选择'"
      :default-area="[
        selectedRegion?.province?.code,
        selectedRegion?.city?.code,
      ]"
      placeholder="输入兑奖点名称或地址搜索"
      @search="onSearch"
      @region-confirm="onRegionConfirm"
    />
  </view>

  <view class="fixed flex flex-col overflow-hidden inset-0">
    <!-- 地图区域（可拖拽调整高度） -->
    <view
      class="relative flex-shrink-0 transition-all duration-300"
      :style="{ height: `${mapHeight}px` }"
    >
      <map
        class="h-full w-full"
        :latitude="center.lat"
        :longitude="center.lng"
        :scale="15"
        :markers="markers"
        show-location
        @markertap="onMarkerTap"
      />

      <!-- 回到当前位置按钮 -->
      <view
        class="absolute z-20 size-48 flex-center rounded-full bg-white shadow-lg right-16 bottom-80"
        @click.stop="reLocate"
      >
        <u-icon name="map" size="32" color="#07c160" />
      </view>
    </view>

    <!-- 拖拽把手 -->
    <PopupHeader
      title="为您找到附近最近的兑奖点"
      @touchstart.stop="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend.stop="onTouchEnd"
    />

    <!-- 门店列表 -->
    <scroll-view
      scroll-y
      class="flex-1 bg-white"
      :style="{ height: `calc(100vh - ${mapHeight}px - 48px)` }"
      @scrolltolower="onReachBottom"
    >
      <view class="bg-white pb-50">
        <view
          v-for="store in shopList"
          :key="store.id"
          class="flex-center bg-white mx-25 h-184 border-b-1-solid-#e0e0e0 last:border-b-0"
          :class="{ 'bg-#07c160': currentStoreId === store.id }"
          @click="selectStore(store)"
        >
          <!-- 门店图片 -->
          <image
            :src="store.cover || `/pages-reward/static/images/shop/img-store-${themeCode}.png`"
            class="size-144 flex-shrink-0 mr-16 -ml-5"
          />
          <view class="flex-1">
            <!-- 门店信息 -->
            <view class="flex-center">
              <view class="font-bold mt-4">
                {{ store.name }}
              </view>
              <view
                class="u-press flex-center-center flex-shrink-0 rounded-20 ml-10 w-130 h-40 text-20 border-2-solid-#FFF"
                :style="{ color: shopBtnColor, borderColor: shopBtnColor }"
                @click="goFeedback(store.id)"
              >
                我要反馈
              </view>
            </view>

            <view class="text-secondary mt-5 leading-40 text-22">
              距您{{ formatDistance(store.distance) }}
            </view>
            <view class="text-secondary leading-40 text-22">
              {{ store.fullAddress }}
            </view>
          </view>

          <!-- 导航按钮 -->
          <view class="flex-col-center-center px-20" @click="navigateToStore(store)">
            <image :src="`/pages-reward/static/images/shop/ic-nav-${themeCode}.png`" class="size-48" />
            <view class="leading-48 text-22">
              去导航
            </view>
          </view>
        </view>

        <view v-if="!initialized || loading" class="text-center text-#999 py-40">
          加载中...
        </view>
        <view v-else-if="!loading && shopList.length === 0" class="text-center text-#999 py-20">
          附近暂无门店
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { getShopList, validFeedback } from '@/api'
import { useLocation, useTheme } from '@/composables'
import { formatDistance, navigateTo } from '@/utils'

const SCREEN_HEIGHT = uni.getSystemInfoSync().windowHeight
const { themeCode, shopBtnColor, mapPopBgColor, mapPopTitColor } = useTheme()

// 搜索
const searchText = ref('')
const selectedRegion = ref<any>({
  province: { code: '', name: '' },
  city: { code: '', name: '' },
})

// 地图高度拖拽
const mapHeight = ref(SCREEN_HEIGHT * 0.4)
const MIN_HEIGHT = SCREEN_HEIGHT * 0.3
const MID_HEIGHT = SCREEN_HEIGHT * 0.5
const MAX_HEIGHT = SCREEN_HEIGHT * 0.7
let startY = 0

// 定位 & 地图中心
const location = reactive({ lat: 0, lng: 0 })
const center = reactive({ lat: 0, lng: 0 })

// 门店列表 & 分页
const initialized = ref(false)
const shopList = ref<any[]>([])
const page = ref(1)
const pageSize = 30
const hasMore = ref(true)
const loading = ref(false)
const currentStoreId = ref<number | null>(null)

// 地图标记点
const markers: any = computed(() => {
  return shopList.value.map((store, index) => ({
    id: index,
    latitude: Number(store.lat),
    longitude: Number(store.lon),
    iconPath: `/pages-reward/static/images/shop/ic-map-mark.png`,
    width: 40,
    height: 40,
    callout: {
      content: store.name,
      color: mapPopTitColor,
      fontSize: '20rpx',
      bgColor: mapPopBgColor,
      padding: 4,
      borderRadius: 20,
      display: 'ALWAYS',
      textAlign: 'center',
    },
  }))
})

onLoad(() => {
  initPage()
})

// 初始化数据
const initPage = async () => {
  const { lat, lng, province, city } = await useLocation()

  selectedRegion.value = { province, city }
  center.lat = Number(lat)
  center.lng = Number(lng)
  location.lat = Number(lat)
  location.lng = Number(lng)

  initialized.value = true

  fetchList(true)
}

// 确认搜索
const onSearch = () => {
  fetchList(true)
}

// 确认选择城市
const onRegionConfirm = (region: any) => {
  selectedRegion.value = {
    province: region[0],
    city: region[1],
  }

  console.log(selectedRegion.value)

  fetchList(true)
}

// 上拉加载分页
const onReachBottom = () => {
  if (!hasMore.value || loading.value) return
  fetchList(false)
}

// 加载列表
const fetchList = async (reset = false) => {
  if (loading.value) return

  if (reset) {
    page.value = 1
    shopList.value = []
    hasMore.value = true
  }

  loading.value = true
  try {
    const params = {
      words: searchText.value.trim(),
      longitude: location.lng,
      latitude: location.lat,
      page: page.value,
      pageSize,
      cityId: selectedRegion.value?.city?.code,
    }
    const list = await getShopList(params)

    if (reset) {
      shopList.value = list
    }
    else {
      shopList.value.push(...list)
    }

    hasMore.value = list.length === pageSize

    if (list.length > 0) {
      page.value += 1
    }
  }
  finally {
    loading.value = false
  }
}

// 点击列表门店
const selectStore = (store: any) => {
  currentStoreId.value = store.id
  center.lat = Number(store.lat)
  center.lng = Number(store.lon)
}

// 点击地图标记点
const onMarkerTap = (e: any) => {
  const index = e.detail.markerId
  const store = shopList.value[index]
  if (store) selectStore(store)
}

// 重新定位
const reLocate = async () => {
  initPage()
}

// 前往导航
const navigateToStore = (store: any) => {
  uni.openLocation({
    latitude: Number(store.lat),
    longitude: Number(store.lon),
    name: store.name,
    address: store.address,
    scale: 18,
  })
}

// 问题反馈
const goFeedback = async (storeId: string) => {
  const data = await validFeedback(storeId)

  navigateTo(`/pages-reward/shop/feedback?storeId=${storeId}&feedbackTypes=${JSON.stringify(data)}`)
}

// 拖拽调整地图高度
const onTouchStart = (e: TouchEvent) => {
  startY = e.touches[0].pageY
}

const onTouchMove = (e: TouchEvent) => {
  const deltaY = e.touches[0].pageY - startY
  let newHeight = mapHeight.value + deltaY

  if (newHeight < MIN_HEIGHT) newHeight = MIN_HEIGHT
  if (newHeight > MAX_HEIGHT) newHeight = MAX_HEIGHT

  mapHeight.value = newHeight
  startY = e.touches[0].pageY
}

const onTouchEnd = () => {
  const diff = 50
  if (mapHeight.value < MID_HEIGHT - diff) {
    mapHeight.value = MIN_HEIGHT
  }
  else if (mapHeight.value > MID_HEIGHT + diff) {
    mapHeight.value = MAX_HEIGHT
  }
  else {
    mapHeight.value = MID_HEIGHT
  }
}
</script>
