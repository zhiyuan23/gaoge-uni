<template>
  <div class="h-screen flex-col-center-center">
    <u-navbar @left-click="handleBack" />
    <u-empty
      mode="page"
      text="页面不存在"
      width="300"
      heigth="300"
    />
  </div>
</template>

<script lang="ts" setup>
import { HOME_PATH } from '@/router'

const handleBack = () => {
  uni.$u.route({
    type: 'reLaunch',
    url: HOME_PATH,
  })
}
</script>
