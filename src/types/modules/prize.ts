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
  scanCode: '', // 扫码码
  themeCode: '', // 主题代码
  drawResult: 'no_pass', // 抽奖结果：通过-pass 未通过-no_pass
  drawResultErrorCode: '', // 抽奖失败原因代码
  // drawResultError: '您本日参与次数已达上限，明天再来吧', // 抽奖失败原因描述
  drawResultError: '该盖已中奖1元畅饮', // 抽奖失败原因描述
  isExchanged: 0, // 是否已兑奖：0-否
  scanTime: '2025年10月01日 13:59:59', // 扫码时间
  exchangeTime: '', // 兑奖时间
  exchangeEndTime: '2025年10月01日 15:01:05', // 兑奖截止时间
  eventBeginTime: '', // 活动开始时间
  eventEndTime: '', // 活动结束时间
  bingo: 1, // 是否中奖：0-否
  prizeType: 'small_red_envelope', // 奖品类型
  prizeName: '888元', // 奖品名称
  prizeImage: 'https://youke2.picui.cn/s1/2025/12/22/6948eb0de6aa6.png', // 奖品图片
  bonus: '', // 加赠奖品描述
  giftCouponId: '2002932889307103200', // 礼品券 ID
}

// 奖品图片测试版在线地址
// 至本清润-1元换购  https://youke2.picui.cn/s1/2025/12/22/6948eb0dc194a.png
// 至本清润-小额红包 https://youke2.picui.cn/s1/2025/12/22/6948eb0e2a874.png
// 至本清润-大额红包 https://youke2.picui.cn/s1/2025/12/22/6948ed7180381.png

// 魔力-1元换购 https://youke2.picui.cn/s1/2025/12/22/6948eb0de6aa6.png
// 魔力-小额红包 https://youke2.picui.cn/s1/2025/12/22/6948eb196ccd7.png
// 魔力-大额红包 https://youke2.picui.cn/s1/2025/12/22/6948eb0e2739f.png

// 佐味茶事-1元换购 https://youke2.picui.cn/s1/2025/12/22/6948eb1b32672.png
// 佐味茶事-小额红包 https://youke2.picui.cn/s1/2025/12/22/6948eb1b43aa1.png
// 佐味茶事-大额红包  https://youke2.picui.cn/s1/2025/12/22/6948eb1b20cef.png
