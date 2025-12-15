<template>
  <view class="flex-center rounded-32 bg-bgSecondary px-30 w-640 h-64 border-1-solid-#e6e6e6">
    <!-- 省市选择 -->
    <view class="flex items-center" @click="showCityPicker = true">
      <text class="pr-8 text-28">
        {{ cityName }}
      </text>
      <view class="icon-arrow-down" />
    </view>

    <view class="w-1px bg-#E0E0E0 ml-20 mr-10 h-30" />

    <!-- 右侧：搜索框 -->
    <view class="relative flex-center flex-1">
      <!-- 搜索图标 -->
      <image src="@/static/images/icons/ic-search.png" class="size-42" />

      <!-- 输入框 -->
      <input
        v-model="searchValue"
        type="text"
        :focus="false"
        :placeholder="placeholder"
        placeholder-style="color:#C0C4CC; font-size:28rpx;"
        class="flex-1 ml-10 leading-64 text-28"
        @input="onInput"
        @confirm="emit('search', searchValue)"
      >

      <!-- 清除按钮 -->
      <u-icon
        v-if="searchValue"
        name="close-circle-fill"
        size="20"
        color="#999"
        class="absolute right-0"
        @click="clearSearch"
      />
    </view>
  </view>

  <RegionPicker
    v-model:show="showCityPicker"
    :default-value="selectedArea"
    :level="2"
    @confirm="onSelectCity"
  />
</template>

<script setup lang='ts'>
const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
  cityName?: string;
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search', value: string): void;
  (e: 'city'): void;
  (e: 'clear'): void;
}>()

// 双向绑定
const searchValue = ref(props.modelValue || '')

// 城市选择相关
const showCityPicker = ref(false)
const selectedArea = ref<any>([])

const onSelectCity = (value: any) => {
  selectedArea.value = value[1]?.name
}

// 同步父组件 v-model
watch(searchValue, (val) => {
  emit('update:modelValue', val)
})

// 监听父组件传入的变化（比如重置）
watch(() => props.modelValue, (val) => {
  if (val !== searchValue.value) {
    searchValue.value = val || ''
  }
})

const onInput = () => {
  // 可选：输入时实时搜索
  // emit('search', searchValue.value)
}

const clearSearch = () => {
  searchValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style scoped>
.icon-arrow-down {
  width: 0;
  height: 0;
  border-top: 7rpx solid #909399;
  border-right: 7rpx solid transparent;
  border-left: 7rpx solid transparent;
}
</style>
