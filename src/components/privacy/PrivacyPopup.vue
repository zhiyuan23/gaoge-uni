<template>
  <u-popup
    :show="show"
    round="20"
    @close="show = false"
  >
    <view class="px-45 text-30">
      <view class="pt-50 leading-30">
        服务协议及隐私保护
      </view>
      <view class="text-center px-18 pt-90">
        为了更好地保障您的合法权益，请您阅读并同意 以下协议
        <text
          class="color-primary"
          @click.stop="openPrivacyPolicy"
        >
          《用户协议》
        </text>
        <text
          class="color-primary"
          @click.stop="openUserAgreement"
        >
          《隐私政策》
        </text>
        ，未注册手 机号将自动注册
      </view>

      <view class="flex-center-between pt-120 pb-20">
        <view class="w-300">
          <u-button
            type="default"
            shape="square"
            @click="disagree"
          >
            以后再说
          </u-button>
        </view>
        <view class="w-300">
          <u-button
            type="primary"
            shape="square"
            color="var(--wechat-primary)"
            @click="agree"
          >
            允许
          </u-button>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang='ts'>
import { useAgreement } from '@/composables'

const emit = defineEmits<{
  agree: [];
  disagree: [];
}>()

const { openUserAgreement, openPrivacyPolicy } = useAgreement()

const show = defineModel<boolean>({
  default: false,
  required: false,
})

// 同意并关闭
const agree = () => {
  emit('agree')
  show.value = false
}

// 拒绝并关闭
const disagree = () => {
  emit('disagree')
  show.value = false
}
</script>
