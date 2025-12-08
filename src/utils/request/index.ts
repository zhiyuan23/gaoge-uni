// 引入配置
import type { HttpRequestConfig, HttpResponse } from 'uview-plus/libs/luch-request/index'
import type { IResponse } from './types'
import Request from 'uview-plus/libs/luch-request/index'
import { requestInterceptors, responseInterceptors } from './interceptors'

const http = new Request()

// 引入拦截器配置
export const setupRequest = () => {
  http.setConfig((defaultConfig: HttpRequestConfig) => {
    defaultConfig.baseURL = import.meta.env.VITE_API_BASE_URL
    defaultConfig.timeout = 15000

    // #ifdef H5
    if (import.meta.env.VITE_APP_PROXY === 'true') {
      defaultConfig.baseURL = import.meta.env.VITE_API_PREFIX
    }
    // #endif

    return defaultConfig
  })

  requestInterceptors(http)
  responseInterceptors(http)
}

export const request = <T = any>(config: HttpRequestConfig): Promise<T> => {
  return new Promise((resolve, reject) => {
    http
      .request(config)
      .then((res: HttpResponse<IResponse<T>>) => {
        console.log('[ res ] >', res)
        const { data } = res.data
        resolve(data as T)
      })
      .catch((err: any) => {
        console.error('[ err ] >', err)
        reject(err)
      })
  })
}

export const get = <T = any>(url: string, config?: HttpRequestConfig): Promise<T> =>
  request({ ...config, url, method: 'GET' })

export const post = <T = any>(url: string, config?: HttpRequestConfig): Promise<T> =>
  request({ ...config, url, method: 'POST' })

export const upload = <T = any>(url: string, config?: HttpRequestConfig): Promise<T> =>
  request({ ...config, url, method: 'UPLOAD' })

export const download = <T = any>(url: string, config?: HttpRequestConfig): Promise<T> =>
  request({ ...config, url, method: 'DOWNLOAD' })

export default setupRequest
