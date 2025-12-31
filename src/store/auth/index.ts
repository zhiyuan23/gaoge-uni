import { md5 } from 'js-md5'
import { getOpenId, getSession, hrAuth, isLoginApi } from '@/api'
import { APP_ID, PREFIX } from '@/constants'
import { reLaunch } from '@/utils'

const useAuthStore = defineStore(
  'auth',
  () => {
    const isLogin = ref<boolean>(false)
    const isMember = ref<number>(0)
    const openId = ref<string>('')
    const accessToken = ref<string>('')
    const userIdentity = ref<string>('')
    const sessionKey = ref<string>('')
    const unionid = ref<string>('')

    const loading = ref(false)

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

    // 静默登录：获取 基础用户权限信息
    const silentLogin = async () => {
      initUserAuth()
      checkLogin()
      initHuarunAuth()
    }

    // 检查是否登录
    const checkLogin = async () => {
      try {
        await isLoginApi()
        setLoginStatus(true)
      }
      catch {
        setLoginStatus(false)
      }
    }

    // 获取 openId 和 会员状态
    const initUserAuth = async () => {
      const { code } = await uni.login()
      const res = await getOpenId({ wxCode: code })

      setUserAuth(res.openId, res.isMember)
    }

    // 华润快捷鉴权
    const initHuarunAuth = async () => {
      const timestamp = Math.floor(Date.now() / 1000).toString()
      const signStr = PREFIX + APP_ID + timestamp
      const sign = md5(signStr)

      const res = await hrAuth({ sign, timestamp })

      setHuarunAuth(res.accessToken, res.userIdentity)
    }

    // 授权登录
    const login = async (phoneCode = '', needJump = false) => {
      if (loading.value) return

      loading.value = true

      const { code } = await uni.login()

      try {
        const res = await getSession({ wxCode: code, phoneCode })

        sessionKey.value = res.thirdSessionKey
        isLogin.value = true
        isMember.value = 1

        if (needJump) reLaunch('/pages/home/index')
      }
      finally {
        loading.value = false
      }
    }

    return {
      isLogin,
      isMember,
      openId,
      accessToken,
      userIdentity,
      sessionKey,
      unionid,
      loading,

      clear,
      setLoginStatus,
      setUserAuth,
      setHuarunAuth,
      silentLogin,
      login,
    }
  },
  {
    persist: {
      omit: ['loading'],
    },
  },
)

export default useAuthStore
