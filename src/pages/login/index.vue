<template>
  <!-- 背景图 -->
  <view class="relative w-750">
    <image class="w-750" src="/static/images/login/bg.png" mode="widthFix" />
  </view>

  <!-- 主体内容 -->
  <view class="absolute flex-col-center-start w-750 top-105">
    <image
      src="/static/images/login/logo.png"
      mode="widthFix"
      class="w-300"
    />
    <view class="pt-24 leading-32 text-34">
      你我的怡宝+
    </view>
    <view class="relative mt-260 mb-160 w-540">
      <u-button
        v-if="!isAgree"
        type="primary"
        shape="circle"
        @click="showPrivacy = true"
      >
        {{ isMember ? '微信登录' : '一键登录' }}
      </u-button>
      <block v-else>
        <u-button
          v-if="isMember"
          type="primary"
          shape="circle"
          :loading="loading"
          loading-text="登录中"
          @click="wxLogin"
        >
          微信登录
        </u-button>
        <u-button
          v-else
          type="primary"
          shape="circle"
          :loading="loading"
          loading-text="登录中"
          open-type="getPhoneNumber"
          @getphonenumber="phoneLogin"
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
import { useAuth } from '@/composables'
import useAuthStore from '@/store/auth'
import { reLaunch } from '@/utils'

const authStore = useAuthStore()

const { isMember } = useAuth()

// 隐私协议相关
const isAgree = ref(false)
const showPrivacy = ref(false)

// 提交按钮相关
const loading = ref<boolean>(false)

// 同意用户协议
const onAgree = () => {
  isAgree.value = true
}

// 提交登录
const submit = async (data: any) => {
  try {
    await authStore.login(data)
    reLaunch('/pages/home/index')
  }
  finally {
    loading.value = false
  }
}

// 微信登录
const wxLogin = async () => {
  loading.value = true

  const { code } = await uni.login()
  const params = {
    wxCode: code,
    phoneCode: '',
  }
  submit(params)
}

// 手机号登录
const phoneLogin = async ({ detail }: any) => {
  loading.value = true

  const { code } = await uni.login()
  const params = {
    wxCode: code,
    phoneCode: detail.code,
  }

  submit(params)
}

onLoad(() => {

})
</script>

<style scpoed>
:deep(.u-checkbox__label-wrap text) {
  font-size: 24rpx !important;
}
</style>
