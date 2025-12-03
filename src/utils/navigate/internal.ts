export const navigateTo = (url: string) => {
  return uni.navigateTo({ url })
}

export const redirectTo = (url: string) => {
  return uni.redirectTo({ url })
}

export const switchTab = (url: string) => {
  return uni.switchTab({ url })
}

export const reLaunch = (url: string) => {
  return uni.reLaunch({ url })
}

export const navigateBack = (delta = 1) => {
  return uni.navigateBack({ delta })
}
