import type { ILoadingOptions, IShowModalOptions, IShowToastOptions } from './types'

/**
 * 轻提示
 * @param {string} content 提示内容
 * @param {object} option 配置
 */
export function Toast(content: string, option: IShowToastOptions = {}) {
  uni.showToast({
    title: content,
    icon: 'none',
    mask: true,
    duration: 2000,
    ...option,
  })
}

/**
 * Loading 提示框
 * @param {string} content 提示内容
 */
export const Loading: ILoadingOptions = {
  show: (content = '加载中') => {
    uni.showLoading({
      title: content,
      mask: true,
    })
  },
  hide: () => {
    uni.hideLoading()
  },
}

/**
 * Dialog 提示框
 * @param {string} content 提示内容
 * @param {object} option 配置
 */
export function Dialog(content: string, option: IShowModalOptions = {}) {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: '温馨提示',
      content,
      showCancel: false,
      confirmColor: '#007E41',
      success(res) {
        if (res.confirm)
          resolve(res)
      },
      fail() {
        reject(new Error('Alert 调用失败 !'))
      },
      ...option,
    })
  })
}
