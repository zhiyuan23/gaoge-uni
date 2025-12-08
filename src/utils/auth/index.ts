const TokenKey = 'yzOpenId'
const TokenPrefix = 'Bearer '

const isLogin = () => {
  return !!uni.getStorageSync(TokenKey)
}
const getToken = (key: string) => {
  return uni.getStorageSync(key)
}
const setToken = (key: string, token: string) => {
  uni.setStorageSync(key, token)
}
const clearToken = () => {
  uni.removeStorageSync(TokenKey)
}
export {
  clearToken,
  getToken,
  isLogin,
  setToken,
  TokenPrefix,
}
