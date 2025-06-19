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
    const myPlayerInfo = ref()
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
     * 获取我的球员详情
     */
    async function getPlayerDetail(number?: number) {
      const { data } = await getPlayerDetailApi({ number })
      if (data) {
        data.team = data.team?.split(',') ?? []
      }

      playerDetail.value = data
    }

    /**
     * 获取球员详情
     */
    async function getMyPlayerInfo() {
      const openid = getToken()
      const { data } = await getPlayerDetailApi({ openid })
      if (data) {
        data.team = data.team?.split(',') ?? []
      }

      myPlayerInfo.value = data
    }

    /**
     * 修改个人信息
     */
    async function updatePlayerInfo(params?: any) {
      const { data } = await updatePlayerInfoApi(params)
      getPlayerDetail(data.number)
      getMyPlayerInfo()
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

      getMyPlayerInfo()
    }

    /**
     * 解除绑定
     */
    async function unbindPlayerOpenid(number: number) {
      await getUnbindPlayerOpenidApi({ number })

      getMyPlayerInfo()
      getPlayerNumbers()
    }

    return {
      myPlayerInfo,
      playerDetail,
      playerList,
      playerNumbers,
      getMyPlayerInfo,
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
