<template>
  <!-- 背景图 -->
  <view class="relative w-750">
    <image src="/static/images/login/bg.png" mode="widthFix" />
  </view>

  <!-- 主体内容 -->
  <view class="absolute flex-col-center-start w-750 top-105">
    <view class="w-300">
      <image src="/static/images/login/logo.png" mode="widthFix" />
    </view>
    <view class="pt-24 leading-32 text-34">
      你我的怡宝+
    </view>
    <view class="mt-260 w-540">
      <u-button
        type="primary"
        shape="circle"
        :loading="loading"
        @click="onLogin"
      >
        登录
      </u-button>
    </view>
  </view>

  <!-- 隐私协议组件 -->
  <PrivacyPopup v-model="showPrivacy" />
</template>

<script lang='ts' setup>
import PrivacyPopup from '@/components/agree-privacy/index.vue'

const loading = ref(false)
const showPrivacy = ref(true)

function onLogin() {
  showPrivacy.value = true
}
</script>
