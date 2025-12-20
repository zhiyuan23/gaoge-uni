import { jsonPost } from '@/api'

// 扫码-活动页
export const scanByDetail = (data: any) => jsonPost<any>('/wx/act/scanCode/executeByScan', data)

// 扫码-首页
export const scanByHome = (data: any) => jsonPost<any>('/wx/act/scanCode/executeByHome', data)

// 开奖
export const executeLottery = (data: any) => jsonPost<any>('/wx/act/prizeDraw/execute', data)
