<template>
  <div class="h-screen flex-col-center-center">
    <t-navbar left-arrow @go-back="handleBack" />
    <t-empty
      description="页面不存在"
    />
  </div>
</template>

<script lang="ts" setup>
import { HOME_PATH } from '@/router'

const handleBack = () => {
  uni.reLaunch({ url: HOME_PATH })
}
</script>
