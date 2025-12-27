import { post, upload } from '@/api'
import { CenterService } from '@/constants'

// 图片上传
export const uploadFile = (filePath: string) => upload<any>('/wx/mem/user/upload', { filePath, name: 'file' })

// 地址逆解析
export const locationInfo = (data: any) => post<any>('/md/location/locationInfo', {
  ...data,
  _center: CenterService.Md,
}, {
  custom: { toast: false },
})

// 获取协议配置
export const getProtocolConfig = () => post<any>('/wx/mem/config/getProtocolConfig')
