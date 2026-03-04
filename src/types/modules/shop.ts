/**
 * 兑奖点项
 */
export interface ShopItem {
  id: number | string;
  name: string;
  address: string;
  distance?: string;
  lon?: number;
  lat?: number;
}
