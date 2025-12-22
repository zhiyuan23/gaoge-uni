import { defineStore } from 'pinia'
import { getMyPrizeList } from '@/api/user/prize'

const useMyPrizeStore = defineStore('myPrize', () => {
  const lists = ref<Record<string, any[]>>({})
  const loadings = ref<Record<string, boolean>>({})
  const hasMores = ref<Record<string, boolean>>({})
  const pages = ref<Record<string, number>>({})
  const pageSize = 10

  const prizeDetail = ref<any>({})

  const fetchList = async (seriesCode: string, reset = false) => {
    if (!seriesCode) return
    if (loadings.value[seriesCode]) return

    if (reset) {
      pages.value[seriesCode] = 1
      lists.value[seriesCode] = []
      hasMores.value[seriesCode] = true
    }

    loadings.value[seriesCode] = true

    try {
      const res = await getMyPrizeList({
        page: pages.value[seriesCode] || 1,
        pageSize,
        seriesCode,
      })

      if (reset) {
        lists.value[seriesCode] = res.list || []
      }
      else {
        lists.value[seriesCode] = [
          ...(lists.value[seriesCode] || []),
          ...(res.list || []),
        ]
      }

      hasMores.value[seriesCode] = (res.list?.length || 0) === pageSize
      pages.value[seriesCode] = (pages.value[seriesCode] || 1) + 1
    }
    finally {
      loadings.value[seriesCode] = false
    }
  }

  const fetchDetail = () => {
    const data = {
      cash: '888',
    }

    prizeDetail.value = data
  }

  const getList = (seriesCode: string) => lists.value[seriesCode] || []
  const getLoading = (seriesCode: string) => loadings.value[seriesCode] || false
  const getHasMore = (seriesCode: string) => hasMores.value[seriesCode] ?? true

  const refresh = (seriesCode: string) => fetchList(seriesCode, true)

  return {
    lists,
    loadings,
    hasMores,
    pages,
    prizeDetail,

    fetchList,
    getList,
    getLoading,
    getHasMore,
    refresh,
    fetchDetail,
  }
})

export default useMyPrizeStore
