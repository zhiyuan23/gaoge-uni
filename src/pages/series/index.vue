<template>
  <view>
    <SeriesZBQE v-if="seriesCode === 'zbqr'" />
    <SeriesZWCS v-if="seriesCode === 'zwcs'" />
    <SeriesML v-if="seriesCode === 'ml'" />
  </view>
</template>

<script setup lang='ts'>
import SeriesML from '@/pages/series/ml/index.vue'
import SeriesZBQE from '@/pages/series/zbqr/index.vue'
import SeriesZWCS from '@/pages/series/zwcs/index.vue'

const seriesCode = ref('zbqr')

onLoad(() => {
  console.log('query')
})
</script>
