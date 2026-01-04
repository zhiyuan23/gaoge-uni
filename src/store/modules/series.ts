import type { SeriesItem, SeriesKey } from '@/types'
import { getSeriesDetail, getSeriesList } from '@/api'
import { SERIES_CODES, SERIES_LIST } from '@/constants'
import { formatTime } from '@/utils'

const format = 'YYYY年MM月DD日'

const useSeriesStore = defineStore(
  'series',
  () => {
    const themeCode = ref<SeriesKey>('zbqr')
    const seriesList = ref<SeriesItem[]>(SERIES_LIST)
    const seriesDetail = ref<SeriesItem>(SERIES_LIST[0])

    const beginDate = computed(() => formatTime(seriesDetail.value?.beginTime, { format }))
    const endDate = computed(() => formatTime(seriesDetail.value?.endTime, { format }))
    const endTime = computed(() => formatTime(seriesDetail.value?.endTime, { format: 'YYYY年MM月DD日HH:mm' }))

    // 修改主题代码
    const setThemeCode = (code: SeriesKey) => {
      themeCode.value = code
    }

    // 修改系列详情
    const setSeriesDetail = (code: SeriesKey) => {
      seriesDetail.value = seriesList.value.find(item => item.code === code)!
    }

    // 获取系列列表
    const fetchSeriesList = async () => {
      const list = await getSeriesList()

      const map = Object.fromEntries(
        list.map((item: SeriesItem) => [item.code, item]),
      )

      seriesList.value = SERIES_CODES
        .map(code => map[code] ?? seriesList.value.find(t => t.code === code)!)
    }

    // 获取系列详情
    const fetchSeriesDetail = async () => {
      if (themeCode.value) {
        seriesDetail.value = await getSeriesDetail(themeCode.value)
      }
    }

    return {
      themeCode,
      seriesList,
      seriesDetail,
      beginDate,
      endDate,
      endTime,

      setThemeCode,
      setSeriesDetail,
      fetchSeriesList,
      fetchSeriesDetail,
    }
  },
  {
    persist: {
      pick: ['themeCode'],
    },
  },
)

export default useSeriesStore
