<template>
  <view class="page min-h-screen" :style="{ background: bgColor }">
    <!-- 背景图 -->
    <view class="absolute w-100vw h-1000">
      <image :src="`/static/images/shop/bg-fb-${seriesCode}.png`" class="size-100%" />
    </view>

    <view class="relative pb-40">
      <!-- title -->
      <view class="color-black px-57 pt-58 leading-60">
        <view class="font-bold text-46">
          问题反馈
        </view>
        <view class="leading-94 text-30">
          Hi,提出你的小问题吧~
        </view>
      </view>

      <!-- 反馈类型 -->
      <view class="card mb-20">
        <view class="flex-center font-bold mb-20 h-70">
          <text class="color-red mr-7">
            *
          </text>
          反馈类型
        </view>
        <view class="grid grid-cols-2 gap-x-22rpx gap-y-30rpx px-4">
          <view
            v-for="obj in reasonType"
            :key="obj.id"
            class="checkbox"
            :class="[selectedReason === obj.id ? 'checked' : 'unchecked']"
            @click="selectedReason = obj.id"
          >
            {{ obj.label }}
          </view>
        </view>
      </view>

      <!-- 反馈类型 -->
      <view class="card mb-20">
        <view class="flex-center font-bold mb-20 h-70">
          <text class="color-red mr-7">
            *
          </text>
          是否需要回访
        </view>
        <view class="grid grid-cols-2 gap-x-22rpx gap-y-30rpx px-4">
          <view
            v-for="obj in returnVisitType"
            :key="obj.label"
            class="checkbox"
            :class="[selectedVisit === obj.value ? 'checked' : 'unchecked']"
            @click="selectedVisit = obj.value"
          >
            {{ obj.label }}
          </view>
        </view>

        <view v-if="selectedVisit" class="flex-center mt-58">
          <view class="flex-center font-bold mr-30 h-70">
            <text class="color-red mr-7">
              *
            </text>
            手机号
          </view>
          <view class="flex-1 rounded-1 my-3 px-20 border-2-solid-#B2B2B2">
            <input
              v-model="phoneNumber"
              type="number"
              :maxlength="11"
              :focus="false"
              placeholder="填写手机号以便我们回复您"
              placeholder-style="color:#C0C4CC"
              class="w-full h-64 leading-64 text-26"
            >
          </view>
        </view>
      </view>

      <!-- 问题描述 -->
      <view class="card mb-64">
        <view class="flex-center font-bold mx-20 h-64">
          问题描述
        </view>
        <view class="rounded-1 mx-4 px-20 border-2-solid-#B2B2B2">
          <u-textarea
            v-model="description"
            type="text"
            :focus="false"
            placeholder="填写问题越全面，问题越有效解决"
            placeholder-style="color:#C0C4CC;font-size: 26rpx"
            class="h-200 leading-64 text-26"
          />
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="w-full text-center">
        <MainButton
          label="提交"
          icon="check"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang='ts'>
import { useTheme } from '@/composables'

const {
  seriesCode,
  bgColor,
  color,
} = useTheme()

const selectedReason = ref<number | null>(null)
const selectedVisit = ref<boolean | null>(true)
const phoneNumber = ref()
const description = ref()

// 反馈类型
const reasonType = [
  { id: 1, label: '兑奖点找不到' },
  { id: 2, label: '门店缺货' },
  { id: 3, label: '门店不愿兑奖' },
  { id: 4, label: '门店不会操作' },
]

// 是否需要回访
const returnVisitType = [
  { value: false, label: '无需回访' },
  { value: true, label: '需回访' },
]

onLoad(() => {

})
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
  @apply border-#ddd bg-white;
}
</style>
