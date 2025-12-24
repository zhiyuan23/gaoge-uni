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
            :src="profile?.avatarUrl"
            default-url="/static/images/icons/ic-avatar.png"
            size="55"
          />
        </view>
        <view class="flex-col-center">
          <view class="font-bold pb-5 text-34">
            <text v-if="isLogin">
              Hey, {{ profile?.nickName }}
            </text>
            <text v-else>
              去登录
            </text>
          </view>
        </view>
      </view>
      <!-- /个人信息 -->
    </view>
  </view>

  <!-- 系列列表 -->
  <view
    v-for="{ code, name, status } in seriesList"
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
        <view v-if="status" class="flex-center">
          <view class="flex-center-center rounded-full ml-8 w-96 h-36 text-22" :style="{ background: STATUS_MAP[status].color }">
            {{ STATUS_MAP[status].name }}
          </view>
          <view class="font-bold pl-14 text-32">
            {{ name }}
          </view>
        </view>
        <view
          v-if="status === 'in_progress'"
          class="flex-center-center rounded-full bg-#FFC700 mr-10 px-5 h-47 text-22"
          :style="{ color: '#01613B' }"
        >
          立即参与
          <text
            class="size-36 rounded-full color-white font-bold p-2"
            :style="{ background: '#01613B' }"
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
import useAuthStore from '@/store/auth'
import useProfileStore from '@/store/profile'
import useSeriesStore from '@/store/series'
import { navigateTo } from '@/utils'

const STATUS_MAP = {
  not_started: { name: '未开始', color: '#864227' },
  in_progress: { name: '进行中', color: '#8BC200' },
  end: { name: '已结束', color: '#363636' },
}

const authStore = useAuthStore()
const profileStore = useProfileStore()
const themeStore = useSeriesStore()

const { isLogin } = storeToRefs(authStore)
const { profile } = storeToRefs(profileStore)
const { seriesList } = storeToRefs(themeStore)

// 获取主题列表
const getThemeList = () => {
  themeStore.fetchSeriesList()
}

// 获取用户信息
const getProfile = () => {
  if (isLogin.value && !profile.value) {
    profileStore.fetchProfile()
  }
}

// 查看个人信息
const goUserPage = () => {
  const url = isLogin.value
    ? '/pages/profile/index'
    : '/pages/login/index'

  navigateTo(url)
}

// 跳转系列页
const goDetail = (code: SeriesKey) => {
  themeStore.setThemeCode(code)

  uni.navigateTo({
    url: `/pages/series/${code}/index`,
  })
}

onLoad(async () => {
  getThemeList()
  getProfile()
})
</script>
