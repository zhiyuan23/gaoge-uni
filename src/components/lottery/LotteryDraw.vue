<template>
  <u-popup
    :show="show"
    mode="center"
    bg-color="transparent"
    overlay-opacity="0.8"
    :safe-area-inset-bottom="false"
    :close-on-click-overlay="false"
  >
    <view class="flex-col-center -mt-150">
      <!-- 关闭按钮 -->
      <view class="z-9 w-570">
        <image
          src="/static/images/icons/ic-close.png"
          class="float-right size-60 p-40"
          @click="handleClose"
        />
      </view>

      <!-- 开奖标题图片 -->
      <image
        :src="`/static/images/lottery/main-tit-${props.type}.png`"
        class="w-460 h-200 -mt-68"
      />

      <!-- 开奖主图片 -->
      <image
        :src="`/static/images/lottery/main-img-${props.type}.png`"
        class="mt-8 w-520 h-520"
      />

      <MainButton
        text="点击开奖"
        icon="scan"
        @click="handleConfirm"
      />
    </view>
  </u-popup>
</template>

<script setup lang='ts'>
import type { SeriesKey } from '@/types'

const props = defineProps<{
  type?: SeriesKey;
}>()

const emit = defineEmits<{
  close: [];
  confirm: [];
}>()

const show = defineModel<boolean>({ required: true })

const handleClose = () => {
  show.value = false
  emit('close')
}

const handleConfirm = () => {
  show.value = false
  emit('confirm')
}
</script>
