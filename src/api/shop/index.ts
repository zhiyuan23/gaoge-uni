import type { NearbyShopListReq, NearbyShopListRes } from '@/types'
import { jsonPost, post } from '@/api/request'

// 获取兑奖点列表
export const getShopList = (data: NearbyShopListReq) => {
  return post<NearbyShopListRes>('/wx/mem/act/prizePlace/nearby', data)
}

// 门店问题反馈校验
export const validFeedback = (storeId: string) => {
  return post<any>('/wx/mem/act/problemFeedback/valid', { storeId })
}

// 门店问题反馈提交
export const submitFeedback = (data: any) => {
  return jsonPost<any>('/wx/mem/act/problemFeedback/submit', data)
}
