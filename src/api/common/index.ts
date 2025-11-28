/**
 * 通用接口
 */
import type { SendCodeReq, SendCodeRes, UploadRes } from './types'
import { post, upload } from '@/utils/request'

// 文件上传
export const uploadFile = (filePath: string) =>
  upload<UploadRes>('/common/upload', { filePath, name: 'file' })

// 发送验证码
export const sendCode = (data: SendCodeReq) => post<SendCodeRes>('/sendCode', { data })

// 上传图片
export async function uploadToCloud(tempFilePath: string, path: string = 'image'): Promise<string> {
  const cloudPath = `${path}/${Date.now()}.jpg`

  const res = await uniCloud.uploadFile({
    filePath: tempFilePath,
    cloudPath,
  })

  return res.fileID
}
