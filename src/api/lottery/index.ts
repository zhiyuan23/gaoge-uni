import { jsonPost, post } from '@/api'

// 扫码-活动页
export const scanByDetail = (data: any) => jsonPost<any>('/wx/mem/act/scanCode/executeByScan', data)

// 扫码-首页
export const scanByHome = (data: any) => jsonPost<any>('/wx/mem/act/scanCode/executeByHome', data)

// 开奖
export const executeLottery = (data: any) => jsonPost<any>('/wx/mem/act/prizeDraw/execute', data)

// 获取我的奖品列表
export const getMyPrizeList = (data: any) => post<any>('/wx/mem/act/myGiftCoupon/myGiftCouponPageList', data, { custom: { skipAuthCheck: true } })

// 获取我的奖品详情
export const getMyPrizeDetail = (id: string) => post<any>('/wx/mem/act/myGiftCoupon/myGiftCouponDetail', { id })

// 填写兑奖信息
export const fillInInfo = (data: any) => post<any>('/wx/mem/act/myGiftCoupon/fillInExchangeInfo', data)

// 提现
export const cashWithdraw = (giftCouponId: string) => post<any>('/wx/mem/cashWithdraw/memCashWithdraw', { giftCouponId }, { custom: { loading: true } })
