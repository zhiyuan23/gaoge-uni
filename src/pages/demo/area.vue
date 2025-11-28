<template>
  <view class="min-h-100vh bg-background">
    <view @click="open">
      选择省市区
    </view>

    <AreaPicker
      v-model:show="showPicker"
      :level="2"
      @confirm="onSelect"
    />

    <view>{{ selectedArea.province }}</view>
    <view>{{ selectedArea.city }}</view>
  </view>
</template>

<script setup lang='ts'>
import AreaPicker from '@/components/area-picker/index.vue'

const showPicker = ref(false)
const selectedArea = reactive({
  province: '',
  city: '',
})

function open() {
  showPicker.value = true // 打开选择器
}

function onSelect(value: any) {
  console.log('选择结果:', value)
  selectedArea.province = value[0].name
  selectedArea.city = value[1].name
}
</script>
