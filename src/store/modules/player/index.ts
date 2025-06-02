import type { PlayerListParams } from '@/api/player/types'
import {
  fetchBindPlayerOpenid,
  fetchPlayerDetail,
  fetchPlayerList,
  fetchPlayerNumbers,
  fetchUnbindPlayerOpenid,
  fetchUpdatePlayerInfo,
} from '@/api/player'
import { getToken } from '@/utils/auth'

const usePlayerStore = defineStore(
  // 唯一ID
  'player',
  () => {
    const player_detail = ref()
    const player_list = ref()
    const player_numbers = ref()

    /**
     * 获取球员列表
     * @param params
     */
    async function getPlayerList(params?: PlayerListParams) {
      const { data } = await fetchPlayerList(params)
      player_list.value = data?.list
        ?.map(item => ({
          ...item,
          team: item.team?.split(',') ?? [],
        }))
    }

    /**
     * 获取球员详情
     */
    async function getPlayerDetail() {
      const openid = getToken()
      const { data } = await fetchPlayerDetail({ openid })
      if (data) {
        data.team = data.team?.split(',') ?? []
      }
      player_detail.value = data
    }

    /**
     * 修改个人信息
     */
    async function updatePlayerInfo(params?: any) {
      const openid = getToken()

      await fetchUpdatePlayerInfo({ openid, ...params })
      getPlayerDetail()
    }

    /**
     * 获取未绑定的球员号码
     */
    async function getPlayerNumbers() {
      const { data } = await fetchPlayerNumbers()

      player_numbers.value = data
    }

    /**
     * 绑定球员号码
     */
    async function bindPlayerOpenid(number: number) {
      const openid = getToken()
      await fetchBindPlayerOpenid({ number, openid })

      getPlayerDetail()
    }

    /**
     * 解除绑定
     */
    async function unbindPlayerOpenid() {
      const openid = getToken()
      await fetchUnbindPlayerOpenid({ openid })

      getPlayerDetail()
    }

    return {
      player_detail,
      player_list,
      player_numbers,
      getPlayerDetail,
      getPlayerList,
      getPlayerNumbers,
      bindPlayerOpenid,
      unbindPlayerOpenid,
      updatePlayerInfo,
    }
  },
)

export default usePlayerStore
