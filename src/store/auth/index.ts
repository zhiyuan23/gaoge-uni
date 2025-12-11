export const useAuthStore = defineStore(
  'auth',
  () => {
    const openid = ref<string>('')
    const unionid = ref<string>('')
    const token = ref<string>('')
    const sessionKey = ref<string>('')

    const isLogin = computed(() => !!openid.value)

    // 初始化 openid
    const initOpenid = async () => {
      if (openid.value) return

      try {
        const { code } = await uni.login()
        console.log('code', code)
        // const res = await getOpenid(code)
        const res = { openid: code }

        openid.value = res.openid
      }
      catch (err) {
        console.error('静默获取 openid 失败', err)
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
      openid.value = ''
      unionid.value = ''
      token.value = ''
      sessionKey.value = ''
    }

    return {
      openid,
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
