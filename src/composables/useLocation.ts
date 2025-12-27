import { locationInfo } from '@/api/common'

/**
 * 定位结果完整接口（包含逆解析信息）
 */
export interface LocationResult {
  lat: string;
  lng: string;
  province?: {
    code: string;
    name: string;
  };
  city?: {
    code: string;
    name: string;
  };
  district?: {
    code: string;
    name: string;
    adCode: string;
  };
}

/**
 * 获取用户当前位置 + 可选逆地理编码
 * @param required 是否必须获取定位权限（false 时未授权返回空位置对象）
 * @param withReverse 是否进行逆地理编码获取省市区（默认 true）
 * @returns Promise<LocationResult> 始终返回 LocationResult 对象，失败时返回空值对象
 */
export async function useLocation(
  required: boolean = true,
  withReverse: boolean = true,
): Promise<LocationResult> {
  const emptyResult: LocationResult = {
    lat: '',
    lng: '',
  }

  // 内部获取经纬度的函数
  const getBasicLocation = (): Promise<{ lat: string; lng: string }> =>
    new Promise((resolve, reject) => {
      uni.getLocation({
        type: 'gcj02',
        success: res =>
          resolve({
            lat: res.latitude.toString(),
            lng: res.longitude.toString(),
          }),
        fail: reject,
      })
    })

  let basic: { lat: string; lng: string } = { lat: '', lng: '' }

  try {
    basic = await getBasicLocation()
  }
  catch (err: any) {
    const isAuthDenied
      = err.errMsg?.includes('auth')
        || err.errMsg?.includes('deny')
        || err.errMsg?.includes('authorize no response')

    if (!isAuthDenied) {
      uni.showToast({ title: '获取位置失败，请检查定位服务', icon: 'none' })
      return emptyResult
    }

    if (!required) {
      return emptyResult
    }

    // 必须权限：引导开启
    const confirm = await new Promise<boolean>((resolve) => {
      uni.showModal({
        title: '需要定位权限',
        content: '请开启定位权限后重试',
        confirmText: '去设置',
        cancelText: '取消',
        success: res => resolve(!!res.confirm),
        fail: () => resolve(false),
      })
    })

    if (!confirm) {
      return emptyResult
    }

    const settingRes = await new Promise<any | null>((resolve) => {
      uni.openSetting({
        success: resolve,
        fail: () => resolve(null),
      })
    })

    if (!settingRes?.authSetting?.['scope.userLocation']) {
      uni.showToast({ title: '定位权限未开启', icon: 'none' })
      return emptyResult
    }

    try {
      basic = await getBasicLocation()
    }
    catch {
      uni.showToast({ title: '获取位置失败，请检查定位服务', icon: 'none' })
      return emptyResult
    }
  }

  // 到这里 basic 有值或仍是空对象

  if (!withReverse) {
    return basic
  }

  // 需要逆解析
  try {
    const res = await locationInfo({
      latitude: Number(basic.lat),
      longitude: Number(basic.lng),
    })

    return {
      ...basic,
      province: {
        code: res.provinceId || '',
        name: res.provinceName || '',
      },
      city: {
        code: res.cityId || '',
        name: res.cityName || '',
      },
      district: {
        code: res.districtId || '',
        name: res.districtName || '',
        adCode: res.adCode || '',
      },
    }
  }
  catch (reverseErr) {
    console.warn('逆地理编码失败:', reverseErr)
    uni.showToast({ title: '获取城市信息失败，仅使用经纬度', icon: 'none' })
    return basic // 逆解析失败返回基本经纬度
  }
}
