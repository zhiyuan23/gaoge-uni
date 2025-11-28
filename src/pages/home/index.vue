<template>
  <view>
    <SeriesList />
  </view>
</template>

<script setup lang='ts'>
import SeriesList from '@/pages/series/list.vue'

onLoad(() => {
  console.log('query')
})
</script>
