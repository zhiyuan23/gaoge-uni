import { mockPrizeData } from './mock'

// 获取我的奖品
export const getMyPrizeList = (data: any) => {
  console.log(data)
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve(mockPrizeData)
    }, 300)
  })
}
