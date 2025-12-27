import type { SeriesKey } from '@/types'

// 系列主题色配置
export const THEMES: Record<SeriesKey, any> = {
  // 魔力
  ml: {
    name: '魔力',
    color: '#7FBE26',
    bgColor: '#ECEEF0',
    lotteryColor: '#F77600',
    titleColor: '#FFFFFF',
    phoneColor: '#7FBE26',
    mapPopBgColor: '#7FBE26',
    mapPopTitColor: '#FFFFFF',
    shopBgColor: '#E3EDD6',
    shopBtnColor: '#F77600',
    redeem: {
      color: '#000000',
      subColor: '#000000',
      bgColor: '#EAEDEE',
      bgSubColor: '#F5F7F7',
    },
  },

  // 至本清润
  zbqr: {
    name: '至本清润',
    color: '#01613B',
    bgColor: '#EEE59D',
    lotteryColor: '#83412C',
    titleColor: '#01613B',
    phoneColor: '#864228',
    mapPopBgColor: '#F1D64B',
    mapPopTitColor: '#01613B',
    shopBgColor: '#FFFBD4',
    shopBtnColor: '#864228',
    redeem: {
      color: '#874228',
      subColor: '#473729',
      bgColor: '#F0D442',
      bgSubColor: '#F9EEB3',
    },
  },

  // 佐味茶事
  zwcs: {
    name: '佐味茶事',
    color: '#7EBC1D',
    bgColor: '#F9F8D4',
    lotteryColor: '#473729',
    titleColor: '#FFFFFF',
    phoneColor: '#7FBE26',
    mapPopBgColor: '#7FBE26',
    mapPopTitColor: '#FFFFFF',
    shopBgColor: '#F6F8BA',
    shopBtnColor: '#473729',
    redeem: {
      color: '#473729',
      subColor: '#473729',
      bgColor: '#F4F4B8',
      bgSubColor: '#FAFADE',
    },
  },
}
