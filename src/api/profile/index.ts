import { post } from '@/api'

// 获取用户信息
export const getUserInfo = () => post<any>('/wx/mem/user/getUserInfo')

// 更新用户信息
export const updateUserInfo = (data: any) => post<any>('/wx/mem/user/update', data)
