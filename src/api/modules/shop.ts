import { jsonPost, post } from '@/api/request'
import { CenterService } from '@/constants'

// 获取兑奖点列表
export const getShopList = (data: any) => {
  return post<any>('/wx/sto/nearBy', {
    ...data,
    _center: CenterService.Md,
  })
}

// 门店问题反馈校验
export const validFeedback = (storeId: string) => {
  return post<any>('/wx/mem/act/problemFeedback/valid', { storeId })
}

// 门店问题反馈提交
export const submitFeedback = (data: any) => {
  return jsonPost<any>('/wx/mem/act/problemFeedback/submit', data)
}
