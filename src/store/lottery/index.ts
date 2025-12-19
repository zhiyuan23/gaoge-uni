import type { SeriesKey } from '@/types'
import { executeLottery, scanByDetail, scanByHome } from '@/api/lottery'

const useLotteryStore = defineStore(
  'lottery',
  () => {
    const seriesCode = ref<SeriesKey>('ml')
    const lotteryInfo = ref({})

    // 扫码
    const fetchScan = async (data: any, scanType: 'weixin' | 'mini') => {
      if (scanType === 'weixin') {
        // 微信扫码
        await scanByHome(data)
      }
      else {
        // 小程序扫码
        await scanByDetail(data)
      }
    }

    // 开奖
    const fetchLottery = async (data: any) => {
      const res = await executeLottery(data)

      lotteryInfo.value = res
    }

    return {
      seriesCode,
      lotteryInfo,

      fetchScan,
      fetchLottery,
    }
  },
  {
    persist: [
      {
        pick: ['seriesCode'],
      },
    ],
  },
)

export default useLotteryStore
