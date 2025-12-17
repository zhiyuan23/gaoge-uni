export interface LocationResult {
  latitude: number | string;
  longitude: number | string;
}

/**
 * 获取定位的公共方法
 * @param required 是否必须授权
 * @returns Promise<LocationResult>
 */
export async function useLocation(required: boolean = true): Promise<LocationResult | null> {
  const getLocation = (): Promise<LocationResult> => new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02', // 国测局坐标
      success: res => resolve({ latitude: res.latitude, longitude: res.longitude }),
      fail: reject,
    })
  })

  try {
    return await getLocation() // 成功直接返回真实位置
  }
  catch (err: any) {
    // 非授权类错误（GPS 未开、网络等）
    if (!err.errMsg?.includes('auth') && !err.errMsg?.includes('deny')) {
      uni.showToast({ title: '获取位置失败，请检查定位服务', icon: 'none' })
      return null
    }

    // 非必须授权：返回空位置
    if (!required) {
      return { latitude: '', longitude: '' }
    }

    // 必须授权：引导用户去设置
    const confirm = await new Promise<boolean>((resolve) => {
      uni.showModal({
        title: '需要定位权限',
        content: '请开启定位权限后重试',
        confirmText: '去设置',
        cancelText: '取消',
        success: res => resolve(res.confirm),
        fail: () => resolve(false),
      })
    })

    if (!confirm) return null

    const settingRes = await new Promise<any | null>((resolve) => {
      uni.openSetting({
        success: resolve,
        fail: () => resolve(null),
      })
    })

    if (settingRes?.authSetting['scope.userLocation']) {
      try {
        return await getLocation()
      }
      catch {
        uni.showToast({ title: '获取位置失败，请检查定位服务', icon: 'none' })
        return null
      }
    }

    // 用户最终没开权限
    return null
  }
}
