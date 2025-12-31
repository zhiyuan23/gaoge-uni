import type { Profile } from '@/types'
import { getUserInfo, updateUserInfo } from '@/api'

const useProfileStore = defineStore(
  'profile',
  () => {
    const profile = ref<Profile>({
      userName: '',
      mobilePhone: '',
      nickName: '',
      realName: '',
      gender: 0,
      genderName: '',
      avatarUrl: '',
      avatarUrlBase64: '',
      birthDate: '',
    })

    // 获取用户信息
    const fetchProfile = async () => {
      const res = await getUserInfo()
      profile.value = { ...profile.value, ...res }
    }

    // 更新用户信息
    const updateProfile = async (partial: Partial<Profile>) => {
      await updateUserInfo(partial)

      fetchProfile()
    }

    return {
      profile,

      fetchProfile,
      updateProfile,
    }
  },
)

export default useProfileStore
