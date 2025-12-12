import type { SeriesKey } from '@/constants'
import { themes } from '@/constants'
import useSeriesStore from '@/store/series'

export const useTheme = () => {
  const { seriesCode } = storeToRefs(useSeriesStore())

  const series = computed<SeriesKey>(() =>
    ['ml', 'zbqr', 'zwcs'].includes(seriesCode.value)
      ? seriesCode.value
      : 'ml',
  )

  const cfg = computed(() => themes[series.value])

  return {
    series,
    ...cfg.value,
  }
}
