import type { MatchListParams } from './types'
import { callCloudObj } from '@/utils/cloud'

/**
 * 获取比赛列表
 */
export async function getMatchListApi(params: MatchListParams = {}) {
  return callCloudObj<{ list: any[]; total: number }>('match', 'getList', {
    page: 1,
    pageSize: 50,
    ...params, // 允许覆盖默认参数
  })
}
