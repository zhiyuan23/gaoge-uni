/** 小程序 AppID */
export const APP_ID = 'wx027ab4853c647162'

/** 应用前缀 */
export const PREFIX = 'dicp'

/** 图片地址 */
export const IMG_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL

/** 微服务中心地址枚举 */
export enum CenterService {
  /** 活动中心 */
  Activity = '/crbr-wmhy-act-activity-center',

  /** 用户中心（md-center） */
  Md = '/crbr-wmhy-act-md-center',
}

/** 第三方小程序配置 */
export const THIRD_PARTY_APPS = {
  MALL: {
    appId: 'wxc16e25946bdc8599',
    path: 'pages/home/index',
  },
} as const
