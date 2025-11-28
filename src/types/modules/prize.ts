/** 奖品信息类型 */
export interface PrizeInfo {
  status: string;
  type: string;
  title?: string;
  isExchanged?: boolean;
  scanTime?: string;
  exchangeTime?: string;
}

/** 奖品信息默认值 */
export const defaultPrizeInfo: PrizeInfo = {
  status: '',
  type: '',
  title: '',
  isExchanged: false,
  scanTime: '',
  exchangeTime: '',
}
