<template>
  <u-popup
    :show="show"
    round="20"
    :safe-area-inset-bottom="false"
    @close="handleClose"
  >
    <view class="px-45 text-30">
      <view class="pt-50 leading-30">
        服务协议及隐私保护
      </view>
      <view class="text-center px-18 pt-90">
        为了更好地保障您的合法权益，请您阅读并同意 以下协议
        <text
          class="color-primary"
          @click.stop="openUserAgreement"
        >
          《用户协议》
        </text>
        <text
          class="color-primary"
          @click.stop="openPrivacyPolicy"
        >
          《隐私政策》
        </text>
        ，未注册手 机号将自动注册
      </view>

      <view class="flex-center-center pt-120 pb-20 gap-30">
        <view class="w-300">
          <u-button
            type="default"
            shape="square"
            :custom-style="btnStyle"
            @click="handleDisagree"
          >
            以后再说
          </u-button>
        </view>
        <view class="w-300">
          <template v-if="props.needAuth">
            <!-- 手机号授权登录 -->
            <u-button
              v-if="!isMember"
              type="primary"
              shape="square"
              color="var(--wechat-primary)"
              :custom-style="btnStyle"
              open-type="getPhoneNumber"
              @getphonenumber="getPhoneNumer"
            >
              允许
            </u-button>

            <!-- 静默登录 -->
            <u-button
              v-else
              type="primary"
              shape="square"
              color="var(--wechat-primary)"
              :custom-style="btnStyle"
              @click="handeLogin"
            >
              允许
            </u-button>
          </template>

          <!-- 非授权操作 -->
          <u-button
            v-else
            type="primary"
            shape="square"
            color="var(--wechat-primary)"
            :custom-style="btnStyle"
            @click="handleAgree"
          >
            允许
          </u-button>
        </view>
      </view>
    </view>
    <view class="w-full h-50" />
  </u-popup>
</template>

<script setup lang="ts">
import { useAgreement } from '@/composables'
import { useAuthStore, useProfileStore } from '@/store'

const props = defineProps<{
  needAuth?: boolean;
}>()

const emit = defineEmits<{
  agree: [];
  disagree: [];
  authorized: [];
}>()

const authStore = useAuthStore()
const profileStore = useProfileStore()

const { openUserAgreement, openPrivacyPolicy } = useAgreement()
const { isMember } = storeToRefs(authStore)

const show = defineModel<boolean>({ required: true })

const btnStyle = ref({
  fontSize: '32rpx',
  borderRadius: '10rpx',
})

// 手机号一键登录
const getPhoneNumer = async (e: any) => {
  const phoneCode = e?.detail?.code

  handeLogin(phoneCode)
}

// 授权登录
const handeLogin = async (phoneCode: string = '') => {
  handleClose()

  await authStore.login(phoneCode)
  profileStore.fetchProfile()

  emit('authorized')
}

// 同意并关闭
const handleAgree = () => {
  handleClose()
  emit('agree')
}

// 拒绝并关闭
const handleDisagree = () => {
  handleClose()
  emit('disagree')
}

// 关闭弹窗
const handleClose = () => {
  show.value = false
}
</script>
