<template>
  <view class="min-h-100vh" :style="{ background: bgColor }">
    <!-- 背景图 -->
    <view class="absolute w-100vw h-1000">
      <image :src="bgImg" class="size-100%" />
    </view>

    <view class="relative">
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
      <view class="rounded-1.5 bg-white mx-24 mb-20 px-20 pb-30">
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
            class="flex-center-center rounded-3.125 transition-all h-50 border-1-solid-#b2b2b2"
            :class="[
              selectedReason === obj.id
                ? 'bg-[var(--theme-color)] border-[var(--theme-color)] text-white'
                : 'border-#ddd bg-white',
            ]"
            :style="{ '--theme-color': color }"
            @click="selectedReason = obj.id"
          >
            {{ obj.label }}
          </view>
        </view>
      </view>

      <!-- 反馈类型 -->
      <view class="rounded-1.5 bg-white mx-24 mb-20 px-20 pb-30">
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
            class="flex-center-center rounded-3.125 transition-all h-50 border-1-solid-#b2b2b2"
            :class="[
              selectedVisit === obj.value
                ? 'bg-[var(--theme-color)] border-[var(--theme-color)] text-white'
                : 'border-#ddd bg-white',
            ]"
            :style="{ '--theme-color': color }"
            @click="selectedVisit = obj.value"
          >
            {{ obj.label }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang='ts'>
import { useTheme } from '@/composables'

const {
  bgImg,
  bgColor,
  color,
} = useTheme()

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

// 选中的值
const selectedReason = ref<number | null>(null)
const selectedVisit = ref<boolean | null>(null)

onLoad(() => {

})
</script>

<style scoped>
:deep(uni-page-wrapper) {
  overflow: hidden;
}
</style>
