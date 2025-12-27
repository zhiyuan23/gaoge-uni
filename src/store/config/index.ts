import { getProtocolConfig } from '@/api/common'

const useConfigStore = defineStore(
  'config',
  () => {
    const privacy = ref({
      privacyPolicy: '',
      userAgreement: '',
    })

    const fetchPrivacy = async () => {
      if (privacy.value.privacyPolicy && privacy.value.userAgreement) return

      privacy.value = await getProtocolConfig()
    }

    return {
      privacy,

      fetchPrivacy,
    }
  },
)

export default useConfigStore
