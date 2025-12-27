import type { HttpRequestConfig } from 'uview-plus/libs/luch-request'
import Request from 'uview-plus/libs/luch-request'
import { CenterService } from '@/constants'
import useAuthStore from '@/store/auth'
import { Dialog, Loading, reLaunch, Toast } from '@/utils'

const http = new Request()

// ==================== 全局默认配置 ====================
/**
 * 全局请求配置
 */
http.setConfig((config: HttpRequestConfig) => {
  config.baseURL = import.meta.env.VITE_API_BASE_URL
  config.timeout = 15000
  config.header = {
    'content-type': 'application/x-www-form-urlencoded',
    ...config.header,
  }

  // H5 环境代理配置
  // #ifdef H5
  if (import.meta.env.VITE_APP_PROXY === 'true') {
    config.baseURL = import.meta.env.VITE_API_PREFIX
  }
  // #endif

  return config
})

// ==================== 请求拦截器 ====================
/**
 * 请求头
 * appKey: dicp
 * Authorization: bearer (accessToken)
 * cpm-user-identity: (userIdentity)
 * cpm-client-type: web
 * thirdSessionKey (sessionKey)
 */
http.interceptors.request.use((config: HttpRequestConfig) => {
  const auth = useAuthStore()

  const headers = {
    'appKey': 'dicp',
    'cpm-client-type': 'web',
    'Authorization': `bearer ${auth.accessToken}`,
    'cpm-user-identity': auth.userIdentity,
    'thirdSessionKey': auth.sessionKey,
  }

  config.header = {
    ...config.header,
    ...headers,
  }

  if (config.custom?.json) {
    config.header = {
      ...config.header,
      'content-type': 'application/json;charset=UTF-8',
    }
  }

  if (config.custom?.loading) {
    Loading.show()
  }

  if (import.meta.env.DEV) {
    let centerPath = CenterService.Activity

    if (config.data && config.data._center) {
      centerPath = config.data._center
      config.baseURL = import.meta.env.VITE_API_BASE_URL + centerPath
    }
  }

  return config
})

// ==================== 响应拦截器 ====================
/**
 * 响应拦截：统一处理成功/失败逻辑
 * - 成功（code === 0 或 '00000'）：直接返回 content（业务数据）
 * - 失败：toast 提示并 reject
 */
http.interceptors.response.use(
  (res: any) => {
    const custom = (res.config as HttpRequestConfig).custom
    if (custom?.loading) {
      Loading.hide()
    }

    const { code, content, msg } = res.data as { code: string; content?: any; msg?: string }

    if (code === '00000') {
      return content
    }

    if (code === '50040') {
      if (!custom?.skipAuthCheck) {
        Toast('登录过期，请重新登录')
        setTimeout(() => {
          useAuthStore().clear()
          reLaunch('/pages/login/index')
        }, 2000)
      }

      return Promise.reject(res.data)
    }

    if (custom?.toast !== false) {
      Dialog(msg || '请求失败')
    }

    return Promise.reject(res.data)
  },
  (err: any) => {
    const custom = (err.config as HttpRequestConfig)?.custom

    if (custom?.loading !== false) {
      Loading.hide()
    }

    if (custom?.toast !== false) {
      Toast('网络开小差了')
    }
    return Promise.reject(err)
  },
)

// ==================== 请求方法封装（支持泛型）================
type RequestOption = Omit<HttpRequestConfig, 'url' | 'method' | 'data'>

/**
 * 核心请求函数
 * @template T 业务返回数据类型
 * @returns Promise<T> 成功时直接返回 content（业务数据）
 */
const request = <T = any>(
  url: string,
  method: 'GET' | 'POST' | 'UPLOAD' | 'DOWNLOAD',
  data?: any,
  options?: RequestOption,
): Promise<T> => {
  return http.request<T>({
    url,
    method,
    data,
    ...options,
  }) as Promise<T>
}

export const upload = <T = any>(url: string, options?: RequestOption): Promise<T> =>
  request<T>(url, 'UPLOAD', options)

export const download = <T = any>(url: string, data?: any, options?: RequestOption): Promise<T> =>
  request<T>(url, 'DOWNLOAD', data, options)

export const get = <T = any>(url: string, params?: any, options?: RequestOption): Promise<T> =>
  request<T>(url, 'GET', params, options)

export const post = <T = any>(
  url: string,
  data: any = {},
  options?: RequestOption,
): Promise<T> => {
  const payload = {
    _center: CenterService.Activity,
    ...data,
  }
  return request<T>(url, 'POST', payload, options)
}

export const jsonPost = <T = any>(
  url: string,
  data: any = {},
  options?: RequestOption,
): Promise<T> => {
  const payload = {
    _center: CenterService.Activity,
    ...data,
  }
  return post<T>(url, payload, {
    ...options,
    custom: { ...(options?.custom || {}), json: true },
  })
}
