import type { SeriesKey } from '@/types'

const useThemeStore = defineStore(
  'theme',
  () => {
    const seriesCode = ref<SeriesKey>('zwcs')

    const setSeriesCode = (code: SeriesKey) => {
      seriesCode.value = code
    }

    return {
      seriesCode: readonly(seriesCode),

      setSeriesCode,
    }
  },
  {
    persist: true,
  },
)

export default useThemeStore
