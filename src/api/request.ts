import { md5 } from 'js-md5'
import { APP_ID, CenterService, PREFIX } from '@/constants'
import { Loading, reLaunch, storage, Toast } from '@/utils'

type RequestMethod = 'GET' | 'POST' | 'UPLOAD' | 'DOWNLOAD'

interface RequestCustom {
  loading?: boolean;
  toast?: boolean;
  json?: boolean;
  skipHRAuth?: boolean;
  skipAuthCheck?: boolean;
}

interface RequestOption {
  timeout?: number;
  header?: Record<string, string>;
  custom?: RequestCustom;
  filePath?: string;
  name?: string;
}

interface InternalRequestConfig extends RequestOption {
  url: string;
  method: RequestMethod;
  data?: any;
}

interface RequestResult<T = any> {
  code: string;
  content?: T;
  msg?: string;
}

const accessToken = ref<string>('')
const userIdentity = ref<string>('')
const defaultTimeout = 10000

// ==================== 鉴权刷新 Promise 锁 ====================
let refreshPromise: Promise<void> | null = null

const ensureHrAuth = (): Promise<void> => {
  if (accessToken.value && userIdentity.value) {
    return Promise.resolve()
  }

  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = initHuarunAuth()
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

const normalizeBaseUrl = (centerPath?: string) => {
  let baseURL = import.meta.env.VITE_API_BASE_URL

  // #ifdef H5
  if (import.meta.env.VITE_APP_PROXY === 'true') {
    baseURL = import.meta.env.VITE_API_PREFIX
  }
  // #endif

  return `${baseURL}${centerPath || CenterService.Activity}`
}

const createHeaders = (config: InternalRequestConfig) => {
  const headers: Record<string, string> = {
    'content-type': 'application/x-www-form-urlencoded',
    ...(config.header || {}),
  }

  if (config.custom?.json) {
    headers['content-type'] = 'application/json;charset=UTF-8'
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

  return headers
}

const parseResponseData = (raw: any): RequestResult => {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    }
    catch {
      return { code: '50000', msg: raw }
    }
  }
  return raw || { code: '50000', msg: '请求失败' }
}

const requestCore = async <T = any>(config: InternalRequestConfig): Promise<T> => {
  if (!config.custom?.skipHRAuth) {
    try {
      await ensureHrAuth()
    }
    catch {
      Toast('系统初始化失败，请稍后重试')
      return Promise.reject(new Error('华润鉴权失败'))
    }
  }

  if (config.custom?.loading) {
    Loading.show()
  }

  const centerPath = config.data?._center ?? CenterService.Activity
  const baseURL = normalizeBaseUrl(centerPath)
  const headers = createHeaders(config)
  const timeout = config.timeout ?? defaultTimeout

  try {
    let response: any

    if (config.method === 'UPLOAD') {
      response = await new Promise<UniApp.UploadFileSuccessCallbackResult>((resolve, reject) => {
        uni.uploadFile({
          url: `${baseURL}${config.url}`,
          filePath: config.filePath || '',
          name: config.name || 'file',
          formData: config.data,
          header: headers,
          timeout,
          success: resolve,
          fail: reject,
        })
      })
    }
    else if (config.method === 'DOWNLOAD') {
      response = await new Promise<UniApp.DownloadSuccessData>((resolve, reject) => {
        uni.downloadFile({
          url: `${baseURL}${config.url}`,
          timeout,
          success: resolve,
          fail: reject,
        })
      })
    }
    else {
      const method = config.method as 'GET' | 'POST'
      response = await new Promise<UniApp.RequestSuccessCallbackResult>((resolve, reject) => {
        uni.request({
          url: `${baseURL}${config.url}`,
          method,
          data: config.data,
          header: headers,
          timeout,
          success: resolve,
          fail: reject,
        })
      })
    }

    const resData = parseResponseData((response as any).data)
    const { code, content, msg } = resData

    const isAuthError = [
      'Full authentication is required to access this resource',
      '访问的接口没有权限',
    ].some(term => msg?.includes(term))

    if (isAuthError && !config.custom?.skipHRAuth) {
      accessToken.value = ''
      userIdentity.value = ''
      await ensureHrAuth()
      return requestCore<T>(config)
    }

    if (code === '00000') {
      return content as T
    }

    if (code === '50040') {
      if (!config.custom?.skipAuthCheck) {
        Toast('登录过期，请重新登录')
        setTimeout(() => {
          reLaunch('/pages/login/index?reload=1')
        }, 2000)
      }
      return Promise.reject(resData)
    }

    if (config.custom?.toast !== false) {
      Toast(msg || '请求失败')
    }
    return Promise.reject(resData)
  }
  catch (err: any) {
    if (config.custom?.toast !== false) {
      Toast('网络开小差了')
    }
    return Promise.reject(err)
  }
  finally {
    if (config.custom?.loading) {
      Loading.hide()
    }
  }
}

const request = <T = any>(
  url: string,
  method: RequestMethod,
  data?: any,
  options?: RequestOption,
): Promise<T> => {
  return requestCore<T>({
    url,
    method,
    data,
    ...options,
  })
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

async function initHuarunAuth() {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const signStr = PREFIX + APP_ID + timestamp
  const sign = md5(signStr)

  const res: any = await portalAuth({ sign, timestamp })
  accessToken.value = res.accessToken
  userIdentity.value = res.userIdentity
}

function portalAuth(data: { sign: string; timestamp: string }) {
  return request<any>(
    '/wx/mem/userAuth/portal/auth',
    'POST',
    data,
    {
      custom: {
        skipHRAuth: true,
        toast: false,
      },
    },
  )
}
