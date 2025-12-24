import { getSession } from '@/api/auth'

const useAuthStore = defineStore(
  'auth',
  () => {
    const isLogin = ref(false)
    const isMember = ref(0)
    const openId = ref('')

    const accessToken = ref('')
    const userIdentity = ref('')

    const sessionKey = ref('')
    const unionid = ref('')

    const login = async (data: { wxCode: string; phoneCode: string }) => {
      const res: any = await getSession(data)

      sessionKey.value = res.thirdSessionKey
      isLogin.value = true
      isMember.value = 1
    }

    const clear = () => {
      isLogin.value = false
      isMember.value = 0
      openId.value = ''
      accessToken.value = ''
      userIdentity.value = ''
      sessionKey.value = ''
      unionid.value = ''
    }

    const setLoginStatus = (status: boolean) => {
      isLogin.value = status
    }

    const setUserAuth = (openIdVal: string, isMemberVal: number) => {
      openId.value = openIdVal
      isMember.value = isMemberVal
    }

    const setHuarunAuth = (accessTokenVal: string, userIdentityVal: string) => {
      accessToken.value = accessTokenVal
      userIdentity.value = userIdentityVal
    }

    return {
      isLogin: readonly(isLogin),
      isMember: readonly(isMember),
      openId: readonly(openId),
      accessToken: readonly(accessToken),
      userIdentity: readonly(userIdentity),
      sessionKey: readonly(sessionKey),
      unionid: readonly(unionid),

      login,
      clear,
      setLoginStatus,
      setUserAuth,
      setHuarunAuth,
    }
  },
  {
    persist: true,
  },
)

export default useAuthStore
