import type { SeriesItem, SeriesKey } from '@/types'
import { getSeriesDetail, getSeriesList } from '@/api'
import { SERIES_CODES, SERIES_LIST } from '@/constants'
import { formatTime, preloadImages, reLaunch } from '@/utils'

const format = 'YYYY年MM月DD日'

const useSeriesStore = defineStore(
  'series',
  () => {
    const themeCode = ref<SeriesKey>('zbqr')
    const seriesList = ref<SeriesItem[]>(SERIES_LIST)
    const seriesDetail = ref<SeriesItem>(SERIES_LIST[0])
    const seriesLocalImgs = ref<any>({})
    const isRequestFail = ref(false)

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
    const fetchSeriesList = async (refresh = false) => {
      try {
        const list = await getSeriesList()

        isRequestFail.value = false
        if (refresh) {
          reLaunch('/pages/home/index')
          return
        }

        const map = Object.fromEntries(
          list.map((item: SeriesItem) => [item.code, item]),
        )
        const newList = SERIES_CODES.map(code =>
          map[code] ?? seriesList.value.find(t => t.code === code)!,
        )
        seriesList.value = newList

        // 预加主题详情图片
        const preloadItems = newList
          .filter(item => item.backgroundImg)
          .map(item => ({
            code: item.code,
            url: item.backgroundImg as string,
          }))
        const imageUrls = preloadItems.map(item => item.url)
        const localImgs: Record<string, string> = {}

        if (imageUrls.length > 0) {
          const localPaths = await preloadImages(imageUrls, 'download')

          preloadItems.forEach((item, i) => {
            localImgs[item.code] = localPaths[i]
          })
        }
        seriesLocalImgs.value = localImgs
      }
      catch {
        isRequestFail.value = true
      }
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
      seriesLocalImgs,
      isRequestFail,
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
