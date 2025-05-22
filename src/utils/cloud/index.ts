// utils/cloud.ts
/**
 * 封装云对象调用核心方法
 * @param cloudObjectName 云对象名称 (如 'teamAsset')
 * @param methodName 调用的方法名 (如 'getList')
 * @param params 方法参数
 * @param options 云对象配置选项
 */
// 定义 UniCloudResponse 类型
export interface UniCloudResponse<T = any> {
  code: number;
  message?: string;
  data?: T;
}

export async function callCloudObj<T = any>(
  cloudObjectName: string,
  methodName: string,
  params?: Record<string, any>,
  options?: UniCloud.ImportObjectOptions,
): Promise<UniCloudResponse<T>> {
  try {
    const cloudObj = uniCloud.importObject(cloudObjectName, {
      customUI: true, // 关闭默认 loading
      ...options,
    })

    const res = await cloudObj[methodName](params)

    // 统一响应格式校验
    if (res.code !== 200) {
      throw new Error(res.message || '请求失败')
    }

    return res
  }
  catch (error) {
    // 统一错误处理
    handleCloudError(error)
    throw error // 抛出供业务层处理
  }
}

// 统一错误处理器
function handleCloudError(error: any) {
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
    // 跳转登录页逻辑
  }
}
