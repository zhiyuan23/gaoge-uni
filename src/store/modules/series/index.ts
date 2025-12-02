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
        key: 'sessionKey', // localStorage 的 key
        pick: ['seriesCode'], // 需要持久化的字段
        storage: localStorage,
        serializer: {
          // 存储时只存字符串
          serialize: (state: any) => state.seriesCode,
          // 读取时还原成对象
          deserialize: (value: string | null) => ({ seriesCode: value || '' }),
        },
      },
    ],
  },
)

export default useSeriesStore
