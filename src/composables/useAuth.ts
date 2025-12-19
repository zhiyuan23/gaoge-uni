import useAuthStore from '@/store/auth'
import { reLaunch } from '@/utils'
/**
 * useAuth - 登录状态统一封装
 */
function useAuth() {
  const authStore = useAuthStore()

  const isLogin = computed(() => !!authStore.isLogin)
  const isMember = computed(() => !!authStore.isMember)
  const openId = computed(() => authStore.openId)

  // 静默登录-获取用户权限信息
  const silentLogin = () => {
    if (!openId.value) {
      authStore.initUserAuth()
      authStore.checkLogin()
    }
  }

  const logout = () => {
    authStore.clear()
    reLaunch('/pages/login/index')
  }

  return {
    isLogin,
    isMember,
    openId,

    silentLogin,
    logout,
  }
}

export default useAuth
