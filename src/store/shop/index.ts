import { getShopList } from '@/api/shop'

const useShopStore = defineStore(
  'shop',
  () => {
    const shopList = ref<any[]>([])
    const currentStoreId = ref<number | null>(null)

    // 地图覆盖点
    const markers = computed(() => {
      return shopList.value.map(store => ({
        id: store.id,
        latitude: store.lat,
        longitude: store.lng,
        iconPath: store.id === currentStoreId.value ? '/static/images/shop/ic-map-mark.png' : '/static/images/shop/ic-map-mark.png',
        width: 40,
        height: 40,
        callout: {
          content: store.name,
          color: '#FFFFFF',
          fontSize: '20rpx',
          bgColor: '#7FBE26',
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
    const fetchShopList = async () => {
      const { list } = await getShopList()
      shopList.value = list
    }

    return {
      shopList,
      markers,

      fetchShopList,
    }
  },
  {
    persist: true,
  },
)

export default useShopStore
