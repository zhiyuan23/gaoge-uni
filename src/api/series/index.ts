import { post } from '@/api/request'

// 获取活动主题列表
export const getSeriesList = () => post<any>('/wx/mem/act/theme/list')

// 获取活动主题详情
export const getSeriesDetail = (code: string) => post<any>('/wx/mem/act/theme/getByCode', { code })
