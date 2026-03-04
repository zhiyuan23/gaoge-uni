import type { Profile } from '@/types'
import { getUserInfo, updateUserInfo } from '@/api'
import { storage } from '@/utils'

const useProfileStore = defineStore(
  'profile',
  () => {
    // 用户个人信息
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

    // 用户地址信息
    const addressInfo = ref({
      province: '',
      city: '',
      district: '',
    })

    const getGenderName = (gender: number | null): string => {
      if (gender === 1) return '男'
      if (gender === 0) return '女'
      return ''
    }

    // 获取用户信息
    const fetchProfile = async () => {
      try {
        const raw = await getUserInfo()

        userInfo.value = {
          ...raw,
          genderName: getGenderName(raw.gender),
        }
      }
      catch {
        storage.remove('sessionKey')
      }
    }

    // 更新用户信息
    const updateProfile = async (partial: Partial<Profile>) => {
      await updateUserInfo(partial)

      fetchProfile()
    }

    return {
      userInfo,
      addressInfo,

      fetchProfile,
      updateProfile,
    }
  },
  {
    persist: true,
  },
)

export default useProfileStore
