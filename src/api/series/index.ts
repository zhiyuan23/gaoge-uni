import { post } from '@/api'

// 获取活动主题列表
export const getSeriesList = () => post<any>('/wx/act/theme/list')

// 获取活动主题详情
export const getSeriesDetail = (code: string) => post<any>('/wx/act/theme/getByCode', { code })
