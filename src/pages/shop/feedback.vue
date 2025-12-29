<template>
  <view class="page min-h-screen" :style="{ background: shopBgColor }">
    <!-- 背景图 -->
    <view class="absolute h-full w-full">
      <image :src="`${IMG_BASE_URL}/shop/bg-fb-${themeCode}.png`" class="size-full" mode="aspectFill" />
    </view>

    <view class="relative pb-40">
      <!-- 标题 -->
      <view class="color-black px-57 pt-58 leading-60">
        <view class="font-bold text-46">
          问题反馈
        </view>
        <view class="leading-94 text-30">
          Hi，提出你的小问题吧~
        </view>
      </view>

      <!-- 反馈类型（必填） -->
      <view class="card mb-20">
        <view class="flex-center font-bold mb-20 h-70">
          <text class="color-red mr-7">
            *
          </text>
          反馈类型
        </view>
        <view class="grid grid-cols-2 gap-x-22rpx gap-y-30rpx px-4">
          <view
            v-for="item in feedbackTypes"
            :key="item.code"
            class="checkbox"
            :class="[form.feedbackType === item.code ? 'checked' : 'unchecked']"
            @click="form.feedbackType = item.code"
          >
            {{ item.name }}
          </view>
        </view>
      </view>

      <!-- 是否需要回访（必填） -->
      <view class="card mb-20">
        <view class="flex-center font-bold mb-20 h-70">
          <text class="color-red mr-7">
            *
          </text>
          是否需要回访
        </view>
        <view class="grid grid-cols-2 gap-x-22rpx gap-y-30rpx px-4">
          <view
            v-for="item in returnVisitType"
            :key="item.value"
            class="checkbox"
            :class="[form.isRevisitNeeded === item.value ? 'checked' : 'unchecked']"
            @click="form.isRevisitNeeded = item.value"
          >
            {{ item.label }}
          </view>
        </view>

        <!-- 需要回访时显示手机号输入 -->
        <view v-if="form.isRevisitNeeded === 1" class="flex-center mt-58 px-4">
          <view class="flex-center whitespace-nowrap font-bold mr-30 h-70">
            <text class="color-red mr-7">
              *
            </text>
            手机号
          </view>
          <view class="flex-1 rounded-1 my-3 px-20 border-2-solid-#B2B2B2">
            <input
              v-model="form.revisitPhone"
              type="number"
              :maxlength="11"
              placeholder="请填写您的手机号"
              placeholder-style="color:#C0C4CC"
              class="w-full h-64 leading-64 text-26"
            >
          </view>
        </view>
      </view>

      <!-- 问题描述（必填） -->
      <view class="card mb-64">
        <view class="flex-center font-bold mx-20 h-64">
          <text class="color-red mr-7">
            *
          </text>
          问题描述
        </view>
        <view class="rounded-1 mx-4 border-2-solid-#B2B2B2">
          <u-textarea
            v-model="form.problemDescription"
            type="text"
            :focus="false"
            placeholder="填写问题越全面，问题越有效解决"
            placeholder-style="color:#C0C4CC;font-size: 26rpx"
            :custom-style="{
              padding: '5rpx 10rpx',
              fontSize: '26rpx',
              height: '200rpx',
              lineHeight: '40rpx',
            }"
          />
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="w-full text-center px-24">
        <MainButton
          label="提交反馈"
          icon="check"
          :loading="loading"
          @click="handleSubmit"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang='ts'>
import { submitFeedback } from '@/api/shop'
import { useTheme } from '@/composables'
import { IMG_BASE_URL } from '@/constants'
import { delay, navigateBack, Toast } from '@/utils'

const { themeCode, shopBgColor, color } = useTheme()

const loading = ref(false)
const form = reactive({
  storeId: '',
  feedbackType: '', // 存储选中的 code
  problemDescription: '',
  isRevisitNeeded: 0, // 0: 无需回访  1: 需回访
  revisitPhone: '',
})

// 默认反馈类型
const defaultFeedbackTypes = [
  { code: 'store_info_error', name: '兑奖点找不到' },
  { code: 'store_no_stock', name: '门店缺货' },
  { code: 'store_no_exchange', name: '门店不愿兑奖' },
  { code: 'store_not_operate', name: '门店不会操作' },
]

// 反馈类型
const feedbackTypes = ref(defaultFeedbackTypes)

// 是否需要回访选项
const returnVisitType = [
  { value: 0, label: '无需回访' },
  { value: 1, label: '需回访' },
]

onLoad((options?: Record<string, any>) => {
  form.storeId = options?.storeId ?? ''

  feedbackTypes.value = JSON.parse(options?.feedbackTypes)
})

// 提交校验 + 提交
const handleSubmit = async () => {
  // 1. 校验反馈类型
  if (!form.feedbackType) {
    Toast('请选择反馈类型')
    return
  }

  // 2. 校验是否需要回访
  if (form.isRevisitNeeded !== 0 && form.isRevisitNeeded !== 1) {
    Toast('请选择是否需要回访')
    return
  }

  // 3. 需要回访时校验手机号
  if (form.isRevisitNeeded === 1) {
    if (!form.revisitPhone) {
      Toast('请填写回访手机号')
      return
    }
    if (!/^1[3-9]\d{9}$/.test(form.revisitPhone)) {
      Toast('手机号格式不正确')
      return
    }
  }

  // 4. 校验问题描述
  if (!form.problemDescription.trim()) {
    Toast('请填写问题描述')
    return
  }

  try {
    loading.value = true

    await submitFeedback({ ...form })
    Toast('提交成功！感谢您的反馈~', { icon: 'success' })
    loading.value = false

    await delay(2000)
    navigateBack()
  }
  finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page {
  --theme-color: v-bind(color);
}

.card {
  @apply rounded-1.5 bg-white mx-24 px-20 pb-30;
}

.checkbox {
  @apply flex-center-center rounded-3.125 transition-all h-50 border-2-solid-#b2b2b2;
}

.checked {
  @apply bg-[var(--theme-color)] border-[var(--theme-color)] text-white;
}

.unchecked {
  @apply border-#b2b2b2 bg-white;
}
</style>
