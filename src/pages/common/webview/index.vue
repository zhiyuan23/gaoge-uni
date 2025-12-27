<template>
  <web-view class="h-full" :src="url" />
</template>

<script setup lang='ts'>
const url = ref<string>('')

const setTitle = (title = '网页') => {
  uni.setNavigationBarTitle({ title })
}

onLoad((options: any) => {
  if (options.url) {
    url.value = decodeURIComponent(options.url)
  }

  setTitle(options.title)
})
</script>
