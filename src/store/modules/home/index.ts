const useUserStore = defineStore(
  // 唯一ID
  'home',
  () => {
    const banner_imgs = ref() // 轮播图

    function fetchBannerImgs() {
      banner_imgs.value = [
        {
          id: 1,
          url: '/static/images/logo.jpg',
        },
        {
          id: 2,
          url: '/static/images/logo.jpg',
        },
        {
          id: 3,
          url: '/static/images/logo.jpg',
        },
      ]
    }

    return {
      banner_imgs,
      fetchBannerImgs,
    }
  },
)

export default useUserStore
