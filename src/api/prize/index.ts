import { mockPrizeData } from '../user/mock'

// 获取我的奖品
export const getMyPrizeList = () => {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve(mockPrizeData)
    }, 300)
  })
}
