export const useAppStore = defineStore(
  'app',
  () => {
    const sessionKey = ref<string>('')
    const systemInfo = reactive<UniApp.GetSystemInfoResult>({} as UniApp.GetSystemInfoResult)
    const getSystemInfo = computed(() => systemInfo)

    // 获取系统信息
    const setSystemInfo = (info: UniApp.GetSystemInfoResult) => {
      Object.assign(systemInfo, info)
    }

    // 初始化系统信息
    const initSystemInfo = () => {
      uni.getSystemInfo({
        success(res: UniApp.GetSystemInfoResult) {
          setSystemInfo(res)
        },
        fail(err) {
          console.error('获取系统信息失败:', err)
        },
      })
    }

    // 检查版本更新
    const checkUpdate = () => {
      const updateManager = uni.getUpdateManager()
      updateManager.onCheckForUpdate((res: UniApp.OnCheckForUpdateResult) => {
        console.log('有无新版本:', res.hasUpdate)
      })
      updateManager.onUpdateReady(() => {
        uni.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用?',
          success(res) {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          },
        })
      })
      updateManager.onUpdateFailed((err) => {
        console.error('更新下载失败:', err)
        uni.showToast({ title: '更新失败', icon: 'error' })
      })
    }

    return {
      sessionKey,
      systemInfo,
      getSystemInfo,
      initSystemInfo,
      checkUpdate,
    }
  },
  {
    persist: [
      {
        pick: ['sessionKey'],
        storage: localStorage,
        // serializer: {
        //   // 存储时只存字符串
        //   serialize: (state: any) => state.seriesCode,
        //   // 读取时还原成对象
        //   deserialize: (value: string | null) => ({ seriesCode: value || '' }),
        // },
      },
    ],
  },
)

export default useAppStore
