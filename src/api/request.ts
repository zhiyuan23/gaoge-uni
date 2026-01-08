import type { HttpRequestConfig } from 'uview-plus/libs/luch-request'
import Request from 'uview-plus/libs/luch-request'
import { CenterService } from '@/constants'
import { useAuthStore } from '@/store'
import { Loading, reLaunch, Toast } from '@/utils'

const http = new Request()

// ==================== 刷新鉴权相关状态 ====================
let isRefreshing = false
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = []

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(null)
  })
  failedQueue = []
}

// 确保鉴权完成
const ensureHrAuth = (): Promise<void> => {
  const auth = useAuthStore()

  // 如果已经有有效的 accessToken 和 userIdentity，直接通过
  if (auth.accessToken && auth.userIdentity) {
    return Promise.resolve()
  }

  // 如果正在刷新中，则等待队列
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    })
  }

  // 开始刷新
  isRefreshing = true

  return new Promise((resolve, reject) => {
    auth.initHuarunAuth()
      .then(() => {
        processQueue()
        resolve()
      })
      .catch((err) => {
        processQueue(err)
        reject(err)
      })
      .finally(() => {
        isRefreshing = false
      })
  })
}

// ==================== 全局默认配置 ====================
/**
 * 全局请求配置
 */
http.setConfig((config: HttpRequestConfig) => {
  config.baseURL = import.meta.env.VITE_API_BASE_URL
  config.timeout = 10000
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
http.interceptors.request.use(async (config: HttpRequestConfig) => {
  const auth = useAuthStore()

  // 如果不是需要跳过的接口，确保华润鉴权完成
  if (!config.custom?.skipHRAuth) {
    try {
      await ensureHrAuth()
    }
    catch {
      Toast('系统初始化失败，请稍后重试')
      return Promise.reject(new Error('华润鉴权失败'))
    }
  }

  const headers = config.header = config.header ?? {}

  if (config.custom?.json) {
    headers['content-type'] = 'application/json;charset=UTF-8'
  }

  if (config.custom?.loading) {
    Loading.show()
  }

  if (auth.accessToken) {
    Object.assign(headers, {
      'appKey': 'dicp',
      'cpm-client-type': 'wechat',
      'Authorization': `bearer ${auth.accessToken}`,
      'cpm-user-identity': auth.userIdentity,
      'thirdSessionKey': auth.sessionKey,
    })
  }

  // 拼接微服务路径
  const centerPath = config.data?._center ?? CenterService.Activity
  config.baseURL = import.meta.env.VITE_API_BASE_URL + centerPath

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
          useAuthStore().silentLogin()
          reLaunch('/pages-account/login/index')
        }, 2000)
      }

      return Promise.reject(res.data)
    }

    if (custom?.toast !== false) {
      Toast(msg || '请求失败')
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

export const upload = <T = any>(url: string, data?: any, options?: RequestOption): Promise<T> =>
  request<T>(url, 'UPLOAD', data, options)

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
