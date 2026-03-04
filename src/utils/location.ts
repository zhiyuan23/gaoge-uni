import type { LocationResult } from '@/composables/useLocation'

/**
 * 将 useLocation 把位置信息赋值到 扫码/开奖入参对象 中
 * @param data - useLocation 返回的定位数据
 */
export const mapLocationToParams = (data: LocationResult) => {
  return {
    locationLat: data.lat,
    locationLon: data.lng,
    locationProvince: data.province.name,
    locationCity: data.city.name,
    locationDistrict: data.district.name,
    locationAdCode: data.adCode,
    locationStreet: data.street,
    locationAddress: data.fullAddress,
    locationFullAddress: data.fullAddress,
    provinceId: data.province.code,
    cityId: data.city.code,
    districtId: data.district.code,
    adCode: data.adCode,
  }
}

// 扫码开盖添加位置参数
export const assignLocation = <T extends object>(target: T, data: LocationResult) => {
  Object.assign(target, mapLocationToParams(data))
}
