/** 系列代码 */
export type SeriesKey = 'ml' | 'zbqr' | 'zwcs'

/** 活动状态 */
export type ActivityStatus = 'not_started' | 'in_progress' | 'end'

export interface SeriesItem {
  /** 数据库主键ID */
  id?: string;

  /** 系列代码 */
  code: SeriesKey;

  /** 系列完整名称 */
  name: string;

  /** 活动状态 */
  status: ActivityStatus;

  /** 分享海报图片 */
  poster: string;

  /** 短名称 */
  shortName?: string;

  /** 开始时间 */
  beginTime?: string;

  /** 结束时间 */
  endTime?: string;

  /** 活动规则描述 */
  ruleDescription: string;
}
