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
      <text
        :class="labelColorClass"
        class="ml-8"
      >
        已阅读并同意
      </text>
      <text
        class="color-primary ml-16"
        @click.stop="onService"
      >
        《服务协议》
      </text>
      <text
        class="color-primary ml-16"
        @click.stop="onPrivacy"
      >
        《隐私政策》
      </text>
    </view>
  </u-checkbox-group>
</template>

<script setup lang='ts'>
const props = defineProps<{
  labelColor?: 'black' | 'white';
}>()

const emit = defineEmits<{
  (e: 'service'): void;
  (e: 'privacy'): void;
}>()

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

// 点击协议
const onService = () => emit('service')
const onPrivacy = () => emit('privacy')
</script>
