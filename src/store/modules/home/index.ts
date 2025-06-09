const useUserStore = defineStore(
  // 唯一ID
  'home',
  () => {
    const bannerImgs = ref() // 轮播图
    const playingTeam = ref()

    function getBannerImgs() {
      bannerImgs.value = [
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
      playingTeam.value = [
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
      bannerImgs,
      playingTeam,
      getBannerImgs,
      getPlayingTeam,
    }
  },
)

export default useUserStore
