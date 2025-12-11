const useProfileStore = defineStore(
  'profile',
  () => {
    const userInfo = ref({})

    return {
      userInfo,
    }
  },
)

export default useProfileStore
