/** 奖品信息类型 */
export interface PrizeInfo {
  /** 扫码码 */
  scanCode: string;

  /** 主题代码（魔力：ml；至本清润：zbqr；佐味茶事：zwcs） */
  themeCode: string;

  /** 抽奖结果 pass: 通过 no_pass: 未通过 */
  drawResult: string;

  /** 抽奖失败原因代码 */
  drawResultErrorCode: string;

  /** 抽奖失败原因描述 */
  drawResultError: string;

  /** 扫码失败错误信息描述 */
  msg?: string;

  /** 是否已兑奖 0-否 1-是 2-已逾期 */
  isExchanged: 0 | 1 | 2 | null;

  /** 扫码时间 */
  scanTime: string;

  /** 兑奖时间 */
  exchangeTime: string;

  /** 兑奖截止时间 */
  exchangeEndTime: string;

  /** 活动开始时间 */
  eventBeginTime: string;

  /** 活动结束时间 */
  eventEndTime: string;

  /** 是否中奖 0-否 1-是（后端可能返回 null） */
  bingo: 0 | 1 | null;

  /** 奖品类型（小额红包 / 大额红包 / 1元换购） */
  prizeType: 'small_red_envelope' | 'large_red_envelope' | 'one_yuan_exchange' | null;

  /** 奖品名称 */
  prizeName: string;

  /** 奖品图片 URL */
  prizeImage: string;

  /** 加赠奖品描述（可能为 null） */
  bonus: string | null;

  /** 礼品券 ID（0 表示无，后端可能返回 null） */
  giftCouponId: string | null;

  /** 奖品状态（待兑换 / 已兑换 / 已过期） */
  status?: 'to_be_exchange' | 'exchanged' | 'expired';
}

/** 奖品信息默认值 */
export const defaultPrizeInfo: PrizeInfo = {
  scanCode: '',
  themeCode: '',
  drawResult: '',
  drawResultErrorCode: '',
  drawResultError: '',
  msg: '',
  isExchanged: 0,
  scanTime: '',
  exchangeTime: '',
  exchangeEndTime: '',
  eventBeginTime: '',
  eventEndTime: '',
  bingo: null,
  prizeType: null,
  prizeName: '',
  prizeImage: '',
  bonus: '',
  giftCouponId: '',
}
