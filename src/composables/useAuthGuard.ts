import useAuthStore from '@/store/auth'
import { throttle } from '@/utils'

type AfterLoginAction = () => Promise<void> | void
type AuthApiAction<T = any> = () => Promise<T>

/**
 * 登录守卫：未登录时先完成登录，登录成功后再执行操作
 * 登录守卫API：仅在已登录状态下调用API，未登录时直接返回默认值
 */
export function useAuthGuard() {
  const authStore = useAuthStore()

  const withAuthThrottled = throttle(async (
    e: any = null,
    action: AfterLoginAction,
  ) => {
    if (authStore.isLogin) {
      return await action()
    }

    const phoneCode = e?.detail?.code || ''

    await authStore.login(phoneCode)
    await action()
  }, 800)

  const withAuth = async (
    e: any = null,
    action: AfterLoginAction,
  ) => {
    return withAuthThrottled(e, action)
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
