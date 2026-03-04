/**
 * @file THEMES 主题配置中心
 * @description 定义多品牌系列的视觉配置与组件微调参数。
 * @property {string} name       - 系列名称
 * @property {string} color      - 系列主要配色
 * @property {string} textColor  - 系列主要文字配色
 * @property {string} tipsColor  - 系列提示文字配色
 * @property {object} ui                 - 组件级微调配置容器
 * @property {object} ui.mainBtn         - 主按钮样式 (width, height, fontStyle)
 * @property {object} ui.subBtn          - 次按钮样式 (含 iconSize)
 * @property {object} ui.sideBtn         - 悬浮侧边按钮样式
 * @property {object} ui.luckBtn         - 抽奖弹窗操作按钮配置
 * @property {string[]} ui.luckClose     - 抽奖关闭按钮定位类名 [right, top]
 * @property {string[]} ui.luckTitle     - 抽奖标题装饰尺寸与定位 [w, h, top]
 * @property {string[]} ui.luckFooter    - 抽奖弹窗底部间距处理 [mt]
 * @property {string[]} ui.drawFooter    - 抽奖弹窗底部间距处理 [mt]
 */

import type { SeriesKey } from '@/types'

// 系列主题色配置
export const THEMES: Record<SeriesKey, any> = {
  // 至本清润
  zbqr: {
    name: '至本清润',
    color: '#00613B',
    textColor: '#83412C',
    tipsColor: '#FCF6CD',
    ui: {
      mainBtn: { width: '487', height: '103', fontStyle: ['-mt-2', 'ml-20', 'text-medium'], fontColor: '#FFFFFF' },
      subBtn: { width: '244', height: '74', fontStyle: ['text-30', 'text-medium'], fontColor: '#00613B', iconSize: '48rpx' },
      sideBtn: { width: '48', height: '146', fontStyle: ['text-26', 'px-5', 'text-medium'] },
      drawBtn: { width: '460', height: '104', fontStyle: ['text-medium'], btnStyle: ['top-2'] },
      drawFooter: ['mt-380'],
      luckBtn: { width: '540', height: '130', fontStyle: ['pl-10', 'text-44', 'text-medium'], fontColor: '#81402B', btnStyle: ['top-2'] },
      luckClose: ['right-30', 'top-80'],
      luckTitle: ['w-400', 'h-136', 'top-100'],
      luckFooter: ['mt-30'],
    },
  },

  // 佐味茶事
  zwcs: {
    name: '佐味茶事',
    color: '#91C337',
    textColor: '#366738',
    tipsColor: '#7EBC1D',
    ui: {
      mainBtn: { width: '540', height: '110', fontStyle: ['-mt-2', 'ml-20', 'text-bold'], fontColor: '#366738' },
      subBtn: { width: '244', height: '74', fontStyle: ['text-30', 'text-bold'], iconSize: '48rpx' },
      sideBtn: { width: '48', height: '146', fontStyle: ['text-26', 'px-5', 'text-medium'] },
      drawBtn: { width: '540', height: '110', fontStyle: ['text-bold'], btnStyle: ['top-2'] },
      drawFooter: ['mt-360'],
      luckBtn: { width: '540', height: '102', fontStyle: ['pl-10', 'text-42', 'text-bold'], fontColor: '#F1F3B4', btnStyle: ['top-2'] },
      luckClose: ['right-30', 'top-80'],
      luckTitle: ['w-530', 'h-136', 'top-90'],
      luckFooter: ['mt-60'],
    },
  },

  // 魔力
  ml: {
    name: '魔力',
    color: '#5ABE23',
    textColor: '#0F6213',
    tipsColor: '#7FBE26',
    ui: {
      mainBtn: { width: '452', height: '96', fontStyle: ['italic', 'text-bold', 'pt-2'], fontColor: '#0F6213' },
      subBtn: { width: '248', height: '80', fontStyle: ['italic', 'text-30', 'text-bold', 'pt-2'], iconSize: '48rpx' },
      sideBtn: { width: '50', height: '150', fontStyle: ['text-26', 'px-5', 'text-medium'] },
      drawBtn: { width: '452', height: '96', fontStyle: ['italic', 'text-bold'] },
      drawFooter: ['mt-420'],
      luckBtn: { width: '456', height: '96', fontStyle: ['italic', 'text-bold'], fontColor: '#0F6213' },
      luckClose: ['right-0', 'top-150'],
      luckFooter: ['mt-60'],
    },
  },
}
