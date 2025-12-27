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
        @click.stop="onService"
      >
        《服务协议》
      </text>
      <text
        class="color-primary"
        @click.stop="onPrivacy"
      >
        《隐私政策》
      </text>
    </view>
  </u-checkbox-group>
</template>

<script setup lang='ts'>
import useConfigStore from '@/store/config'
import { Dialog, navigateTo } from '@/utils'

const props = defineProps<{
  labelColor?: 'black' | 'white';
}>()

const configStore = useConfigStore()

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

// 协议点击事件
const onService = () => {
  openProtocol('userAgreement', '服务协议')
}

const onPrivacy = () => {
  openProtocol('privacyPolicy', '隐私政策')
}

// 查看协议
const openProtocol = async (urlKey: 'userAgreement' | 'privacyPolicy', title: string) => {
  await configStore.fetchPrivacy()

  const url = configStore.privacy[urlKey]

  if (!url) {
    Dialog('协议地址未加载')
    return
  }

  navigateTo(`/pages/common/webview/index?url=${encodeURIComponent(url)}&title=${title}`)
}
</script>
