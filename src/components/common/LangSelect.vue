<script setup lang="ts">
import { useI18n } from 'vue-i18n'

/**
 * 1. 满足 'vue/define-props-declaration': ['error', 'type-based']
 * 使用 TS 接口定义，而非对象定义
 */
interface Props {
  size?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 40,
})

/**
 * 2. 满足 'vue/define-emits-declaration': ['error', 'type-based']
 */
const emit = defineEmits<{
  change: [lang: string];
}>()

const { locale, t } = useI18n()

/**
 * 3. 逻辑优化：langStyle 建议使用 computed，以保持响应式一致性
 */
const langStyle = computed(() => ({
  fontSize: `${props.size}rpx`,
}))

const langOptions = computed(() => [
  { label: t('locale.en'), value: 'en' },
  { label: t('locale.zh-hans'), value: 'zh-Hans' },
])

const langIndex = computed(() => {
  return langOptions.value.findIndex(item => item.value === locale.value)
})

/**
 * 4. 类型增强：为小程序事件提供更准确的类型（如果使用了 UniApp 类型库）
 */
const handleLangChange = (event: any) => {
  const index = event.detail.value
  const lang = langOptions.value[index].value
  locale.value = lang
  uni.setLocale(lang)
  emit('change', lang)
}
</script>

<template>
  <view>
    <Picker
      range-key="label"
      :range="langOptions"
      :value="langIndex"
      @change="handleLangChange"
    >
      <slot>
        <view class="i-mdi-language" :style="langStyle" />
      </slot>
    </Picker>
  </view>
</template>

<style lang="scss" scoped></style>
