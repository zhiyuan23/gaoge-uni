import { post, upload } from '@/api/request'
import { CenterService } from '@/constants'

// 图片上传
export const uploadFile = (options: any) => {
  const { filePath, name = 'file', extraData = {} } = options
  return upload<any>('/wx/mem/common/upload', extraData, { filePath, name })
}

// 地址逆解析
export const locationInfo = (data: any) => post<any>('/wx/common/location/locationInfo', {
  ...data,
  _center: CenterService.Md,
}, {
  custom: { toast: false },
})

// 获取协议配置
export const getProtocolConfig = () => post<any>('/wx/mem/config/getProtocolConfig')
