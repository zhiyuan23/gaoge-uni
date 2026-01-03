<template>
  <u-checkbox-group
    :model-value="checkboxValue"
    shape="circle"
    active-color="#007E41"
    @change="handleChange"
  >
    <view class="flex-center-center text-24">
      <u-checkbox
        name="1"
        :custom-style="{ fontSize: '22rpx' }"
      />
      <text :class="labelColorClass">
        已阅读并同意
      </text>
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
    </view>
  </u-checkbox-group>
</template>

<script setup lang='ts'>
import { useAgreement } from '@/composables'

const props = defineProps<{
  labelColor?: 'black' | 'white';
}>()

const { openUserAgreement, openPrivacyPolicy } = useAgreement()

const agree = defineModel<boolean>({ required: true })

const checkboxValue = computed<string[]>(() => {
  return agree.value ? ['1'] : []
})

const labelColorClass = computed(() => {
  return props.labelColor === 'white' ? 'text-white' : 'text-black'
})

const handleChange = (val: string[]) => {
  agree.value = val.includes('1')
}
</script>
