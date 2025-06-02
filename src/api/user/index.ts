import { callCloudFn } from '@/utils/cloud'

/**
 * 获取openid
 */
export async function fetchOpenid(code: string) {
  return callCloudFn('get-openid', { code })
}
