<template>
  <view>
    <SeriesZBQE v-if="themeCode === 'zbqr'" />
    <SeriesZWCS v-if="themeCode === 'zwcs'" />
    <SeriesML v-if="themeCode === 'ml'" />
  </view>
</template>

<script setup lang='ts'>
import { scanByDetail } from '@/api/lottery'
import { useLocation } from '@/composables'
import SeriesML from '@/pages/series/ml/index.vue'
import SeriesZBQE from '@/pages/series/zbqr/index.vue'
import SeriesZWCS from '@/pages/series/zwcs/index.vue'
import useAuthStore from '@/store/auth'
import useSeriesStore from '@/store/series'

const seriesStore = useSeriesStore()
const authStore = useAuthStore()

const { openId } = storeToRefs(authStore)

const themeCode = ref('')
const wxQrCode = ref('')

onLoad(async (options: any) => {
  if (options.q) {
    wxQrCode.value = decodeURIComponent(options.q)
  }

  if (wxQrCode.value && openId.value) {
    handleWeixinScan()
  }
})

watch(openId, async (newOpenId) => {
  if (newOpenId && wxQrCode.value && !themeCode.value) {
    handleWeixinScan()
  }
}, { immediate: true })

// 处理微信扫码逻辑
const handleWeixinScan = async () => {
  const data = await useLocation(false)

  const params = {
    scanCode: wxQrCode.value,
    openId: openId.value,
    locationLat: data.lat,
    locationLon: data.lng,
    locationProvince: data.province.name,
    locationCity: data.city.name,
    locationDistrict: data.district.name,
    locationAdCode: data.adCode,
    locationAddress: data.street,
    locationFullAddress: data.fullAddress,
    provinceId: data.province.code,
    cityId: data.city.code,
    districtId: data.district.code,
    adCode: data.adCode,
  }

  const res = await scanByDetail(params)

  themeCode.value = res.themeCode
  seriesStore.setThemeCode(res.themeCode)
  seriesStore.fetchSeriesDetail()
}

provide('wxQrCode', wxQrCode)
</script>
