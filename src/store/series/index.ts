import type { SeriesItem, SeriesKey } from '@/types'
import { getSeriesDetail, getSeriesList } from '@/api/series'
import { SERIES_CODE, SERIES_CODES, SERIES_LIST } from '@/constants'

const useSeriesStore = defineStore(
  'theme',
  () => {
    const themeCode = ref<SeriesKey>(SERIES_CODE)
    const seriesList = ref<SeriesItem[]>(SERIES_LIST)

    // 修改主题代码
    const setThemeCode = (code: SeriesKey) => {
      themeCode.value = code
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
    const fetchSeriesDetail = async (code: SeriesKey) => {
      const res = await getSeriesDetail(code)

      seriesList.value = res
    }

    return {
      themeCode,
      seriesList,

      setThemeCode,
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
