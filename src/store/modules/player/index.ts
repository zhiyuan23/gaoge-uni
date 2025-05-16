import type { PlayerListParams } from '@/api/player/types'
import { fetchPlayerList } from '@/api/player'

const usePlayerStore = defineStore(
  // 唯一ID
  'player',
  () => {
    const player_list = ref()

    async function getPlayerList(params?: PlayerListParams) {
      const { data } = await fetchPlayerList(params)
      player_list.value = data?.list
    }

    return {
      player_list,
      getPlayerList,
    }
  },
)

export default usePlayerStore
