import type { providerType, UserState } from './types'
import { UserApi } from '@/api'
import { clearToken, setToken } from '@/utils/auth'

export const useUserStore = defineStore(
  'user',
  () => {
    const user_id = ref('')
    const user_name = ref('球星')
    const avatar = ref('')
    const token = ref('')

    const userState = reactive({
      user_id,
      user_name,
      avatar,
      token,
    })

    const userInfo = computed(() => ({
      user_id: user_id.value,
      user_name: user_name.value,
      avatar: avatar.value,
      token: token.value,
    }))

    function setInfo(partial: Partial<UserState>) {
      Object.assign(userState, partial)
    }

    function resetInfo() {
      user_id.value = ''
      user_name.value = '球星'
      avatar.value = ''
      token.value = ''
    }

    async function info() {
      const result = await UserApi.profile()
      setInfo(result)
    }

    async function login(loginForm: any) {
      try {
        const res = await UserApi.login(loginForm)
        const t = res.token
        if (t) setToken(t)
        return res
      }
      catch (err) {
        return Promise.reject(err)
      }
    }

    async function logout() {
      await UserApi.logout()
      resetInfo()
      clearToken()
    }

    function authLogin(provider: providerType = 'weixin') {
      return new Promise((resolve, reject) => {
        uni.login({
          provider,
          success: async (result: UniApp.LoginRes) => {
            if (result.code) {
              try {
                const res = await UserApi.loginByCode({ code: result.code })
                resolve(res)
              }
              catch (err) {
                reject(err)
              }
            }
            else {
              reject(new Error(result.errMsg))
            }
          },
          fail: (err: any) => {
            console.error(`login error: ${err}`)
            reject(err)
          },
        })
      })
    }

    return {
      user_id,
      user_name,
      avatar,
      token,
      userInfo,
      setInfo,
      resetInfo,
      info,
      login,
      logout,
      authLogin,
    }
  },
  {
    persist: true,
  },
)

export default useUserStore
