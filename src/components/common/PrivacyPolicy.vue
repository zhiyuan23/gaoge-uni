<template>
  <u-popup
    :show="showDialog"
    round="20"
    @close="closeAgreePrivacy"
  >
    <view class="px-45 text-30">
      <view class="pt-50 leading-30">
        服务协议及隐私保护
      </view>
      <view class="text-center px-18 pt-90">
        为了更好地保障您的合法权益，请您阅读并同意 以下协议
        <text class="color-primary">
          《用户协议》《隐私政策》
        </text>
        ，未注册手 机号将自动注册
      </view>

      <view class="flex-center-around pt-120 pb-20">
        <view class="w-250">
          <u-button
            type="default"
            shape="circle"
            @click="disagree"
          >
            以后再说
          </u-button>
        </view>
        <view class="w-250">
          <u-button
            type="primary"
            shape="circle"
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
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
  }>(),
  {
    modelValue: false,
  },
)

const emit = defineEmits(['update:modelValue', 'needPrivacyAuthorization', 'agree', 'disagree'])

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

// 关闭隐私
const closeAgreePrivacy = () => {
  emit('update:modelValue', false)
}

// 同意
const agree = () => {
  emit('agree')
  emit('update:modelValue', false)
}

// 拒绝
const disagree = () => {
  emit('disagree')
  closeAgreePrivacy()
}

onMounted(() => {

})
</script>
