<template>
  <view class="relative h-118">
    <image
      :src="`${IMG_BASE_URL}/lottery/popup-hd-${themeCode}.png`"
      class="w-full h-120"
    />
    <view
      class="text-bold absolute w-full text-center tracking-wider top-26"
      :style="[
        { color: themeCode === 'zbqr' ? color : 'white' },
        { fontSize: `${titleSize}rpx` },
      ]"
    >
      {{ props.title }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables'
import { IMG_BASE_URL } from '@/constants'

const props = defineProps<{
  title?: string;
  titleSize?: string;
}>()

const titleSize = computed(() => props.titleSize ?? '42')

const { themeCode, color } = useTheme()
</script>
