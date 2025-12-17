import type { NearbyShopListReq, NearbyShopListRes } from '@/types'
import { post } from '@/api'

// 获取兑奖点列表
export const getShopList = (data: NearbyShopListReq) => {
  return post<NearbyShopListRes>('/wx/act/prizePlace/nearby', data)
}
