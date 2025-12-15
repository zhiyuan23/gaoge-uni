<template>
  <u-popup
    :show="show"
    mode="bottom"
    bg-color="transparent"
    overlay-opacity="0.6"
    :safe-area-inset-bottom="false"
    :close-on-click-overlay="true"
    @close="show = false"
  >
    <view class="flex-col-center">
      <!-- 主体区域 -->
      <view class="w-full">
        <view class="relative">
          <image
            :src="`/static/images/series/popup-hd-${seriesCode}.png`"
            mode="widthFix"
            class="w-full h-120"
          />
          <view class="absolute w-full text-center font-bold top-44 text-34" :style="{ color: titleColor }">
            客服电话
          </view>
        </view>
        <view class="relative bg-white">
          <view class="flex-col-center-center px-30 pt-62">
            <view class="flex-center-center">
              <u-icon name="kefu-ermai" :color="phoneColor" size="28" />
              <view class="font-bold pl-20 text-38" :style="{ color: phoneColor }">
                400-123-1234
              </view>
            </view>
            <view class="mt-20">
              工作时间：工作日9:00～17:00
            </view>
          </view>

          <view class="flex-center-center mt-60 pb-60">
            <view
              class="button mr-60 w-240 h-76"
              @click="handleClose"
            >
              取消
            </view>
            <view
              class="button text-white w-240 h-76"
              :style="{ background: color, borderColor: color }"
              @click="handleCall('400-123-1234')"
            >
              呼叫
            </view>
          </view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang='ts'>
import { useTheme } from '@/composables'

// const props = defineProps<{
//   type?: string;
// }>()

const emit = defineEmits<{
  close: [];
}>()

const { seriesCode, color, titleColor, phoneColor } = useTheme()

const show = defineModel<boolean>({ required: true })

// 打电话
const handleCall = (phoneNumber: string) => {
  uni.makePhoneCall({
    phoneNumber,
  })
}

// 关闭弹窗
const handleClose = () => {
  show.value = false
  emit('close')
}
</script>
