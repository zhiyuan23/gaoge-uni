import type { HttpRequestConfig } from 'uview-plus/libs/luch-request'
import Request from 'uview-plus/libs/luch-request'
import useAuthStore from '@/store/auth'
import { reLaunch, Toast } from '@/utils'

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
http.interceptors.request.use((config: HttpRequestConfig) => {
  const { sessionKey } = useAuthStore()

  if (sessionKey && config.header) {
    config.header.thirdSessionKey = sessionKey
  }

  if (config.custom?.loading) {
    uni.showLoading({ title: '加载中', mask: true })
  }

  if (config.custom?.json) {
    config.header ??= {}
    config.header['content-type'] = 'application/json'
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
      uni.hideLoading()
    }

    const { code, content, msg } = res.data as { code: string; content?: any; msg?: string }

    if (code === '00000') {
      return content
    }

    if (code === '50040') {
      Toast('登录过期，请重新登录')
      setTimeout(() => {
        reLaunch('/pages/login/index')
      }, 1500)
      useAuthStore().clear()

      return Promise.reject(res.data)
    }

    if (custom?.toast !== false) {
      uni.$u.toast(msg || '请求失败')
    }

    return Promise.reject(res.data)
  },
  (err: any) => {
    const custom = (err.config as HttpRequestConfig)?.custom

    if (custom?.loading !== false) {
      uni.hideLoading()
    }

    if (custom?.toast !== false) {
      uni.$u.toast(err.errMsg || '网络开小差了')
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

export const get = <T = any>(url: string, params?: any, options?: RequestOption): Promise<T> =>
  request<T>(url, 'GET', params, options)

export const post = <T = any>(url: string, data?: any, options?: RequestOption): Promise<T> =>
  request<T>(url, 'POST', data, options)

export const upload = <T = any>(url: string, data?: any, options?: RequestOption): Promise<T> =>
  request<T>(url, 'UPLOAD', data, options)

export const download = <T = any>(url: string, data?: any, options?: RequestOption): Promise<T> =>
  request<T>(url, 'DOWNLOAD', data, options)

export const jsonPost = <T = any>(url: string, data?: any, options?: RequestOption): Promise<T> =>
  post<T>(url, data, { ...options, custom: { ...(options?.custom || {}), json: true } })
