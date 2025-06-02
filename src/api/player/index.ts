import type { PlayerListParams } from './types'
import { callCloudObj } from '@/utils/cloud'

/**
 * 获取球员列表
 */
export async function fetchPlayerList(params: PlayerListParams = {}) {
  return callCloudObj<{ list: any[]; total: number }>('player', 'getList', {
    page: 1,
    pageSize: 50,
    ...params, // 允许覆盖默认参数
  })
}

/**
 * 获取球员详情
 */
export async function fetchPlayerDetail(params: object) {
  return callCloudObj('player', 'getDetail', params)
}

/**
 * 修改个人信息
 */
export async function fetchUpdatePlayerInfo(params: object) {
  return callCloudObj('player', 'updatePlayerInfo', params)
}

/**
 * 获取未绑定的号码
 */
export async function fetchPlayerNumbers() {
  return callCloudObj('player', 'getPlayerNumbers')
}

/**
 * 绑定球员信息
 */
export async function fetchBindPlayerOpenid(params: object) {
  return callCloudObj('player', 'bindPlayerOpenid', params)
}

/**
 * 解除绑定
 */
export async function fetchUnbindPlayerOpenid(params: object) {
  return callCloudObj('player', 'unbindPlayerOpenid', params)
}
