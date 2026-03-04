import { useAuthStore } from '@/store'

type AfterLoginAction = () => Promise<void> | void
type AuthApiAction<T = any> = () => Promise<T>

/**
 * 登录守卫：未登录时先完成登录，登录成功后再执行操作
 * 登录守卫API：仅在已登录状态下调用API，未登录时直接返回默认值
 */
export const useAuthGuard = () => {
  const authStore = useAuthStore()

  const { isLogin } = storeToRefs(authStore)

  const withAuth = async (
    action: AfterLoginAction,
  ): Promise<{ success: boolean; reason?: string }> => {
    // 登录状态，直接下一步操作
    if (isLogin.value) {
      await action()
      return { success: true }
    }

    return { success: false, reason: 'not_login' }
  }

  const withAuthApi = async <T>(
    apiAction: AuthApiAction<T>,
    defaultValue: T | null = null as any,
  ): Promise<T | null> => {
    if (!isLogin.value) return defaultValue

    try {
      return await apiAction()
    }
    catch (err) {
      console.warn('接口调用失败', err)
      return defaultValue
    }
  }

  return {
    withAuth,
    withAuthApi,
  }
}
