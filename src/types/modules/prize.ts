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

  /** 是否已兑奖 0-否 1-是 */
  isExchanged: 0 | 1;

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

  /** 奖品类型（小额红包：small_red_envelope / 大额红包：large_red_envelope / 1元换购：one_yuan_exchange） */
  prizeType: 'small_red_envelope' | 'large_red_envelope' | 'one_yuan_exchange';

  /** 奖品名称 */
  prizeName: string;

  /** 奖品图片 URL */
  prizeImage: string;

  /** 加赠奖品描述（可能为 null） */
  bonus: string | null;

  /** 礼品券 ID（0 表示无，后端可能返回 null） */
  giftCouponId: number | null;
}

/** 奖品信息默认值（未中奖、已参与过的瓶盖示例） */
export const defaultPrizeInfo: PrizeInfo = {
  scanCode: '', // 扫码码
  themeCode: '', // 主题代码
  drawResult: 'pass', // 抽奖结果：未通过
  drawResultErrorCode: '', // 抽奖失败原因代码
  drawResultError: '您本日参与次数已达上限，明天再来吧', // 抽奖失败原因描述
  isExchanged: 0, // 是否已兑奖：0-否
  scanTime: '2025年10月01日 13:59:59', // 扫码时间
  exchangeTime: '2025年10月01日 15:01:05', // 兑奖时间
  exchangeEndTime: '', // 兑奖截止时间
  eventBeginTime: '', // 活动开始时间
  eventEndTime: '', // 活动结束时间
  bingo: 0, // 是否中奖：0-否
  prizeType: 'large_red_envelope', // 奖品类型（即使未中奖也可保留一个默认类型，便于 UI 显示）
  prizeName: '888元', // 奖品名称（可作为占位或谢谢参与显示）
  prizeImage: 'https://youke2.picui.cn/s1/2025/12/22/6948eb0de6aa6.png', // 奖品图片（谢谢参与或默认图）
  bonus: '', // 加赠奖品描述
  giftCouponId: 2002932889307103200, // 礼品券 ID
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
