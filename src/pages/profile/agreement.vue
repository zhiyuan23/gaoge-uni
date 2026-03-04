<template>
  <view class="page bg-bgSecondary color-#353535 px-24 text-26">
    <view class="w-full h-20" />

    <!-- 协议与说明 -->
    <view class="rounded-1.5 bg-background mb-20">
      <view
        class="relative flex-center-between pl-28 pr-58 h-96"
        @tap="openUserAgreement"
      >
        <view class="flex-center-center">
          <image
            class="size-48 mr-26"
            :src="`${IMG_BASE_URL}/icons/ic-agreement.png`"
          />
          <text class="color-secondary">
            用户协议
          </text>
        </view>
        <view class="absolute right-20">
          <u-icon name="arrow-right" color="#909399" />
        </view>
      </view>

      <view class="bg-border mx-24 h-1" />
      <view
        class="relative flex-center-between pl-28 pr-58 h-96"
        @tap="openPrivacyPolicy"
      >
        <view class="flex-center-center">
          <image
            class="size-48 mr-26"
            :src="`${IMG_BASE_URL}/icons/ic-privacy.png`"
          />
          <text class="color-secondary">
            隐私条款
          </text>
        </view>
        <view class="absolute right-20">
          <u-icon name="arrow-right" color="#909399" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useAgreement } from '@/composables'
import { IMG_BASE_URL } from '@/constants'

const { openUserAgreement, openPrivacyPolicy } = useAgreement()
</script>

<style scoped lang="scss">
page {
  @apply bg-bgSecondary;
}
</style>
