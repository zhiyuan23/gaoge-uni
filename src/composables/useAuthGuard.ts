import useAuthStore from '@/store/auth'
import { throttle } from '@/utils'

type AfterLoginAction = () => Promise<void> | void
type AuthApiAction<T = any> = () => Promise<T>

/**
 * 登录守卫：未登录时先完成登录，登录成功后再执行操作
 */
export function useAuthGuard() {
  const authStore = useAuthStore()

  const withAuthThrottled = throttle(async (
    e: any = null,
    action: AfterLoginAction,
    options: { silent?: boolean } = {},
  ) => {
    if (authStore.isLogin) {
      return await action()
    }

    const phoneCode = e?.detail?.code || ''

    try {
      await authStore.login(phoneCode, options.silent ?? false)
      await action()
    }
    catch (err) {
      console.warn('登录失败，已中断后续操作', err)
      if (!options.silent) {
        uni.showToast({ title: '登录失败，请稍后重试', icon: 'none' })
      }
    }
  }, 800)

  // 可选：保留原始版本（给需要不节流的场景用）
  const withAuth = async (
    e: any = null,
    action: AfterLoginAction,
    options: { silent?: boolean } = {},
  ) => {
    return withAuthThrottled(e, action, options)
  }

  const withAuthApi = async <T>(
    apiAction: AuthApiAction<T>,
    defaultValue: T | null = null as any,
  ): Promise<T | null> => {
    if (!authStore.isLogin) return defaultValue

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
