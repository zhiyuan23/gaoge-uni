<template>
  <u-checkbox-group
    :model-value="checkboxValue"
    shape="circle"
    :active-color="activeColor"
    @change="handleChange"
  >
    <view class="flex-center-center text-24">
      <u-checkbox
        name="1"
        :custom-style="{ fontSize: '22rpx' }"
      />
      <text
        :style="{ color: textColor }"
      >
        已阅读并同意
      </text>
      <text
        class="color-primary"
        :style="{ color: linkColor }"
        @click.stop="openUserAgreement"
      >
        《用户协议》
      </text>
      <text
        class="color-primary"
        :style="{ color: linkColor }"
        @click.stop="openPrivacyPolicy"
      >
        《隐私政策》
      </text>
    </view>
  </u-checkbox-group>
</template>

<script setup lang="ts">
import type { SeriesKey } from '@/types'
import { useAgreement } from '@/composables'

const props = defineProps<{
  labelColor?: 'black' | 'white';
  themeCode?: SeriesKey;
}>()

const THEME_COLORS = {
  ml: { btn: '#7FBE26', text: '#7FBE26', link: '#7FBE26' },
  zwcs: { btn: '#7EBC1D', text: '#FFFFFF', link: '#7EBC1D' },
  zbqr: { btn: '#006747', text: '#FCF6CD', link: '#006747' },
}

const { openUserAgreement, openPrivacyPolicy } = useAgreement()
const agree = defineModel<boolean>({ required: true })

const checkboxValue = computed<string[]>(() => {
  return agree.value ? ['1'] : []
})

// 按钮颜色
const activeColor = computed(() => {
  if (!props.themeCode) return '#007E41'

  return THEME_COLORS[props.themeCode].btn
})

// 文本颜色
const textColor = computed(() => {
  if (!props.themeCode) return props.labelColor === 'white' ? 'white' : 'black'

  return THEME_COLORS[props.themeCode].text
})

// 链接颜色
const linkColor = computed(() => {
  if (!props.themeCode) return ''

  return THEME_COLORS[props.themeCode].link
})

const handleChange = (val: string[]) => {
  agree.value = val.includes('1')
}
</script>

<style lang="scss" scoped>
.u-checkbox-group--row {
  display: block;
}
</style>
