<template>
  <view class="fixed z-9 w-100vw flex-center-center bg-white h-104 border-b-1-solid-#e6e6e6 border-t-1-solid-#e6e6e6">
    <SearchBar
      v-model="searchText"
      city-name="沈阳"
      placeholder="输入兑奖点名称或地址搜索"
      @search="loadData"
    />
  </view>
  <view class="fixed flex flex-col overflow-hidden inset-0">
    <view
      class="relative flex-shrink-0 transition-all duration-300"
      :style="{ height: `${mapHeight}px` }"
    >
      <!-- 地图 -->
      <map
        class="h-full w-full"
        :latitude="center.lat"
        :longitude="center.lng"
        :scale="15"
        :markers="markers"
        show-location
        @markertap="onMarkerTap"
      />

      <!-- 回到定位按钮 -->
      <view
        class="absolute z-20 flex items-center justify-center rounded-full bg-white shadow-lg w-12 h-12 right-4 bottom-20"
        @click.stop="reLocate"
      />
    </view>

    <!-- 拖拽把手 -->
    <view
      class="relative z-30 flex-center-center rounded-[47rpx_47rpx_0rpx_0rpx] bg-[linear-gradient(180deg,_#7EBC1D,_rgba(126,188,29,0.6))] color-white font-bold h-92 min-h-92 text-36"
      @touchstart.stop="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend.stop="onTouchEnd"
    >
      为您找到附近最近的兑奖点
    </view>

    <!-- 列表区域 -->
    <scroll-view
      scroll-y
      class="flex-1 bg-white"
      :style="{ height: `calc(100vh - ${mapHeight}px - 48px)` }"
    >
      <view class="bg-white pb-50">
        <view
          v-for="store in shopList" :key="store.id"
          class="flex-center bg-white mx-25 h-184 border-b-1-solid-#e0e0e0"
          :class="{ 'bg-#07c160': currentStoreId === store.id }"
          @click="selectStore(store)"
        >
          <!-- 门店图片 -->
          <image :src="store.cover" class="size-144 flex-shrink-0 mr-16 -ml-5" />
          <view class="flex-1">
            <!-- 门店信息 -->
            <view class="flex-center">
              <view class="font-bold mt-4">
                {{ store.name }}
              </view>
              <view class="flex-center-center flex-shrink-0 rounded-20 color-#F77600 ml-10 w-130 h-40 text-20 border-2-solid-#F77600" @click="goFeedback">
                我要反馈
              </view>
            </view>

            <view class="text-secondary mt-5 leading-40 text-22">
              距您{{ store.distance }}km
            </view>
            <view class="text-secondary leading-40 text-22">
              {{ store.address }}
            </view>
          </view>

          <!-- 导航按钮 -->
          <view class="flex-col-center-center px-20" @click="navigateToStore(store)">
            <image src="/static/images/shop/ic-nav.png" class="size-48" />
            <view class="leading-48 text-22">
              去导航
            </view>
          </view>
        </view>

        <view v-if="loading" class="text-center text-#999 py-20">
          加载中...
        </view>
        <view v-if="!loading && shopList.length === 0" class="text-center text-#999 py-20">
          附近暂无门店
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang='ts'>
import useShopStore from '@/store/shop'
import { navigateTo } from '@/utils'

const SCREEN_HEIGHT = uni.getSystemInfoSync().windowHeight

const shopStore = useShopStore()
const { shopList, markers, fetchShopList } = shopStore

// 默认地图占 40%
const mapHeight = ref(SCREEN_HEIGHT * 0.4)
const MIN_HEIGHT = SCREEN_HEIGHT * 0.3
const MID_HEIGHT = SCREEN_HEIGHT * 0.5
const MAX_HEIGHT = SCREEN_HEIGHT * 0.7

let startY = 0

const center = reactive<any>({})
const currentStoreId = ref<number | null>(null)
const loading = ref(false)

const searchText = ref<string>('')

// 加载数据
const loadData = async () => {
  loading.value = true

  // const { latitude, longitude } = await uni.getLocation({ type: 'gcj02' })
  const { latitude, longitude } = { latitude: 41.71482, longitude: 123.44972 }
  center.lat = latitude
  center.lng = longitude

  console.log(searchText.value)
  await fetchShopList()

  loading.value = false
}

// 我要反馈
const goFeedback = () => {
  navigateTo('/pages/shop/feedback')
}

// 去导航
const navigateToStore = (store: any) => {
  uni.openLocation({
    latitude: store.lat,
    longitude: store.lng,
    name: store.name,
    address: store.address,
    scale: 18,
  })
}

// 点击列表门店-地图定位到门店
const selectStore = (store: any) => {
  currentStoreId.value = store.id
  center.lat = store.lat
  center.lng = store.lng
}

// 地图定位点点击
const onMarkerTap = (e: any) => {
  const id = e.detail.markerId
  const store = shopList.find(s => s.id === id)
  if (store) selectStore(store)
}

// 回到当前定位
const reLocate = async () => {
  const res = await uni.getLocation()

  center.lat = res.latitude
  center.lng = res.longitude
  loadData()
}

// 拖拽功能-拖拽开始
const onTouchStart = (e: any) => {
  startY = e.touches[0].pageY
}

// 拖拽功能-拖拽中
const onTouchMove = (e: any) => {
  const deltaY = e.touches[0].pageY - startY
  let newHeight = mapHeight.value + deltaY

  if (newHeight < MIN_HEIGHT) newHeight = MIN_HEIGHT
  if (newHeight > MAX_HEIGHT) newHeight = MAX_HEIGHT

  mapHeight.value = newHeight
  startY = e.touches[0].pageY
}

// 拖拽功能-拖拽结束
const onTouchEnd = () => {
  if (mapHeight.value < MID_HEIGHT - 50) {
    mapHeight.value = MIN_HEIGHT
  }
  else if (mapHeight.value > MID_HEIGHT + 50) {
    mapHeight.value = MAX_HEIGHT
  }
  else {
    mapHeight.value = MID_HEIGHT
  }
}

onLoad(() => {
  loadData()
})
</script>
