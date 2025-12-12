/** 系列代码 */
export type SeriesKey = 'ml' | 'zbqr' | 'zwcs'

export interface SeriesItem {
  /** 系列代码 */
  code: SeriesKey;
  /** 系列完整名称 */
  name: string;
  /** 短名称 */
  shortName?: string;
}
