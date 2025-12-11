import type { ExchangePoint } from '@/api/lottery/exchange'
import { ExchangeApi } from '@/api'

const { getExchangeList } = ExchangeApi

const useExchangeStore = defineStore(
  'exchange',
  () => {
    const storeList = ref<ExchangePoint[]>([])
    const currentStoreId = ref<number | null>(null)

    const markers = computed(() => {
      return storeList.value.map(store => ({
        id: store.id,
        latitude: store.lat,
        longitude: store.lng,
        iconPath: store.id === currentStoreId.value ? '/static/images/exchange/ic-map-mark.png' : '/static/images/exchange/ic-map-mark.png',
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

    const fetchStoreList = async () => {
      const { list } = await getExchangeList()
      storeList.value = list
    }

    return {
      storeList,
      markers,

      fetchStoreList,
    }
  },
  {
    persist: true,
  },
)

export default useExchangeStore
