import { getOpenId, getSession, isLoginApi } from '@/api/auth'
import { Toast } from '@/utils'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const isMember = ref<number>(0)
    const openId = ref<string>('')

    const unionid = ref<string>('')
    const token = ref<string>('')
    const sessionKey = ref<string>('')

    const isLogin = ref<boolean>(false)

    // 初始化 openId
    const initOpenid = async () => {
      try {
        const { code } = await uni.login()
        const res: any = await getOpenId({ wxCode: code })

        isMember.value = res.isMember
        openId.value = res.openId
      }
      catch {
        Toast('获取 openId 失败')
      }
    }

    // 检查是否登录
    const checkLogin = async () => {
      const data = await isLoginApi()

      isLogin.value = !!data
    }

    // 手机号授权登录
    const login = async (data: { wxCode: string; phoneCode: string }) => {
      const res: any = await getSession(data)

      sessionKey.value = res.thirdSessionKey
      initOpenid()
    }

    // 退出登录清空
    const logout = () => {
      openId.value = ''
    }

    return {
      isMember,
      openId,
      unionid,
      token,
      sessionKey,
      isLogin,
      initOpenid,
      checkLogin,
      login,
      logout,
    }
  },
  {
    persist: true,
  },
)

export default useAuthStore
