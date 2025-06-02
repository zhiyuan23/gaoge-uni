import type { AssetListParams } from '@/api/team/types'
import { fetchAssetList, fetchFinanceDetail } from '@/api/team'

const useTeamStore = defineStore(
  // 唯一ID
  'team',
  () => {
    const team_assets = ref()
    const team_finance = ref({
      total_income: 0,
      total_expense: 0,
      balance: 0,
    })

    /**
     * 球队资金
     * @param params
     */
    async function getAssetList(params?: AssetListParams) {
      const { data } = await fetchAssetList(params)
      team_assets.value = data?.list
    }

    /**
     * 球队资产
     * @param params
     */
    async function getFinanceDetail() {
      const { data } = await fetchFinanceDetail()
      team_finance.value = data
    }

    return {
      team_assets,
      team_finance,
      getAssetList,
      getFinanceDetail,
    }
  },
)

export default useTeamStore
