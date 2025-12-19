import { post } from '@/api'

// 获取OpenId
export const getOpenId = (data: any) => post<any>('/wx/mem/userAuth/getOpenId', data)

// 判断是否登陆
export const isLoginApi = () => post<any>('/wx/mem/userAuth/isLogin', {}, { custom: { skipAuthCheck: true } })

// 登录
export const getSession = (data: any) => post<any>('/wx/mem/userAuth/getSession', data)
