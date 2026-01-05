<script setup lang="ts">
import { useTheme } from '@/composables'
import { IMG_BASE_URL } from '@/constants'

const props = defineProps<{
  title?: string;
}>()

const { themeCode, titleColor } = useTheme()
</script>

<template>
  <view class="relative h-118">
    <image
      :src="`${IMG_BASE_URL}/lottery/popup-hd-${themeCode}.png`"
      class="w-full h-120"
    />
    <view class="absolute w-full text-center font-bold tracking-wider top-30 text-36" :style="{ color: titleColor }">
      {{ props.title }}
    </view>
  </view>
</template>
