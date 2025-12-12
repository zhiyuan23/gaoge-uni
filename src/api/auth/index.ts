import { post } from '@/api'

// 获取OpenId
export const getOpenId = (data: any) => post<any>('/wx/mem/userAuth/getOpenId', data)
