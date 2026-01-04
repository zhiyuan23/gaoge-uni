/**
 * 格式化距离显示
 * @param distance 距离值（单位：米）
 * @param decimal 小数位数，默认为 2
 */
export const formatDistance = (distance: number | string | undefined | null, decimal = 2): string => {
  const num = typeof distance === 'number' ? distance : Number.parseFloat(String(distance))

  if (Number.isNaN(num) || num <= 0) {
    return '0m'
  }

  if (num < 1000) {
    return `${Math.round(num)}m`
  }

  const km = num / 1000
  return `${Number.parseFloat(km.toFixed(decimal))}km`
}
