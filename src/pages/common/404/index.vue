<template>
  <div class="h-100vh flex-col-center">
    <u-navbar @left-click="handleBack" />
    <u-empty
      mode="page"
      text="页面不存在"
      icon="/static/images/404.png"
      width="300"
      heigth="300"
    />
  </div>
</template>

<script lang='ts' setup>
import { HOME_PATH } from '@/router'

function handleBack() {
  uni.$u.route({
    type: 'reLaunch',
    url: HOME_PATH,
  })
}
</script>
