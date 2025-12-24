import { md5 } from 'js-md5'
import { getOpenId, hrAuth, isLoginApi } from '@/api/auth'
import useAuthStore from '@/store/auth'
import { reLaunch } from '@/utils'

const PREFIX = 'dicp'
const APP_ID = 'wx027ab4853c647162'

export function useAuth() {
  const authStore = useAuthStore()

  const isLogin = computed(() => authStore.isLogin)
  const isMember = computed(() => authStore.isMember > 0)
  const openId = computed(() => authStore.openId)
  const accessToken = computed(() => authStore.accessToken)
  const userIdentity = computed(() => authStore.userIdentity)

  // 静默登录：获取 openId 和会员状态
  const silentLogin = async () => {
    initUserAuth()
    checkLogin()
    initHuarunAuth()
  }

  // 检查是否登录
  const checkLogin = async () => {
    try {
      await isLoginApi()
      authStore.setLoginStatus(true)
    }
    catch {
      authStore.setLoginStatus(false)
    }
  }

  // 获取 openId 和 会员状态
  const initUserAuth = async () => {
    if (openId.value) return

    const { code } = await uni.login()
    const res = await getOpenId({ wxCode: code })

    authStore.setUserAuth(res.openId, res.isMember)
  }

  // 华润快捷鉴权
  const initHuarunAuth = async () => {
    if (accessToken.value && userIdentity.value) return

    const timestamp = Math.floor(Date.now() / 1000).toString()
    const signStr = PREFIX + APP_ID + timestamp
    const sign = md5(signStr)

    const res = await hrAuth({ sign, timestamp })

    authStore.setHuarunAuth(res.accessToken, res.userIdentity)
  }

  // 完整登出
  const logout = () => {
    authStore.clear()
    reLaunch('/pages/login/index')
  }

  return {
    isLogin,
    isMember,
    openId,

    silentLogin,
    checkLogin,
    initUserAuth,
    initHuarunAuth,
    logout,
  }
}
