import type { PlayerListParams } from '@/api/player/types'
import {
  getBindPlayerOpenidApi,
  getPlayerDetailApi,
  getPlayerListApi,
  getPlayerNumbersApi,
  getUnbindPlayerOpenidApi,
  updatePlayerInfoApi,
} from '@/api/player'
import { getToken } from '@/utils/auth'

const usePlayerStore = defineStore(
  // 唯一ID
  'player',
  () => {
    const playerDetail = ref()
    const playerList = ref()
    const playerNumbers = ref()

    /**
     * 获取球员列表
     * @param params
     */
    async function getPlayerList(params?: PlayerListParams) {
      const { data } = await getPlayerListApi(params)
      playerList.value = data?.list
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
      const { data } = await getPlayerDetailApi({ openid })
      if (data) {
        data.team = data.team?.split(',') ?? []
      }
      playerDetail.value = data
    }

    /**
     * 修改个人信息
     */
    async function updatePlayerInfo(params?: any) {
      const openid = getToken()

      await updatePlayerInfoApi({ openid, ...params })
      getPlayerDetail()
      getPlayerList()
    }

    /**
     * 获取未绑定的球员号码
     */
    async function getPlayerNumbers() {
      const { data } = await getPlayerNumbersApi()

      playerNumbers.value = data
    }

    /**
     * 绑定球员号码
     */
    async function bindPlayerOpenid(number: number) {
      const openid = getToken()
      await getBindPlayerOpenidApi({ number, openid })

      getPlayerDetail()
    }

    /**
     * 解除绑定
     */
    async function unbindPlayerOpenid() {
      const openid = getToken()
      await getUnbindPlayerOpenidApi({ openid })

      getPlayerDetail()
    }

    return {
      playerDetail,
      playerList,
      playerNumbers,
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
