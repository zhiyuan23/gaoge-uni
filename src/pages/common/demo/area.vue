<script setup lang="ts">
const showPicker = ref(false)
const selectedArea = reactive({
  province: '',
  city: '',
})

const open = () => {
  showPicker.value = true // 打开选择器
}

const onSelect = (value: any) => {
  console.log('选择结果:', value)
  selectedArea.province = value[0].name
  selectedArea.city = value[1].name
}
</script>

<template>
  <view class="min-h-screen bg-background">
    <view @click="open">
      选择省市区
    </view>

    <RegionPicker
      v-model:show="showPicker"
      :level="2"
      @confirm="onSelect"
    />

    <view>{{ selectedArea.province }}</view>
    <view>{{ selectedArea.city }}</view>
  </view>
</template>
