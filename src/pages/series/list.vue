<template>
  <!-- 顶部区域 -->
  <view class="relative w-100vw mb-96 pt-80 h-500">
    <image
      class="w-full h-500"
      src="/static/images/home/bg-main.png"
    />
    <view class="relative w-full flex-center-between h-162 -mt-130">
      <!-- 个人信息 -->
      <image
        class="relative size-full"
        src="/static/images/home/bg-info.png"
      />
      <view class="absolute h-full flex-center-start top-0" @click="goUserPage">
        <view class="pl-32 pr-25">
          <u-avatar
            :src="userInfo.avatarUrl"
            default-url="/static/images/icons/ic-avatar.png"
            size="55"
          />
        </view>
        <view class="flex-col-center">
          <view class="font-bold pb-5 text-34">
            <text v-if="isLogin">
              Hey, {{ userInfo.nickName }}
            </text>
            <text v-else>
              去登录
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>

  <!-- 系列列表 -->
  <view
    v-for="{ code, name } in seriesList"
    :key="code"
    class="relative rounded-1.25 mx-32 mb-60 w-686 h-294"
    @click="goDetail(code)"
  >
    <image
      class="w-full"
      :src="`/static/images/series/banner-${code}.png`"
      mode="widthFix"
    />
    <view
      class="absolute w-full h-128 bottom-0"
      style="
      pointer-events: none;
      background: linear-gradient(to top, rgb(0 0 0 / 60%) 0%, rgb(0 0 0 / 15%) 50%, rgb(0 0 0 / 0%) 100%);
    "
    >
      <view class="flex-center-between color-white mt-70">
        <view class="flex-center">
          <view class="flex-center-center rounded-full bg-#8BC200 ml-8 w-96 h-36 text-22">
            进行中
          </view>
          <view class="font-bold pl-14 text-32">
            {{ name }}1元畅饮赢大奖
          </view>
        </view>
        <view
          class="flex-center-center rounded-full bg-#FFC700 mr-10 px-5 h-47 text-22"
          :style="{ color: themes.zbqr.color }"
        >
          立即参与
          <text
            class="size-36 rounded-full color-white font-bold p-2"
            :style="{ background: themes.zbqr.color }"
          >
            GO
          </text>
        </view>
      </view>
    </view>
  </view>
  <view class="h-1" />
</template>

<script setup lang='ts'>
import type { SeriesKey } from '@/types'
import { useAuth } from '@/composables'
import { seriesList, themes } from '@/constants'
import useThemeStore from '@/store/theme'
import { navigateTo } from '@/utils'

const themeStore = useThemeStore()
const { isLogin } = useAuth()

// 个人信息
const userInfo = ref({
  nickName: '微信昵称',
  avatarUrl: '',
})

// 查看个人信息
const goUserPage = () => {
  const url = isLogin.value
    ? '/pages/user/info/index'
    : '/pages/login/index'

  navigateTo(url)
}

// 跳转系列页
const goDetail = (type: SeriesKey) => {
  themeStore.setSeriesCode(type)

  uni.navigateTo({
    url: `/pages/series/${type}/index`,
  })
}

onLoad(() => {
  console.log('query')
})
</script>
