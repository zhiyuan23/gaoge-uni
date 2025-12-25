import { post, upload } from '@/api'

// 图片上传
export const uploadFile = (filePath: string) => upload<any>('/wx/mem/user/upload', { filePath, name: 'file' })

// 获取协议配置
export const getMyPrizeDetail = () => post<any>('/wx/mem/config/getProtocolConfig')
