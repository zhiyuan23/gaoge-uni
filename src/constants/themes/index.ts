import type { SeriesKey } from '../serices/types'

import type { ThemeModule } from './types'
import mlBg from '@/static/images/shop/bg-fb-ml.png'
import zbqrBg from '@/static/images/shop/bg-fb-zbqr.png'
import zwcsBg from '@/static/images/shop/bg-fb-zwcs.png'

export type { ThemeModule }

export const themes: Record<SeriesKey, ThemeModule> = {
  // 魔力
  ml: {
    bgImg: mlBg,
    bgColor: '#E3EDD6',
    color: '#7FBE26',
    subColor: '',
  },

  // 至本清润
  zbqr: {
    bgImg: zbqrBg,
    bgColor: '#F6F8BA',
    color: '#01613B',
    subColor: '#01613B',
  },

  // 佐味茶事
  zwcs: {
    bgImg: zwcsBg,
    bgColor: '#FFFBD4',
    color: '#7EBC1D',
    subColor: '#7EBC1D',
  },
}
