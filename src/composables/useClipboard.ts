/**
 * 剪切板
 * @example
 * const { setClipboardData, getClipboardData } = useClipboard()
 * await setClipboardData({ data: '1234567890' })
 * const data = await getClipboardData()
 */
const useClipboard = () => {
  const setClipboardData = ({
    data,
    showToast = true,
  }: UniApp.SetClipboardDataOptions): Promise<string> => {
    return new Promise((resolve, reject) => {
      uni.setClipboardData({
        data,
        showToast,
        success: ({ data }) => resolve(data),
        fail: reject,
      })
    })
  }

  const getClipboardData = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      uni.getClipboardData({
        success: ({ data }) => resolve(data),
        fail: reject,
      })
    })
  }

  return {
    setClipboardData,
    getClipboardData,
  }
}

export default useClipboard
