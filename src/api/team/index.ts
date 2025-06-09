import type { AssetListParams } from './types'
import { callCloudObj } from '@/utils/cloud'

/**
 * 获取资产列表（业务语义化封装）
 */
export async function getAssetListApi(params: AssetListParams = {}) {
  return callCloudObj<{ list: any[]; total: number }>('team-asset', 'getList', {
    page: 1,
    pageSize: 10,
    ...params, // 允许覆盖默认参数
  })
}

/**
 * 获取资产详情
 */
export async function getAssetDetailApi(id: string) {
  return callCloudObj('team-asset', 'getDetail', { id })
}

/**
 * 获取财务详情
 */
export async function getFinanceDetailApi() {
  return callCloudObj('team-finance', 'getDetail')
}
