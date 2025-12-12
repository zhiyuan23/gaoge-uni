// 模拟沈阳区域坐标（你可以改成活动实际中心点）
const lat = 41.8057
const lng = 123.4315

const mockData = {
  list: Array.from({ length: 20 }).fill(null).map((_, i) => ({
    id: i + 1000,
    name: `沈阳昂立信息园门店${i + 1}号店`,
    lat: lat + Math.random() * 0.12 - 0.06, // 散布在沈阳区域
    lng: lng + Math.random() * 0.15 - 0.075,
    address: `沈阳市和平区青年大街${i + 1}号昂立信息园内`,
    cover: '/static/images/shop/img-store.png',
    distance: (Math.random() * 8 + 0.3).toFixed(1), // 0.3~8.3km
  })),
}

export const getShopList = () => {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, 600) // 模拟网络延迟
  })

  // return post<ShopListRes>('/shop/point/list', {
  //   // 参数示例
  //   lat: uni.getStorageSync('userLat') || lat,
  //   lng: uni.getStorageSync('userLng') || lng,
  // })
}
