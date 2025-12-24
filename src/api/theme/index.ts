import { post } from '@/api'

// 获取活动主题列表
export const getThemeList = () => post<any>('/wx/act/theme/list')

// 获取活动主题详情
export const getThemeDetail = (code: string) => post<any>('/wx/act/theme/getByCode', { code })
