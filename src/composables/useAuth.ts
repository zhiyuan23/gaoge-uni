import useAuthStore from '@/store/auth'
/**
 * useAuth - 登录状态统一封装
 * 职责：只读 store + 提供页面常用方法，不存任何数据
 */
function useAuth(options: {
  /** 是否需要真实登录（手机号/绑定），默认 false（只检查 openId） */
  requireRealLogin?: boolean;
  /** 静默登录是否在 onMounted 时自动执行，默认 true（大多数页面都需要） */
  autoSilentLogin?: boolean;
} = {}) {
  const { autoSilentLogin = true } = options
  const authStore = useAuthStore()

  const isLogin = computed(() => !!authStore.openId)
  const openId = computed(() => authStore.openId)
  const token = computed(() => authStore.token)
  const sessionKey = computed(() => authStore.token)

  // 静默登录-获取openid
  const silentLogin = () => authStore.initOpenid()

  const login = () => {
    uni.navigateTo({ url: '/pages/login/index' })
  }

  const logout = () => {
    authStore.logout()
    uni.reLaunch({ url: '/pages/home/index' })
  }

  const checkAndLogin = () => {
    if (!isLogin.value) {
      silentLogin()
      return false
    }
    return true
  }

  if (autoSilentLogin) {
    onMounted(() => {
      if (!isLogin.value) {
        silentLogin()
      }
    })
  }

  return {
    isLogin,
    openId,
    token,
    sessionKey,
    silentLogin,
    login,
    logout,
    checkAndLogin,
  }
}

export default useAuth
