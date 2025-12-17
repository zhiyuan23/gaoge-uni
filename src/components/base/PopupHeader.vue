<template>
  <view class="relative h-118">
    <image
      :src="`/static/images/series/popup-hd-${seriesCode}.png`"
      class="w-full h-120"
    />
    <view class="absolute w-full text-center font-bold tracking-wider top-30 text-36" :style="{ color: titleColor }">
      {{ props.title }}
    </view>
  </view>
</template>

<script setup lang='ts'>
import { useTheme } from '@/composables'

const props = defineProps<{
  title?: string;
}>()

const { seriesCode, titleColor } = useTheme()
</script>
