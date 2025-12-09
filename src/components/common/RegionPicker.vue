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
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'

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

const normalizedDefault = computed(() =>
  props.defaultValue.map(item =>
    typeof item === 'string'
      ? item
      : item?.code,
  ),
)

const loadCounties = (cityCode) => {
  const counties = Object.keys(areaList.county_list)
    .filter(code =>
      code.startsWith(cityCode.substring(0, 4)),
    )
    .map(code => ({
      name: areaList.county_list[code],
      code,
    }))
  columns[2] = counties
}

const setPickerIndex = () => {
  pickerRef.value?.setIndexs(defaultIndex.value)
}

const loadCities = (provinceCode) => {
  const cities = Object.keys(areaList.city_list)
    .filter(code =>
      code.startsWith(provinceCode.substring(0, 2)),
    )
    .map(code => ({
      name: areaList.city_list[code],
      code,
    }))

  columns[1] = cities

  if (props.level === 3 && cities.length > 0) {
    loadCounties(cities[0].code)
  }
}

const changeHandler = (e) => {
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

const setDefaultIndex = () => {
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

const onConfirm = (e) => {
  emit('confirm', e.value)
  emit('update:show', false)
}

const onCancel = () => {
  emit('update:show', false)
}

onMounted(() => {
  const provinces = Object.keys(areaList.province_list).map(code => ({
    name: areaList.province_list[code],
    code,
  }))
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
</script>
