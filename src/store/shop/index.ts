import type { NearbyShopListReq } from '@/types'
import { getShopList } from '@/api/shop'
import { useTheme } from '@/composables'

const useShopStore = defineStore(
  'shop',
  () => {
    const shopList = ref<any[]>([])

    // 分页参数
    const page = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const hasMore = ref(true)

    const currentStoreId = ref<number | null>(null)

    // 地图覆盖点
    const markers = computed(() => {
      const { mapPopBgColor, mapPopTitColor } = useTheme()

      return shopList.value.map((store, index) => ({
        id: index,
        latitude: store.lat,
        longitude: store.lon,
        iconPath: store.hotPointID === currentStoreId.value ? '/static/images/shop/ic-map-mark.png' : '/static/images/shop/ic-map-mark.png',
        width: 40,
        height: 40,
        callout: {
          content: store.name,
          color: mapPopTitColor,
          fontSize: '20rpx',
          bgColor: mapPopBgColor,
          padding: 2,
          paddingLeft: '10rpx',
          paddingRight: '10rpx',
          borderRadius: 20,
          display: 'ALWAYS',
          textAlign: 'center',
        },
      }))
    })

    // 获取门店列表
    const fetchList = async (params: NearbyShopListReq, isLoadMore = false) => {
      if (isLoadMore) {
        page.value += 1
      }
      else {
        page.value = 1
        shopList.value = []
        hasMore.value = true
      }

      const res = await getShopList({
        ...params,
        page: page.value,
      })

      if (isLoadMore) {
        shopList.value = [...shopList.value, ...res.rows]
      }
      else {
        shopList.value = res.rows
      }

      if (res.total) {
        total.value = res.total
        hasMore.value = shopList.value.length < res.total
      }
      else {
        hasMore.value = res.rows.length >= pageSize.value
      }
    }

    const reset = () => {
      page.value = 1
      shopList.value = []
      hasMore.value = true
    }

    return {
      shopList,
      markers,
      currentStoreId,
      page,
      hasMore: readonly(hasMore),

      fetchList,
      reset,
    }
  },
  {
    persist: true,
  },
)

export default useShopStore
