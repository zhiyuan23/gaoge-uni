import { getOpenId, getSession, isLoginApi } from '@/api'
import { reLaunch, storage } from '@/utils'

const useAuthStore = defineStore(
  'auth',
  () => {
    const isLogin = ref<boolean>(false)
    const isMember = ref<number>(0)
    const openId = ref<string>('')
    const loading = ref(false)

    const logout = () => {
      isLogin.value = false
      isMember.value = 0
      openId.value = ''
      storage.remove('sessionKey')
    }

    // 静默登录：获取 基础用户权限信息
    const silentLogin = async () => {
      await Promise.all([
        checkLogin(),
        initUserAuth(),
      ])
    }

    // 检查是否登录
    const checkLogin = async () => {
      try {
        await isLoginApi()
        isLogin.value = true
      }
      catch {
        isLogin.value = false
      }
    }

    // 获取 openId 和 会员状态
    const initUserAuth = async () => {
      const { code } = await uni.login()
      const res = await getOpenId({ wxCode: code })

      openId.value = res.openId
      isMember.value = res.isMember
    }

    // 授权登录
    const login = async (phoneCode = '', redirect = false) => {
      if (loading.value) return

      loading.value = true
      try {
        const { code } = await uni.login()
        const res = await getSession({ wxCode: code, phoneCode })

        // 使用直接缓存，避免request循环引入store
        storage.set('sessionKey', res.thirdSessionKey)
        isLogin.value = true
        isMember.value = 1

        if (redirect) {
          reLaunch('/pages/home/index')
        }
      }
      catch {
        // 初始化用户信息失败可能导致登录失败，进行静默登录重试
        silentLogin()
        throw new Error('登录失败')
      }
      finally {
        loading.value = false
      }
    }

    return {
      isLogin,
      isMember,
      openId,
      loading,

      silentLogin,
      initUserAuth,
      login,
      logout,
    }
  },
  {
    persist: {
      omit: ['loading'],
    },
  },
)

export default useAuthStore
