<template>
  <t-popup
    :visible="show"
    placement="bottom"
    :custom-style="{ background: 'transparent' }"
    :overlay-props="{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }"
    :safe-area-inset-bottom="false"
    :close-on-overlay-click="true"
    @visible-change="onVisibleChange"
  >
    <view class="flex-col-center">
      <!-- 主体区域 -->
      <view class="w-full">
        <PopupHeader title="联系客服" />

        <view class="relative bg-white px-32">
          <!-- 在线客服 -->
          <view class="flex-center h-200" @click="handleGoOnline()">
            <view :style="{ backgroundColor: color }" class="size-100 flex-center-center rounded-full">
              <image :src="`${IMG_BASE_URL}/icons/ic-service-online${iconPath}.png`" class="size-70" />
            </view>
            <view class="flex-col-start-center ml-32 gap-8">
              <view class="text-32">
                在线客服
              </view>
              <view class="color-secondary">
                工作时间：24小时
              </view>
              <view class="color-secondary text-24">
                人工智能客服
              </view>
            </view>
          </view>

          <view class="w-full bg-#e6e6e6 h-1" />

          <!-- 电话客服 -->
          <view class="flex-center h-200" @click="handleCall('400-8884-933')">
            <view :style="{ backgroundColor: color }" class="size-100 flex-center-center rounded-full">
              <image :src="`${IMG_BASE_URL}/icons/ic-service-phone${iconPath}.png`" class="size-70" />
            </view>
            <view class="flex-col-start-center ml-32 gap-8">
              <view class="text-32">
                电话客服
              </view>
              <view class="color-secondary">
                工作时间：工作日9:00-17:00
              </view>
              <view class="color-secondary text-24">
                客服电话高峰期可能遇忙，请耐心等待
              </view>
            </view>
          </view>

          <view class="w-full h-50" />
        </view>
      </view>
    </view>
  </t-popup>
</template>

<script setup lang="ts">
import { useCustomerService, useTheme } from '@/composables'
import { IMG_BASE_URL } from '@/constants'

const { themeCode, color } = useTheme()
const { openCustomerService } = useCustomerService()

const show = defineModel<boolean>({ required: true })
const iconPath = computed(() => themeCode.value === 'ml' ? '-ml' : '')

const onVisibleChange = ({ visible }: { visible: boolean }) => {
  if (!visible) {
    show.value = false
  }
}

// 在线客户
const handleGoOnline = () => {
  openCustomerService()
}

// 电话客服
const handleCall = (phoneNumber: string) => {
  uni.makePhoneCall({
    phoneNumber,
  })
}
</script>
