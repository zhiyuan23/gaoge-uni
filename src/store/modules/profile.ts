import type { Profile } from '@/types'
import { getUserInfo, updateUserInfo } from '@/api'

const useProfileStore = defineStore(
  'profile',
  () => {
    const userInfo = ref<Profile>({
      userName: '',
      mobilePhone: '',
      fullPhone: '',
      nickName: '',
      realName: '',
      gender: 0,
      genderName: '',
      avatarUrl: '',
      birthDate: '',
    })

    // 获取用户信息
    const fetchProfile = async () => {
      userInfo.value = await getUserInfo()
    }

    // 更新用户信息
    const updateProfile = async (partial: Partial<Profile>) => {
      await updateUserInfo(partial)

      fetchProfile()
    }

    return {
      userInfo,

      fetchProfile,
      updateProfile,
    }
  },
  {
    persist: true,
  },
)

export default useProfileStore
