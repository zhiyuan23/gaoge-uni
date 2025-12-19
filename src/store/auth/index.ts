import { getOpenId, getSession, isLoginApi } from '@/api/auth'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const isLogin = ref<boolean>(false)
    const isMember = ref<number>(0)
    const openId = ref<string>('')
    const sessionKey = ref<string>('')

    const unionid = ref<string>('')

    // 检查是否登录
    const checkLogin = async () => {
      await isLoginApi()

      isLogin.value = true
    }

    // 初始化 用户权限信息 （openId / isMember）
    const initUserAuth = async () => {
      const { code } = await uni.login()
      const res: any = await getOpenId({ wxCode: code })

      isMember.value = res.isMember
      openId.value = res.openId
    }

    // 授权登录
    const login = async (data: { wxCode: string; phoneCode: string }) => {
      const res: any = await getSession(data)

      sessionKey.value = res.thirdSessionKey
      isLogin.value = true
      isMember.value = 1
    }

    // 退出登录清空
    const clear = () => {
      uni.clearStorage()
    }

    return {
      isLogin,
      isMember,
      openId,
      unionid,
      sessionKey,

      checkLogin,
      initUserAuth,
      login,
      clear,
    }
  },
  {
    persist: true,
  },
)

export default useAuthStore
