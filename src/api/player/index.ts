import type { PlayerListParams } from './types'
import { callCloudObj } from '@/utils/cloud'

/**
 * 获取球员列表
 */
export async function getPlayerListApi(params: PlayerListParams = {}) {
  return callCloudObj<{ list: any[]; total: number }>('player', 'getList', {
    page: 1,
    pageSize: 50,
    ...params, // 允许覆盖默认参数
  })
}

/**
 * 获取球员详情
 */
export async function getPlayerDetailApi(params: object) {
  return callCloudObj('player', 'getDetail', params)
}

/**
 * 修改个人信息
 */
export async function updatePlayerInfoApi(params: object) {
  return callCloudObj('player', 'updatePlayerInfo', params)
}

/**
 * 获取未绑定的号码
 */
export async function getPlayerNumbersApi() {
  return callCloudObj('player', 'getPlayerNumbers')
}

/**
 * 绑定球员信息
 */
export async function getBindPlayerOpenidApi(params: object) {
  return callCloudObj('player', 'bindPlayerOpenid', params)
}

/**
 * 解除绑定
 */
export async function getUnbindPlayerOpenidApi(params: object) {
  return callCloudObj('player', 'unbindPlayerOpenid', params)
}
