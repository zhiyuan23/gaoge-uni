const useUserStore = defineStore(
  // 唯一ID
  'home',
  () => {
    const banner_imgs = ref() // 轮播图
    const playing_team = ref()

    function getBannerImgs() {
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

    function getPlayingTeam() {
      playing_team.value = [
        {
          code: 'real',
          name: '皇家高歌',
        },
        {
          code: 'inter',
          name: '高歌国际',
        },
        {
          code: 'united',
          name: '高歌联',
        },
      ]
    }

    return {
      banner_imgs,
      playing_team,
      getBannerImgs,
      getPlayingTeam,
    }
  },
)

export default useUserStore
