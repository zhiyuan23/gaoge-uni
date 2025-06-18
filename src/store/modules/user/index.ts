import type { providerType, UserState } from './types'
import { DemoApi } from '@/api'
import { getOpenidApi } from '@/api/user'
import { clearToken, isLogin, setToken } from '@/utils/auth'

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
      const result = await DemoApi.profile()
      setInfo(result)
    }

    async function login(loginForm: any) {
      try {
        const res = await DemoApi.login(loginForm)
        const t = res.token
        if (t) setToken(t)
        return res
      }
      catch (err) {
        return Promise.reject(err)
      }
    }

    async function logout() {
      await DemoApi.logout()
      resetInfo()
      clearToken()
    }

    async function authLogin(provider: providerType = 'weixin') {
      if (isLogin()) return

      return new Promise((resolve, reject) => {
        uni.login({
          provider,
          success: async ({ code }) => {
            try {
              const res = await getOpenidApi(code)
              const t = res.openid
              if (t) {
                setToken(t)
                resolve(t)
              }
              else {
                reject(new Error('No openid received'))
              }
            }
            catch (err) {
              reject(err)
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
  { persist: true },
)

export default useUserStore
