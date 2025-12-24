<template>
  <view>
    <SeriesZBQE v-if="themeCode === 'zbqr'" />
    <SeriesZWCS v-if="themeCode === 'zwcs'" />
    <SeriesML v-if="themeCode === 'ml'" />
  </view>
</template>

<script setup lang='ts'>
import SeriesML from '@/pages/series/ml/index.vue'
import SeriesZBQE from '@/pages/series/zbqr/index.vue'
import SeriesZWCS from '@/pages/series/zwcs/index.vue'

const themeCode = ref('zbqr')
const wxQrCode = ref('')

onLoad((options: any) => {
  if (options.code) {
    wxQrCode.value = options.code
  }
  wxQrCode.value = '10086'
})

provide('wxQrCode', wxQrCode)
</script>
