import { getOpenId } from '@/api/auth'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const openId = ref<string>('')
    const unionid = ref<string>('')
    const token = ref<string>('')
    const sessionKey = ref<string>('')

    const isLogin = computed(() => !!openId.value)

    // 初始化 openId
    const initOpenid = async () => {
      if (openId.value) return

      try {
        const { code } = await uni.login()
        const res: any = await getOpenId({ wxCode: code })

        openId.value = res.openId
      }
      catch (err) {
        console.error('静默获取 openId 失败', err)
      }
    }

    // 设置登录信息
    const setAuthInfo = (data: {
      unionid?: string;
      token?: string;
      sessionKey?: string;
    }) => {
      unionid.value = data.unionid || ''
      token.value = data.token || ''
      sessionKey.value = data.sessionKey || ''
    }

    // 退出登录清空
    const logout = () => {
      openId.value = ''
      unionid.value = ''
      token.value = ''
      sessionKey.value = ''
    }

    return {
      openId,
      unionid,
      token,
      sessionKey,
      isLogin,
      initOpenid,
      setAuthInfo,
      logout,
    }
  },
  {
    persist: true,
  },
)

export default useAuthStore
