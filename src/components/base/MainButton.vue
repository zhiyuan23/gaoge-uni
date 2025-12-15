<template>
  <PressFeedback>
    <view class="w-100vw">
      <view
        class="relative mx-auto flex-center-center w-540 h-102"
        :class="{ 'opacity-60': disabled }"
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
          :name="`/static/images/icons/ic-${icon}.png`"
          color="#fff"
          :size="iconSize"
        />

        <!-- 按钮文字 -->
        <view class="z-9 color-white font-bold ml-10 text-42">
          {{ displayText }}
        </view>
      </view>
    </view>
  </PressFeedback>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables'

const props = defineProps<{
  text?: string;
  icon?: string;
  iconSize?: string;
  disabled?: boolean;
}>()

const emit = defineEmits<{
  click: [event: any];
}>()

const { seriesCode } = useTheme()

const iconSize = computed(() => props.iconSize || '30')
const displayText = computed(() => props.text || '提交')

// 图标映射
// const iconName = computed(() => {
//   switch (props.type) {
//     case 'success':
//       return 'checkmark-circle-fill' // ✓ 成功
//     case 'save':
//       return 'file-text-fill' // 保存
//     case 'upload':
//       return 'upload-fill' // 上传
//     case 'share':
//       return 'share-fill' // 分享
//     case 'submit':
//     default:
//       return 'checkmark-circle-fill' // 默认提交图标
//   }
// })

const handleClick = (e: any) => {
  if (props.disabled) return
  emit('click', e)
}
</script>
