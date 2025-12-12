import type { SeriesKey } from '@/constants'

const useSeriesStore = defineStore(
  'series',
  () => {
    const seriesInfo = ref({})
    const seriesCode = ref<SeriesKey>('ml')

    return {
      seriesInfo,
      seriesCode,
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

export default useSeriesStore
