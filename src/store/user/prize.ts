import { defineStore } from 'pinia'
import { getMyPrizeList } from '@/api/user/prize'

const useMyPrizeStore = defineStore('myPrize', () => {
  // 按 seriesCode 分别存列表、页码、加载状态
  const lists = ref<Record<string, any[]>>({})
  const loadings = ref<Record<string, boolean>>({})
  const hasMores = ref<Record<string, boolean>>({})
  const pages = ref<Record<string, number>>({})
  const pageSize = 10

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

  const getList = (seriesCode: string) => lists.value[seriesCode] || []
  const getLoading = (seriesCode: string) => loadings.value[seriesCode] || false
  const getHasMore = (seriesCode: string) => hasMores.value[seriesCode] ?? true

  const refresh = (seriesCode: string) => fetchList(seriesCode, true)

  return {
    lists,
    loadings,
    hasMores,
    pages,
    fetchList,
    getList,
    getLoading,
    getHasMore,
    refresh,
  }
})

export default useMyPrizeStore
