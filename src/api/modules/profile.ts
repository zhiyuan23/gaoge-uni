import { jsonPost, post } from '@/api/request'

// 获取用户信息
export const getUserInfo = () => post<any>('/wx/mem/user/getUserInfo')

// 更新用户信息
export const updateUserInfo = (data: any) => jsonPost<any>('/wx/mem/user/update', data)
