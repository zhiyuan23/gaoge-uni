import type { MatchListParams } from '@/api/match/types'
import { getMatchListApi } from '@/api/match'

const useMatchStore = defineStore(
  'match',
  () => {
    const recentLeagueMatch = ref()
    const recentChampionMatch = ref()
    const recentCupMatch = ref()
    const cupMatchList = ref()
    const leagueMatchList = ref()
    const matchList = ref()

    /**
     * 获取比赛列表
     */
    async function getMatchList(params?: MatchListParams) {
      const { data } = await getMatchListApi(params)

      if (params?.type === 'cup') {
        cupMatchList.value = data
      }
      else if (params?.type === 'league') {
        leagueMatchList.value = data
      }
      else if (params?.type === 'champion') {
        recentChampionMatch.value = data
      }
      else {
        matchList.value = data
      }
    }

    /**
     * 获取最近一场或多场比赛
     */
    async function getRecentMatch(params: MatchListParams = {}) {
      const { page = 1, pageSize = 1, ...rest } = params

      const finalParams: MatchListParams = {
        ...rest,
        page,
        pageSize,
      }

      const { data } = await getMatchListApi(finalParams)
      const match = data?.list[0]
      if (rest.type === 'league') {
        recentLeagueMatch.value = match
      }
      else if (rest.type === 'champion') {
        recentChampionMatch.value = match
      }
      else if (rest.type === 'cup') {
        recentCupMatch.value = match
      }
    }

    return {
      recentLeagueMatch,
      recentChampionMatch,
      recentCupMatch,
      cupMatchList,
      leagueMatchList,
      matchList,
      getRecentMatch,
      getMatchList,
    }
  },
)

export default useMatchStore
