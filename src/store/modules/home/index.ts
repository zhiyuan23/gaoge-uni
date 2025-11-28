const useHomeStore = defineStore(
  // 唯一ID
  'home',
  () => {
    const menuList = ref([])

    return { menuList }
  },
)

export default useHomeStore
