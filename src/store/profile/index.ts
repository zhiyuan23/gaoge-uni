import { getUserInfo, updateUserInfo } from '@/api/profile'

const useProfileStore = defineStore(
  'profile',
  () => {
    const profile = ref<any>(null)

    // 获取用户信息
    const fetchProfile = async () => {
      const res = await getUserInfo()

      profile.value = res
    }

    // 更新用户信息
    const updateProfile = async (data: any) => {
      const res = await updateUserInfo(data)

      profile.value = res
    }

    return {
      profile,

      fetchProfile,
      updateProfile,
    }
  },
  {
    persist: true,
  },
)

export default useProfileStore
