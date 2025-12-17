<template>
  <PressFeedback>
    <view
      class="relative mx-auto flex-center-center"
      :class="{ 'opacity-60': disabled }"
      :style="{ width: `${width}rpx`, height: `${height}rpx` }"
      @click="handleClick"
    >
      <!-- 背景图 -->
      <image
        :src="`/static/images/btns/btn-${seriesCode}.png`"
        mode="widthFix"
        class="absolute size-full"
      />

      <!-- 左侧图标 -->
      <u-icon
        v-if="props.icon"
        :name="`/static/images/btns/ic-${icon}.png`"
        color="#fff"
        :size="iconSize"
      />

      <!-- 按钮文字 -->
      <view class="z-9 color-white font-bold ml-10 text-42">
        {{ displayLabel }}
      </view>
    </view>
  </PressFeedback>
</template>

<script setup lang='ts'>
import { useTheme } from '@/composables'

type ButtonIcon =
  | 'location'
  | 'finger'
  | 'coin'
  | 'edit'
  | 'scan'
  | 'check'

const props = defineProps<{
  label?: string;
  width?: string;
  height?: string;
  icon?: ButtonIcon;
  iconSize?: string;
  disabled?: boolean;
}>()

const emit = defineEmits<{
  click: [event: any];
}>()

const { seriesCode } = useTheme()

const width = computed(() => props.width || '540')
const height = computed(() => props.height || '102')
const iconSize = computed(() => props.iconSize || '30')
const displayLabel = computed(() => props.label || '提交')

const handleClick = (e: any) => {
  if (props.disabled) return
  emit('click', e)
}
</script>
