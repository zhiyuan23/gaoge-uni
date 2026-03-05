<template>
  <t-checkbox-group
    :value="checkboxValue"
    borderless
    :custom-style="{
      '--td-checkbox-icon-checked-color': activeColor,
      '--td-checkbox-icon-size': '32rpx',
    }"
    @change="handleChange"
  >
    <view class="flex-center-center text-24">
      <t-checkbox
        borderless
        value="1"
        :custom-style="{ padding: '0', marginRight: '8rpx' }"
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
  </t-checkbox-group>
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

const handleChange = (context: { value: Array<string | number | boolean> }) => {
  agree.value = context.value.includes('1')
}
</script>

<style lang="scss">
.t-checkbox-group {
  display: block;
}
</style>
