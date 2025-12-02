<template>
  <!-- 顶部区域 -->
  <view class="relative w-100vw mb-15 h-550">
    <image
      class="h-100% w-100%"
      src="@/static/images/home/bg-main.png"
    />
    <view class="border-2-solid-white relative flex-center-between rounded-1.5 mx-25 w-694 h-160 -mt-204">
      <!-- 个人信息 -->
      <view class="flex-center-start color-white" @click="goUserPage">
        <image
          class="size-120 pl-32 pr-25"
          src="@/static/images/icons/ic-avatar.png"
        />
        <view class="flex-col-center">
          <view class="pb-5 text-30">
            {{ userInfo.nickName }}
          </view>
          <view>{{ userInfo.userName }}</view>
        </view>
      </view>
      <view class="relative mt-100 w-150 h-40">
        <image
          class="h-100% w-100%"
          src="@/static/images/home/ic-wdjp.png"
        />
        <view class="flext-center absolute color-primary h-40 leading-40 top-0 right-14 text-22">
          我的奖品
        </view>
      </view>
    </view>
  </view>

  <!-- 系列列表 -->
  <view
    v-for="{ code, name } in seriesList"
    :key="code"
    class="rounded-1.25 bg-background mx-25 mb-20"
    @click="goDetail(code)"
  >
    <image
      class="w-100%"
      :src="`/static/images/series/banner-${code}.png`"
      mode="widthFix"
    />
    <view class="flex-center-between px-16 h-80">
      <view class="color-primary font-bold pl-14 text-34">
        {{ name }}1元畅饮赢大奖
      </view>
      <view class="rounded-3 bg-primary color-white px-15 leading-48 text-22">
        立即参与
      </view>
    </view>
  </view>
  <view class="pb-30" />
</template>

<script setup lang='ts'>
import { seriesList } from '@/constants/modules/serices'
import useSeriesStore from '@/store/modules/series'
import { goto } from '@/utils/navigate'

const seriesStore = useSeriesStore()

// 登录状态
const isLogin = ref(false)

// 个人信息
const userInfo = ref({
  nickName: '用户名称',
  userName: 'HY00002',
})

// 查看个人信息
function goUserPage() {
  const url = isLogin.value
    ? '/pages/user/index'
    : '/pages/common/login/index'

  goto(url)
}

// 跳转系列页
function goDetail(type: string) {
  seriesStore.seriesCode = type

  // uni.navigateTo({
  //   url: `/pages/series/${type}/index`,
  // })
}

onLoad(() => {
  console.log('query')
})
</script>
