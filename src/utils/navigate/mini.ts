interface NavigateMiniAppOptions {
  appId: string;
  path?: string;
  extraData?: Record<string, any>;
  envVersion?: 'release' | 'develop' | 'trial';
}

export function navigateToMiniApp({
  appId,
  path = '',
  extraData = {},
  envVersion = 'release',
}: NavigateMiniAppOptions) {
  return new Promise<void>((resolve, reject) => {
    uni.navigateToMiniProgram({
      appId,
      path,
      extraData,
      envVersion,
      success: () => resolve(),
      fail: (err) => {
        console.error('跳转外部小程序失败：', err)
        uni.showToast({
          title: '无法打开第三方小程序',
          icon: 'none',
        })
        reject(err)
      },
    })
  })
}
