const useUserStore = defineStore(
  // 唯一ID
  'home',
  () => {
    const banner_imgs = ref() // 轮播图

    function fetchBannerImgs() {
      banner_imgs.value = [
        {
          id: 1,
          url: '/static/images/poster/cartoon_3team.jpg',
        },
        {
          id: 2,
          url: '/static/images/poster/pixel_2team.jpg',
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
