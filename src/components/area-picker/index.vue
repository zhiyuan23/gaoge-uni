<template>
  <u-picker
    ref="pickerRef"
    :show="show"
    :columns="columns"
    key-name="name"
    @confirm="onConfirm"
    @cancel="onCancel"
    @change="changeHandler"
  />
</template>

<script setup>
import { areaList } from '@vant/area-data'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  level: {
    type: Number,
    default: 3,
  },
  defaultValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:show', 'confirm'])
const pickerRef = ref(null)
const defaultIndex = ref([0, 0, 0])

const columns = reactive(
  Array.from({ length: props.level }, () => []),
)

const normalizedDefault = computed(() => {
  return props.defaultValue.map(item =>
    typeof item === 'string'
      ? item
      : item?.code,
  )
})

onMounted(() => {
  const provinces = Object.keys(areaList.province_list).map((code) => {
    return { name: areaList.province_list[code], code }
  })
  columns[0] = provinces

  if (props.level > 1 && provinces.length > 0) {
    loadCities(provinces[0].code)
  }
})

watch(() => props.show, (val) => {
  if (val) {
    nextTick(() => {
      setDefaultIndex()
    })
  }
})

function setDefaultIndex() {
  const [p, c, d] = normalizedDefault.value

  if (p) {
    defaultIndex.value[0] = columns[0].findIndex(i => i.code === p)
    if (defaultIndex.value[0] < 0) defaultIndex.value[0] = 0
  }

  if (props.level > 1) {
    const province = columns[0][defaultIndex.value[0]]
    loadCities(province.code)

    if (c) {
      defaultIndex.value[1] = columns[1].findIndex(i => i.code === c)
      if (defaultIndex.value[1] < 0) defaultIndex.value[1] = 0
    }
  }

  if (props.level > 2) {
    const city = columns[1][defaultIndex.value[1]]
    loadCounties(city.code)

    if (d) {
      defaultIndex.value[2] = columns[2].findIndex(i => i.code === d)
      if (defaultIndex.value[2] < 0) defaultIndex.value[2] = 0
    }
  }

  setPickerIndex()
}

function setPickerIndex() {
  pickerRef.value?.setIndexs(defaultIndex.value)
}

function loadCities(provinceCode) {
  const cities = Object.keys(areaList.city_list)
    .filter((code) => {
      return code.startsWith(provinceCode.substring(0, 2))
    })
    .map((code) => {
      return { name: areaList.city_list[code], code }
    })
  columns[1] = cities

  if (props.level === 3 && cities.length > 0) {
    loadCounties(cities[0].code)
  }
}

function loadCounties(cityCode) {
  const counties = Object.keys(areaList.county_list)
    .filter((code) => {
      return code.startsWith(cityCode.substring(0, 4))
    })
    .map((code) => {
      return { name: areaList.county_list[code], code }
    })
  columns[2] = counties
}

function changeHandler(e) {
  const columnIndex = e.columnIndex
  const index = e.index

  if (columnIndex === 0 && props.level > 1) {
    const provinceCode = columns[0][index].code
    loadCities(provinceCode)
  }
  else if (columnIndex === 1 && props.level === 3) {
    const cityCode = columns[1][index].code
    loadCounties(cityCode)
  }
}

function onConfirm(e) {
  emit('confirm', e.value) // 把选中的值传出去
  emit('update:show', false) // 关闭 picker
}

function onCancel() {
  emit('update:show', false)
}
</script>
