import type { HttpRequestConfig } from 'uview-plus/libs/luch-request'
import { md5 } from 'js-md5'
import Request from 'uview-plus/libs/luch-request'
import { APP_ID, CenterService, PREFIX } from '@/constants'
import { Loading, reLaunch, storage, Toast } from '@/utils'

const http = new Request()

const accessToken = ref<string>('')
const userIdentity = ref<string>('')

// ==================== 鉴权刷新 Promise 锁 ====================
/**
 * 刷新中的鉴权 Promise
 * - 存在：说明正在刷新，所有请求复用它
 * - 为 null：说明当前无刷新任务
 */
let refreshPromise: Promise<void> | null = null

/**
 * 确保华润鉴权已完成
 * - 已有 token：直接通过
 * - 刷新中：复用 Promise
 * - 否则：发起一次刷新
 */
const ensureHrAuth = (): Promise<void> => {
  // 已有有效鉴权
  if (accessToken.value && userIdentity.value) {
    return Promise.resolve()
  }

  // 如果已有刷新任务，直接等待
  if (refreshPromise) {
    return refreshPromise
  }

  // 创建新的刷新任务
  refreshPromise = initHuarunAuth()
    .catch((err) => {
      throw err
    })
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

// ==================== 全局默认配置 ====================
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
  // 确保鉴权完成
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

  if (accessToken.value) {
    Object.assign(headers, {
      'appKey': 'dicp',
      'cpm-client-type': 'wechat',
      'Authorization': `bearer ${accessToken.value}`,
      'cpm-user-identity': userIdentity.value,
      'thirdSessionKey': storage.get('sessionKey'),
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
  async (res: any) => {
    const custom = (res.config as HttpRequestConfig).custom
    if (custom?.loading) {
      Loading.hide()
    }

    const { code, content, msg } = res.data as {
      code: string;
      content?: any;
      msg?: string;
    }

    // 鉴权错误，进行重新鉴权
    const authErrors = [
      // 'Connection refused',
      'Full authentication is required to access this resource',
      '访问的接口没有权限',
    ]
    const isAuthError = authErrors.some(term => msg?.includes(term))

    if (isAuthError && !custom?.skipHRAuth) {
      accessToken.value = ''
      userIdentity.value = ''

      try {
        await ensureHrAuth()

        // 鉴权成功后，重新发起当前请求
        return http.request(res.config)
      }
      catch (authErr) {
        return Promise.reject(authErr)
      }
    }

    if (code === '00000') {
      return content
    }

    if (code === '50040') {
      if (!custom?.skipAuthCheck) {
        Toast('登录过期，请重新登录')
        setTimeout(() => {
          reLaunch('/pages/login/index?reload=1')
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

// ==================== 请求方法封装（支持泛型）====================
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

export const upload = <T = any>(
  url: string,
  data?: any,
  options?: RequestOption,
): Promise<T> => request<T>(url, 'UPLOAD', data, options)

export const download = <T = any>(
  url: string,
  data?: any,
  options?: RequestOption,
): Promise<T> => request<T>(url, 'DOWNLOAD', data, options)

export const get = <T = any>(
  url: string,
  params?: any,
  options?: RequestOption,
): Promise<T> => request<T>(url, 'GET', params, options)

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

// ==================== 私有辅助方法 (Private Helpers) ====================

/**
 * 初始化华润鉴权信息
 */
async function initHuarunAuth() {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const signStr = PREFIX + APP_ID + timestamp
  const sign = md5(signStr)

  try {
    const res: any = await portalAuth({ sign, timestamp })
    accessToken.value = res.accessToken
    userIdentity.value = res.userIdentity
  }
  catch (err) {
    console.error('鉴权初始化失败:', err)
    throw err
  }
}

/**
 * 内部鉴权接口请求
 */
function portalAuth(data: { sign: string; timestamp: string }) {
  return http.request<any>({
    url: '/wx/mem/userAuth/portal/auth',
    method: 'POST',
    data,
    custom: {
      skipHRAuth: true,
      toast: false,
    },
  })
}
