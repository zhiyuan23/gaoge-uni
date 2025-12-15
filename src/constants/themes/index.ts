import type { SeriesKey } from '@/types'

// 抽奖弹窗背景图
import mlPopupBg from '@/static/images/lottery/popup-bg-ml.png'
import zbqrPopupBg from '@/static/images/lottery/popup-bg-zbqr.png'
import zwcsPopupBg from '@/static/images/lottery/popup-bg-zwcs.png'

// 抽奖弹窗购物车图片
import mlCartImg from '@/static/images/lottery/popup-cart-ml.png'
import zbqrCartImg from '@/static/images/lottery/popup-cart-zbqr.png'
import zwcsCartImg from '@/static/images/lottery/popup-cart-zwcs.png'

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
    popupBg: mlPopupBg,
    cartImg: mlCartImg,
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
    popupBg: zbqrCartImg,
    cartImg: zbqrPopupBg,
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
    popupBg: zwcsPopupBg,
    cartImg: zwcsCartImg,
  },
}
