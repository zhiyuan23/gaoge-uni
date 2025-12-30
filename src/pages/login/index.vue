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
      class="w-300"
    />
    <view class="pt-24 leading-32 text-34">
      畅饮怡刻
    </view>
    <view class="relative mt-260 mb-160 w-540 text-32">
      <u-button
        v-if="!isAgree"
        type="primary"
        shape="circle"
        :custom-style="btnStyle"
        @click="showPrivacy = true"
      >
        {{ isMember ? '微信登录' : '一键登录' }}
      </u-button>
      <block v-else>
        <u-button
          v-if="isMember"
          type="primary"
          shape="circle"
          :custom-style="btnStyle"
          :loading="loading"
          loading-text="登录中"
          @click="handleLogin"
        >
          微信登录
        </u-button>
        <u-button
          v-else
          type="primary"
          shape="circle"
          :custom-style="btnStyle"
          :loading="loading"
          loading-text="登录中"
          open-type="getPhoneNumber"
          @getphonenumber="handleLogin"
        >
          一键登录
        </u-button>
      </block>
    </view>

    <!-- 隐私协议展示组件 -->
    <PrivacyInfo v-model="isAgree" />
  </view>

  <!-- 隐私协议弹窗组件 -->
  <PrivacyPopup v-model="showPrivacy" @agree="onAgree" />
</template>

<script lang='ts' setup>
import { IMG_BASE_URL } from '@/constants'
import useAuthStore from '@/store/auth'

const authStore = useAuthStore()

const { isMember, loading } = storeToRefs(authStore)

// 隐私协议相关
const isAgree = ref(false)
const showPrivacy = ref(false)

// 提交按钮相关
const btnStyle = reactive({
  fontSize: '32rpx',
  height: '80rpx',
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

<style scpoed>
:deep(.u-checkbox__label-wrap text) {
  font-size: 24rpx !important;
}
</style>
