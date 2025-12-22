const useProfileStore = defineStore(
  'profile',
  () => {
    const userInfo = ref<any>({})

    const fetchUserInfo = () => {
      const data = {
        avatarUrl: 'https://youke2.picui.cn/s1/2025/12/20/69466e08eef0d.png',
        nickname: '韦德',
      }

      userInfo.value = data
    }

    return {
      userInfo,

      fetchUserInfo,
    }
  },
)

export default useProfileStore
