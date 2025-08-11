// utils/cloud.ts

/**
 * 封装云对象调用核心方法
 * @param cloudObjectName 云对象名称 (如 'teamAsset')
 * @param methodName 调用的方法名 (如 'getList')
 * @param params 方法参数
 * @param options 云对象配置选项
 */
export interface UniCloudResponse<T = any> {
  code: number;
  message?: string;
  data?: T;
}

/**
 * 云对象调用封装
 */
export async function callCloudObj<T = any>(
  cloudObjectName: string,
  methodName: string,
  params: Record<string, any> = {},
  options: UniCloud.ImportObjectOptions = {},
): Promise<UniCloudResponse<T>> {
  try {
    const cloudObj = uniCloud.importObject(cloudObjectName, {
      customUI: true, // 关闭默认 loading
      ...options,
    })

    const res: UniCloudResponse<T> = await cloudObj[methodName](params)

    if (res.code !== 200) {
      throw new Error(res.message || '请求失败')
    }

    return res
  }
  catch (error) {
    handleCloudError(error)
    throw error
  }
}

/**
 * 云函数调用封装
 */
export function callCloudFn<T = any>(
  functionName: string,
  data: Record<string, any> = {},
  options: Record<string, any> = {},
): Promise<T> {
  const requestData = { ...data }

  return new Promise((resolve, reject) => {
    uniCloud.callFunction({
      name: functionName,
      data: requestData,
      ...options,
      success: (res) => {
        const result: UniCloudResponse<T> = res.result || {}

        if (result.code !== 0) {
          const errorMsg = result.message || `云函数调用失败: ${functionName}`
          uni.showToast({ title: errorMsg, icon: 'none' })
          return reject(new Error(errorMsg))
        }

        resolve(result.data as T)
      },
      fail: (error) => {
        handleCloudError(error)
        reject(error)
      },
    })
  })
}

/**
 * 云端统一错误处理
 */
function handleCloudError(error: any): void {
  console.error('[Cloud Error]', error)

  const errMsg = error.message || '网络请求失败'
  uni.showModal({
    title: '请求失败',
    content: errMsg,
    showCancel: false,
    confirmText: '确定',
  })

  // 特殊错误处理（如登录过期）
  if (error.code === 401) {
    // TODO: 跳转登录逻辑
  }
}
