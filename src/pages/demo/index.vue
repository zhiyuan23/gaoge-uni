<template>
  <!-- 省市区选择 使用 -->
  <view class="p-40" @click="open">
    <view v-if="selectedArea.length > 0">
      {{ selectedArea[0].name }}{{ selectedArea[1]?.name }}{{ selectedArea[2]?.name }}
    </view>
    <view v-else>
      <text>选择省市区</text>
    </view>
  </view>

  <!--
    1. level 默认为3；直选省市传2，省传1；
    2. default-value 支持传入
      code 数组 ['210000', '210100', '210112']
      和 完整数组
      [
        { name: '辽宁省', code: '210000' },
        { name: '沈阳市', code: '210100' },
        { name: '浑南区', code: '210112' }
      ] 两种格式
  -->
  <AreaPicker
    v-model:show="showPicker"
    :default-value="selectedArea"
    :level="3"
    @confirm="onSelect"
  />

  <!-- 小程序缓存 storage 使用 -->
  <view class="flex-col-center mx-40 mb-40 gap-10">
    <view>小程序缓存 storage 使用</view>
    <u-button @click="getArea">
      获取地址
    </u-button>
    <u-button @click="setArea">
      保存地址
    </u-button>
    <u-button @click="removeArea">
      清除地址
    </u-button>
  </view>

  <!-- 提示框 使用 -->
  <view class="flex-col-center mx-40 mb-40 gap-10">
    <view>提示框 使用</view>
    <u-button @click="showLoading">
      加载提示
    </u-button>
    <u-button @click="showToast">
      轻提示
    </u-button>
    <u-button @click="showModal">
      确认提示
    </u-button>
    <u-button @click="showConfirm">
      确认/取消提示
    </u-button>
  </view>
</template>

<script setup lang='ts'>
import AreaPicker from '@/components/area-picker/index.vue'
import { Dialog, Loading, Toast } from '@/utils/modals'
import storage from '@/utils/storage'

const showPicker = ref(false)
const selectedArea = ref<any>([])

function open() {
  showPicker.value = true
}

function onSelect(value: any) {
  selectedArea.value = value
}

function getArea() {
  const areaData = storage.get('areaData')
  if (areaData) {
    selectedArea.value = areaData
  }
}

function setArea() {
  const areaData = selectedArea.value
  if (areaData.length === 0) {
    Dialog('请先选择地址')
    return
  }
  storage.set('areaData', areaData)
}

function removeArea() {
  storage.remove('areaData')
}

function showLoading() {
  Loading.show()

  setTimeout(() => {
    Loading.hide()
  }, 1500)
}

function showToast() {
  Toast('这条为轻提示')
}

function showModal() {
  Dialog('这条为确认提示')
}

async function showConfirm() {
  await Dialog('这条为确认提示', {
    showCancel: true,
  })

  Toast('已确认', {
    icon: 'success',
  })
}
</script>

<style scoped>

</style>
