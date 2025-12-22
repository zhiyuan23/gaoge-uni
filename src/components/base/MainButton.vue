<template>
  <PressFeedback>
    <view
      class="relative mx-auto flex-center-center"
      :style="{ width: `${width}rpx`, height: `${height}rpx` }"
      @click="handleClick"
    >
      <!-- 背景图 -->
      <image
        :src="`/static/images/btns/btn-${seriesCode}.png`"
        mode="widthFix"
        class="absolute size-full"
      />

      <!-- 左侧图标区域 -->
      <view class="flex items-center">
        <view v-if="props.loading" class="mr-10">
          <u-loading-icon
            size="28"
            mode="semicircle"
            color="#FFFFFF"
          />
        </view>

        <u-icon
          v-else-if="props.icon"
          :name="`/static/images/btns/ic-${props.icon}.png`"
          color="#fff"
          :size="iconSize"
        />
      </view>

      <!-- 按钮文字 -->
      <view class="z-9 color-white font-bold ml-10 text-42">
        {{ displayLabel }}
      </view>
    </view>
  </PressFeedback>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables'

// type ButtonIcon =
//   | 'location'
//   | 'finger'
//   | 'coin'
//   | 'edit'
//   | 'scan'
//   | 'check'

const props = defineProps<{
  label?: string;
  width?: string;
  height?: string;
  icon?: string;
  iconSize?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
}>()

const emit = defineEmits<{
  click: [event: any];
}>()

const { seriesCode } = useTheme()

const width = computed(() => props.width || '540')
const height = computed(() => props.height || '102')
const iconSize = computed(() => props.iconSize || '30')

const isDisabled = computed(() => props.disabled || props.loading)

const displayLabel = computed(() => {
  if (props.loading) {
    return props.loadingText || '加载中...'
  }
  return props.label || '提交'
})

const handleClick = (e: any) => {
  if (isDisabled.value) return
  emit('click', e)
}
</script>
