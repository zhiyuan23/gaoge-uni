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
    <view class="mt-260 w-540">
      <u-button
        type="primary"
        shape="circle"
        :loading="loading"
        loading-text="登录中"
        @click="handleLogin"
      >
        登录
      </u-button>
    </view>
    <u-checkbox-group
      v-model="isAgree"
      shape="circle"
      active-color="#007E41"
    >
      <view class="flex-center-center mt-160 text-24">
        <u-checkbox
          label="已阅读并同意"
          name="1"
          :custom-style="{ fontSize: '22rpx' }"
        />
        <text class="color-primary">
          《服务协议》
        </text>
        <text class="color-primary">
          《隐私政策》
        </text>
      </view>
    </u-checkbox-group>
  </view>

  <!-- 隐私协议组件 -->
  <PrivacyPolicy v-model="showPrivacy" @agree="onAgree" />
</template>

<script lang='ts' setup>
import useAuthStore from '@/store/auth'
import { reLaunch } from '@/utils'

const authStore = useAuthStore()

const loading = ref(false)
const isAgree = ref([''])
const showPrivacy = ref(false)

const handleSubmit = async () => {
  loading.value = true

  const data = {
    sessionKey: 'demo-sessionKey',
    unionid: 'demo-unionid',
    token: 'demo-token',
  }
  authStore.setAuthInfo(data)

  try {
    const res = await uni.getLocation()
    console.log('res', res)
    loading.value = false

    reLaunch('/pages/home/index')
  }
  catch (error) {
    console.log('error', error)
    loading.value = false
  }
}

const handleLogin = () => {
  if (isAgree.value[0] !== '1') {
    showPrivacy.value = true
  }
  else {
    handleSubmit()
  }
}

const onAgree = () => {
  isAgree.value = ['1']
  handleSubmit()
}
</script>

<style scpoed>
:deep(.u-checkbox__label-wrap text) {
  font-size: 24rpx !important;
}
</style>
