const useMyPrizeStore = defineStore(
  'myPrize',
  () => {
    const menuList = ref([])

    return { menuList }
  },
)

export default useMyPrizeStore
