const useSeriesStore = defineStore(
  'series',
  () => {
    const seriesInfo = ref({})
    const seriesCode = ref('')

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
