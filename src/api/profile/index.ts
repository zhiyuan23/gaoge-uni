import { jsonPost, post } from '@/api'

// 获取用户信息
export const getUserInfo = () => post<any>('/wx/mem/user/getUserInfo')

// 更新用户信息
export const updateUserInfo = (data: any) => jsonPost<any>('/wx/mem/user/update', data)
