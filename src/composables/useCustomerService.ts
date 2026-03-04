import { useAuthStore, useProfileStore } from '@/store'

interface CustomerServiceOptions {
  storeName?: string;
  storeCode?: string;
}

export const useCustomerService = () => {
  const authStore = useAuthStore()
  const profileStore = useProfileStore()

  const openCustomerService = (options: CustomerServiceOptions = {}) => {
    const baseUrl = 'https://u-bjac.dezhuyun.com/dzfront/web/home'

    const data = {
      token: 'Q36neej6fqyu',
      showChat: 'true',
      layout: 'true',
      PHONE: profileStore.userInfo.fullPhone || '',
      custom_field_1: authStore.openId,
      custom_field_2: options.storeName || '',
      custom_field_3: options.storeCode || '',
      custom_field_4: profileStore.addressInfo.province || '',
    }

    const queryString = Object.entries(data)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    const finalUrl = `${baseUrl}?${queryString}`

    uni.navigateTo({
      url: `/pages/common/webview/index?url=${encodeURIComponent(finalUrl)}`,
    })
  }

  return {
    openCustomerService,
  }
}
