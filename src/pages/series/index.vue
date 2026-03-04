<template>
  <view>
    <SeriesZBQE v-if="themeCode === 'zbqr'" />
    <SeriesZWCS v-if="themeCode === 'zwcs'" />
    <SeriesML v-if="themeCode === 'ml'" />
  </view>
</template>

<script setup lang="ts">
import { scanByDetail } from '@/api'
import { useLocation } from '@/composables/useLocation'
import SeriesML from '@/pages/series/ml/index.vue'
import SeriesZBQE from '@/pages/series/zbqr/index.vue'
import SeriesZWCS from '@/pages/series/zwcs/index.vue'
import { useAuthStore, useSeriesStore } from '@/store'
import { assignLocation, reLaunch } from '@/utils'

const seriesStore = useSeriesStore()
const authStore = useAuthStore()

const { openId } = storeToRefs(authStore)

const themeCode = ref('')
const wxQrCode = ref('')
const logId = ref('')

onLoad((options: any) => {
  if (options.q) {
    wxQrCode.value = decodeURIComponent(options.q)
  }
  else if (options.scanCode) {
    wxQrCode.value = options.scanCode
  }
  else {
    reLaunch('/pages/home/index')
  }
})

// 微信扫码参与活动 进入活动页满足条件后自动执行扫码操作
watch(
  () => [openId.value, wxQrCode.value] as const,
  ([newOpenId, newQrCode], oldValues) => {
    if (!oldValues) return
    const [oldOpenId, oldQrCode] = oldValues

    if (
      !newOpenId
      || !newQrCode
      || (newOpenId === oldOpenId && newQrCode === oldQrCode)
    ) {
      return
    }

    handleWeixinScan()
  },
  { immediate: true },
)

// 处理微信扫码逻辑
const handleWeixinScan = async () => {
  try {
    const params = {
      scanCode: wxQrCode.value,
      openId: openId.value,
    }
    const data = await useLocation({ onlyIfAuthorized: true })
    assignLocation(params, data)

    const res = await scanByDetail(params)

    logId.value = res.logId
    themeCode.value = res.themeCode
    seriesStore.setThemeCode(res.themeCode)
    seriesStore.fetchSeriesDetail()
  }
  catch (error) {
    seriesStore.setThemeCode('zbqr')
    reLaunch(`/pages/home/index?prizeInfo=${JSON.stringify(error)}`)
  }
}

provide('wxQrCode', wxQrCode)
provide('logId', logId)
</script>
