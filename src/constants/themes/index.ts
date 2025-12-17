import type { SeriesKey } from '@/types'

export const themes: Record<SeriesKey, any> = {
  // 魔力
  ml: {
    name: '魔力',
    bgColor: '#E3EDD6',
    color: '#7FBE26',
    titleColor: '#FFFFFF',
    phoneColor: '#7FBE26',
    mapPopBgColor: '#7FBE26',
    mapPopTitColor: '#FFFFFF',
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
    bgColor: '#FFFBD4',
    color: '#01613B',
    titleColor: '#01613B',
    phoneColor: '#864228',
    mapPopBgColor: '#F1D64B',
    mapPopTitColor: '#01613B',
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
    bgColor: '#F6F8BA',
    color: '#7EBC1D',
    titleColor: '#FFFFFF',
    phoneColor: '#7FBE26',
    mapPopBgColor: '#7FBE26',
    mapPopTitColor: '#FFFFFF',
    shopBtnColor: '#473729',
    redeem: {
      color: '#473729',
      subColor: '#473729',
      bgColor: '#F4F4B8',
      bgSubColor: '#FAFADE',
    },
  },
}
