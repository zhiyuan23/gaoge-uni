import { jsonPost, post } from '@/api/request'
import { CenterService } from '@/constants'

// 扫码-活动页
export const scanByDetail = (data: any) => jsonPost<any>('/wx/mem/act/scanCode/executeByScan', data, { custom: { toast: false } })

// 扫码-首页
export const scanByHome = (data: any) => jsonPost<any>('/wx/mem/act/scanCode/executeByHome', data, { custom: { toast: false } })

// 开奖
export const executeLottery = (data: any) => jsonPost<any>('/wx/mem/act/prizeDraw/execute', data, { custom: { toast: false } })

// 获取中奖人名单
export const getBingoList = (themeId: string) => post<any>('/wx/mem/act/prizeDraw/listBingoLimit', { themeId })

// 获取我的奖品列表
export const getMyPrizeList = (data: any) => post<any>('/wx/mem/act/myGiftCoupon/myGiftCouponPageList', data, { custom: { skipAuthCheck: true } })

// 获取我的奖品详情
export const getMyPrizeDetail = (id: string) => post<any>('/wx/mem/act/myGiftCoupon/myGiftCouponDetail', { id })

// 填写兑奖信息
export const fillInInfo = (data: any) => post<any>('/wx/mem/act/myGiftCoupon/fillInExchangeInfo', data)

// 提现
export const cashWithdraw = (giftCouponId: string) => post<any>('/wx/mem/cashWithdraw/memCashWithdraw', { giftCouponId }, { custom: { loading: true } })

// 消费者处理提现成功记录
export const cashWithdrawSuccess = (userCashWithdrawRecordId: string) => post<any>('/wx/mem/cashWithdraw/handleCashWithdrawSuccess', { userCashWithdrawRecordId }, { custom: { toast: false } })

// 获取兑奖点列表
export const getShopList = (data: any) => post<any>('/wx/sto/nearBy', { ...data, _center: CenterService.Md })

// 门店问题反馈校验
export const validFeedback = (storeId: string) => post<any>('/wx/mem/act/problemFeedback/valid', { storeId })

// 门店问题反馈提交
export const submitFeedback = (data: any) => jsonPost<any>('/wx/mem/act/problemFeedback/submit', data)
