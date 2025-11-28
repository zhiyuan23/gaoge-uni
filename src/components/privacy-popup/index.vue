<template>
  <u-popup
    :show="showPopup"
    mode="bottom"
    round="32"
    :overlay="true"
    @close="emit('update:modelValue', false)"
  >
    123
  </u-popup>
</template>

<script setup lang='ts'>
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
  }>(),
  {

  },
)

const emit = defineEmits(['update:modelValue', 'confirm'])

const showPopup = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})
</script>
