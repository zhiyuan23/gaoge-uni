export const goto = (url: string) => {
  return uni.navigateTo({ url })
}

export const replace = (url: string) => {
  return uni.redirectTo({ url })
}

export const switchTab = (url: string) => {
  return uni.switchTab({ url })
}

export const reLaunch = (url: string) => {
  return uni.reLaunch({ url })
}

export const back = (delta = 1) => {
  return uni.navigateBack({ delta })
}
