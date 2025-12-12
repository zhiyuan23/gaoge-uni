import type { HttpRequestConfig } from 'uview-plus/libs/luch-request'
import Request from 'uview-plus/libs/luch-request'
import useAuthStore from '@/store/auth'

const http = new Request()

// ==================== 全局默认配置 ====================
http.setConfig((config: HttpRequestConfig) => {
  config.baseURL = import.meta.env.VITE_API_BASE_URL
  config.timeout = 15000
  config.header = {
    'content-type': 'application/x-www-form-urlencoded',
    ...config.header,
  }

  // H5 代理
  // #ifdef H5
  if (import.meta.env.VITE_APP_PROXY === 'true') {
    config.baseURL = import.meta.env.VITE_API_PREFIX
  }
  // #endif

  return config
})

// ==================== 请求拦截 ====================
http.interceptors.request.use((config: HttpRequestConfig) => {
  const { sessionKey } = useAuthStore()

  // token
  if (sessionKey && config.header) {
    config.header.thirdSessionKey = sessionKey
  }

  // loading
  if (config.custom?.loading) {
    uni.showLoading({ title: '加载中', mask: true })
  }

  if (config.custom?.json) {
    config.header ??= {}
    config.header['content-type'] = 'application/json'
  }

  return config
})

// ==================== 响应拦截 ====================
http.interceptors.response.use(
  (res) => {
    const custom = (res.config as HttpRequestConfig).custom
    custom?.loading && uni.hideLoading()

    const { code, content, msg } = res.data as any

    if (code === 0 || code === '00000') return content

    // 默认 toast（除非 custom.toast === false）
    if (custom?.toast !== false) {
      uni.$u.toast(msg || msg || '请求失败')
    }
    return Promise.reject(res.data)
  },
  (err) => {
    const custom = (err.config as HttpRequestConfig)?.custom
    custom?.loading !== false && uni.hideLoading()

    if (custom?.toast !== false) {
      uni.$u.toast(err.errMsg || '网络开小差了')
    }
    return Promise.reject(err)
  },
)

// ==================== 标准 axios 风格封装================
type RequestOption = Omit<HttpRequestConfig, 'url' | 'method' | 'data'>

const request = <T = any>(url: string, method: 'GET' | 'POST' | 'UPLOAD' | 'DOWNLOAD', data?: any, options?: RequestOption) => {
  return http.request<T>({
    url,
    method,
    data,
    ...options,
  })
}

// 四个最常用方法
export const get = <T = any>(url: string, params?: any, options?: RequestOption) =>
  request<T>(url, 'GET', params, options)

export const post = <T = any>(url: string, data?: any, options?: RequestOption) =>
  request<T>(url, 'POST', data, options)

export const upload = <T = any>(url: string, data?: any, options?: RequestOption) =>
  request<T>(url, 'UPLOAD', data, options)

export const download = <T = any>(url: string, data?: any, options?: RequestOption) =>
  request<T>(url, 'DOWNLOAD', data, options)

export const jsonPost = <T = any>(url: string, data?: any, options?: RequestOption) =>
  post<T>(url, data, { ...options, custom: { ...(options?.custom || {}), json: true } })
