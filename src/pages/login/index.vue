<template>
  <!-- 背景图 -->
  <view class="page relative bg-bgSecondary w-750">
    <image class="w-750" :src="`${IMG_BASE_URL}/login/bg.png`" mode="widthFix" />
  </view>

  <!-- 主体内容 -->
  <view class="absolute flex-col-center-start w-750 top-105">
    <image
      :src="`${IMG_BASE_URL}/login/logo.png`"
      mode="widthFix"
      class="size-180"
    />
    <view class="pt-24 leading-32 text-34">
      怡宝畅饮站
    </view>
    <view class="relative mt-260 mb-160 w-540 text-32">
      <t-button
        v-if="!isAgree"
        theme="primary"
        shape="circle"
        :custom-style="btnStyle"
        @click="showPrivacy = true"
      >
        {{ isMember ? '微信登录' : '一键登录' }}
      </t-button>
      <block v-else>
        <t-button
          v-if="isMember"
          theme="primary"
          shape="circle"
          :custom-style="btnStyle"
          :loading="loading"
          @click="handleLogin"
        >
          微信登录
        </t-button>
        <t-button
          v-else
          theme="primary"
          shape="circle"
          :custom-style="btnStyle"
          :loading="loading"
          open-type="getPhoneNumber"
          @getphonenumber="handleLogin"
        >
          一键登录
        </t-button>
      </block>
    </view>

    <!-- 隐私协议展示组件 -->
    <PrivacyInfo v-model="isAgree" />
  </view>

  <!-- 隐私协议弹窗组件 -->
  <PrivacyPopup v-model="showPrivacy" @agree="onAgree" />
</template>

<script lang="ts" setup>
import { IMG_BASE_URL } from '@/constants'
import { useAuthStore } from '@/store'

const authStore = useAuthStore()

const { isMember, loading } = storeToRefs(authStore)

// 隐私协议相关
const isAgree = ref(false)
const showPrivacy = ref(false)

onLoad((options: any) => {
  if (options.reload) {
    authStore.silentLogin()
  }
})

// 提交按钮相关
const btnStyle = reactive({
  width: '540rpx',
  fontSize: '32rpx',
  height: '80rpx',
  lineHeight: '80rpx',
  borderRadius: '40rpx',
  backgroundColor: 'var(--wechat-primary)',
  borderColor: 'var(--wechat-primary)',
  color: '#fff',
})

// 点击登录
const handleLogin = (e: any) => {
  const phoneCode = e ? e.detail.code : ''
  authStore.login(phoneCode, true)
}

// 同意用户协议
const onAgree = () => {
  isAgree.value = true

  // if (isMember.value) {
  //   authStore.login()
  // }
}
</script>

<style scoped>
:deep(.t-button__text) {
  font-size: 32rpx;
  font-weight: 500;
}
</style>
