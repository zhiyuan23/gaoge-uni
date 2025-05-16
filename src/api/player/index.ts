import type { PlayerListParams } from './types'
import { callCloudObj } from '@/utils/cloud'

/**
 * 获取球员列表
 */
export async function fetchPlayerList(params: PlayerListParams = {}) {
  return callCloudObj<{ list: any[]; total: number }>('player', 'getList', {
    page: 1,
    pageSize: 10,
    ...params, // 允许覆盖默认参数
  })
}
