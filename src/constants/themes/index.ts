import type { SeriesKey } from '../serices/types'

// 抽奖弹窗背景图
import mlPopupBg from '@/static/images/lottery/popup-bg-ml.png'
import zbqrPopupBg from '@/static/images/lottery/popup-bg-zbqr.png'
import zwcsPopupBg from '@/static/images/lottery/popup-bg-zwcs.png'

// 抽奖弹窗购物车图片
import mlCartImg from '@/static/images/lottery/popup-cart-ml.png'
import zbqrCartImg from '@/static/images/lottery/popup-cart-zbqr.png'
import zwcsCartImg from '@/static/images/lottery/popup-cart-zwcs.png'

// 问题反馈背景图
import mlBg from '@/static/images/shop/bg-fb-ml.png'
import zbqrBg from '@/static/images/shop/bg-fb-zbqr.png'
import zwcsBg from '@/static/images/shop/bg-fb-zwcs.png'

export const themes: Record<SeriesKey, any> = {
  // 魔力
  ml: {
    name: '魔力',
    bgImg: mlBg,
    bgColor: '#E3EDD6',
    color: '#7FBE26',
    subColor: '#7FBE26',
    popupBg: mlPopupBg,
    cartImg: mlCartImg,
  },

  // 至本清润
  zbqr: {
    name: '至本清润',
    bgImg: zbqrBg,
    bgColor: '#FFFBD4',
    color: '#01613B',
    subColor: '#01613B',
    popupBg: zbqrCartImg,
    cartImg: zbqrPopupBg,
  },

  // 佐味茶事
  zwcs: {
    name: '佐味茶事',
    bgImg: zwcsBg,
    bgColor: '#F6F8BA',
    color: '#7EBC1D',
    subColor: '#7EBC1D',
    popupBg: zwcsPopupBg,
    cartImg: zwcsCartImg,
  },
}
