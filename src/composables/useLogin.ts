import useAuthStore from '@/store/auth'
import { reLaunch } from '@/utils'

function useLogin() {
  const authStore = useAuthStore()

  const loading = ref(false)

  // 提交登录
  const submit = async (data: { wxCode: string; phoneCode: string }) => {
    loading.value = true
    try {
      await authStore.login(data)
      reLaunch('/pages/home/index')
    }
    finally {
      loading.value = false
    }
  }

  // 会员-微信登录
  const wxLogin = async () => {
    const { code } = await uni.login()
    await submit({ wxCode: code, phoneCode: '' })
  }

  // 非会员-手机号授权登录
  const phoneLogin = async (e: any) => {
    const { code } = await uni.login()
    await submit({ wxCode: code, phoneCode: e.detail.code })
  }

  return {
    loading: readonly(loading),
    wxLogin,
    phoneLogin,
  }
}

export default useLogin
