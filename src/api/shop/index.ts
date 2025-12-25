import type { NearbyShopListReq, NearbyShopListRes } from '@/types'
import { post } from '@/api'

// 获取兑奖点列表
export const getShopList = (data: NearbyShopListReq) => {
  return post<NearbyShopListRes>('/wx/mem/act/prizePlace/nearby', data)
}

// 门店问题反馈校验
export const validFeedback = (data: any) => {
  return post<any>('/wx/mem/act/problemFeedback/valid', data)
}

// 门店问题反馈提交
export const submitFeedback = (data: any) => {
  return post<any>('/wx/mem/act/problemFeedback/submit', data)
}
