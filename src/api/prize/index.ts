import { post } from '@/api'

import { mockPrizeData } from './mock'

// 获取我的奖品列表
// export const getMyPrizeList = (data: any) => post<any>('/wx/mem/act/myGiftCoupon/myGiftCouponPageList', data)

// 获取我的奖品
export const getMyPrizeList = (data: any) => {
  console.log(data)
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve(mockPrizeData)
    }, 300)
  })
}

// 获取我的奖品详情
export const getMyPrizeDetail = (data: any) => post<any>('/wx/mem/act/myGiftCoupon/myGiftCouponDetail', data)

// 填写兑奖信息
export const fillInInfo = (data: any) => post<any>('/wx/mem/act/myGiftCoupon/fillInExchangeInfo', data)
