import type { AssetListParams } from '@/api/team/types'
import {
  getAssetListApi,
  getFinanceDetailApi,
} from '@/api/team'

const useTeamStore = defineStore(
  // 唯一ID
  'team',
  () => {
    const teamAssets = ref()
    const teamFinance = ref({
      total_income: 0,
      total_expense: 0,
      balance: 0,
    })

    /**
     * 球队资金
     * @param params
     */
    async function getAssetList(params?: AssetListParams) {
      const { data } = await getAssetListApi(params)
      teamAssets.value = data?.list
    }

    /**
     * 球队资产
     */
    async function getFinanceDetail() {
      const { data } = await getFinanceDetailApi()
      teamFinance.value = data
    }

    return {
      teamAssets,
      teamFinance,
      getAssetList,
      getFinanceDetail,
    }
  },
)

export default useTeamStore
