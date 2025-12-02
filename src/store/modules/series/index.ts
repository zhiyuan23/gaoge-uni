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
        storage: localStorage,
      },
    ],
  },
)

export default useSeriesStore
