/**
 * 获取附近兑奖点列表 - 请求参数
 */
export interface NearbyShopListReq {
  words?: string; // 搜索关键词
  radius?: string; // 搜索半径（米），空字符串使用默认值，默认1000米
  lon: number; // 经度，例如 123.41632
  lat: number; // 纬度，例如 41.80556
  page: number; // 分页页码，默认 1
}

/**
 * 获取附近兑奖点列表 - 响应参数
 */
export interface NearbyShopListRes {
  rows: ShopItem[];
  total: number;
}

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
