const useHomeStore = defineStore(
  'home',
  () => {
    const menuList = ref([])

    return { menuList }
  },
)

export default useHomeStore
