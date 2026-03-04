import { THEMES } from '@/constants'
import { useSeriesStore } from '@/store'

export const useTheme = () => {
  const { themeCode } = storeToRefs(useSeriesStore())

  const config = computed(() => THEMES[themeCode.value])

  return {
    themeCode,
    ...config.value,
  }
}
