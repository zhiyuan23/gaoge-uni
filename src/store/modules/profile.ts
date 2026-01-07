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

    const getGenderName = (gender: number | null): string => {
      if (gender === 1) return '男'
      if (gender === 0) return '女'
      return ''
    }

    // 获取用户信息
    const fetchProfile = async () => {
      const raw = await getUserInfo()

      userInfo.value = {
        ...raw,
        genderName: getGenderName(raw.gender),
      }
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
