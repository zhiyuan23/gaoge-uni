import { themes } from '@/constants'
import useSeriesStore from '@/store/theme'

export const useTheme = () => {
  const { seriesCode } = storeToRefs(useSeriesStore())

  const cfg = computed(() => themes[seriesCode.value])

  return {
    seriesCode,
    ...cfg.value,
  }
}
