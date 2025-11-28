<template>
  <view>
    <image
      class="mb-10"
      src="@/static/images/series/banner_zbqr.png"
      mode="widthFix"
      @click="toSeries('zbqr')"
    />
    <image
      class="mb-10"
      src="@/static/images/series/banner_zwcs.png"
      mode="widthFix"
      @click="toSeries('zwcs')"
    />
    <image
      class="mb-10"
      src="@/static/images/series/banner_ml.png"
      mode="widthFix"
      @click="toSeries('ml')"
    />
  </view>
</template>

<script setup lang='ts'>
// 跳转系列页
function toSeries(type: string) {
  uni.navigateTo({
    url: `/pages/series/${type}/index`,
  })
}

onLoad(() => {
  console.log('query')
})
</script>
