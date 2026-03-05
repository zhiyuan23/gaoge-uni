<template>
  <PressFeedback>
    <view
      class="relative mx-auto flex-center-center text-40"
      :style="{ width: `${width}rpx`, height: `${height}rpx` }"
      @click="handleClick"
    >
      <!-- 背景图 -->
      <image
        :src="`${IMG_BASE_URL}/btns/btn-${type}-${themeCode}.png`"
        mode="widthFix"
        class="absolute size-full"
        :class="[...btnStyle]"
      />

      <!-- 左侧图标区域 -->
      <view class="flex-center">
        <view v-if="props.loading" class="mr-10">
          <t-loading
            size="26"
            theme="spinner"
            :custom-style="{ color: loadingColor }"
          />
        </view>

        <t-icon
          v-else-if="iconName"
          :name="iconName"
          color="#fff"
          :size="iconSize"
        />
      </view>

      <!-- 按钮文字 -->
      <view class="z-9" :class="[...fontStyle]" :style="{ color: fontColor }">
        {{ displayLabel }}
      </view>
    </view>
  </PressFeedback>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables'
import { IMG_BASE_URL } from '@/constants'

const props = defineProps<{
  type?: 'main' | 'sub' | 'side' | 'draw' | 'luck';
  label?: string;
  width?: string;
  height?: string;
  iconSize?: string;
  iconUrl?: string;
  disabled?: boolean;
  btnStyle?: any;
  fontStyle?: any;
  fontColor?: any;
  loading?: boolean;
  loadingText?: string;
  loadingColor?: string;
}>()

const emit = defineEmits<{
  click: [event: any];
}>()

const { themeCode } = useTheme()

const type = computed(() => props.type || 'main')
const width = computed(() => props.width || '540')
const height = computed(() => props.height || '102')
const iconName = computed(() => props.iconUrl || '')
const iconSize = computed(() => props.iconSize || '60px')
const btnStyle = computed(() => props.btnStyle || [])
const fontStyle = computed(() => props.fontStyle || [])
const fontColor = computed(() => props.fontColor || 'FFFFFF')
const loadingColor = computed(() => props.loadingColor || fontColor.value)

const isDisabled = computed(() => props.disabled || props.loading)

const displayLabel = computed(() => {
  if (props.loading) {
    return props.loadingText || props.label
  }
  return props.label || '提交'
})

const handleClick = (e: any) => {
  if (isDisabled.value) return
  emit('click', e)
}
</script>
