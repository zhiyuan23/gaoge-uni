const TokenKey = 'yzOpenId'
const TokenPrefix = 'Bearer '
function isLogin() {
  return !!uni.getStorageSync(TokenKey)
}
function getToken(key: string) {
  return uni.getStorageSync(key)
}
function setToken(key: string, token: string) {
  uni.setStorageSync(key, token)
}
function clearToken() {
  uni.removeStorageSync(TokenKey)
}
export {
  clearToken,
  getToken,
  isLogin,
  setToken,
  TokenPrefix,
}
