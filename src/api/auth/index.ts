import { post } from '@/api/request'

// 判断是否登陆
export const isLoginApi = () => post<any>('/wx/mem/userAuth/isLogin', {}, { custom: { skipAuthCheck: true, toast: false } })

// 获取OpenId
export const getOpenId = (data: any) => post<any>('/wx/mem/userAuth/getOpenId', data)

// 华润门户快捷健鉴权接口
export const hrAuth = (data: any) => post<any>('/wx/mem/userAuth/portal/auth', data)

// 登录
export const getSession = (data: any) => post<any>('/wx/mem/userAuth/getSession', data)
