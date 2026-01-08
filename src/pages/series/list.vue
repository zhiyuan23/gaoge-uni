<template>
  <!-- 顶部区域 -->
  <view class="relative w-100vw mb-96 pt-80 h-500">
    <image
      class="w-full h-500"
      :src="`${IMG_BASE_URL}/home/bg-header.png`"
    />
    <view class="relative w-full flex-center-between h-162 -mt-130">
      <!-- 个人信息 -->
      <image
        class="relative size-full"
        :src="`${IMG_BASE_URL}/home/bg-user.png`"
      />
      <view class="absolute h-full flex-center-start top-0" @click="goUserPage">
        <view class="pl-32 pr-25">
          <u-avatar
            :src="userInfo?.avatarUrl"
            :default-url="`${IMG_BASE_URL}/icons/ic-avatar.png`"
            size="55"
          />
        </view>
        <view class="flex-col-center">
          <view class="font-bold pb-5 text-34">
            <text v-if="isLogin">
              Hey, {{ userInfo?.nickName }}
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
  <PressFeedback v-for="{ code, name, status } in seriesList" :key="code">
    <view
      class="relative rounded-1.25 mx-32 mb-60 w-686 h-294"
      @click="goDetail(code)"
    >
      <image
        class="w-full"
        :src="`${IMG_BASE_URL}/lottery/banner-${code}.png`"
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
  </PressFeedback>
  <view class="h-1" />
</template>

<script setup lang='ts'>
import type { SeriesKey } from '@/types'
import { IMG_BASE_URL } from '@/constants'
import { useAuthStore, useProfileStore, useSeriesStore } from '@/store'
import { navigateTo } from '@/utils'

const STATUS_MAP = {
  not_started: { name: '未开始', color: '#864227' },
  in_progress: { name: '进行中', color: '#8BC200' },
  end: { name: '已结束', color: '#363636' },
}

const authStore = useAuthStore()
const profileStore = useProfileStore()
const seriesStore = useSeriesStore()

const { isLogin } = storeToRefs(authStore)
const { userInfo } = storeToRefs(profileStore)
const { seriesList } = storeToRefs(seriesStore)

// 获取主题列表
const getSeriesList = () => {
  seriesStore.fetchSeriesList()
}

// 获取用户信息
const getProfile = () => {
  if (isLogin.value) {
    profileStore.fetchProfile()
  }
}

// 查看个人信息
const goUserPage = () => {
  const url = isLogin.value
    ? '/pages-account/profile/index'
    : '/pages-account/login/index'

  navigateTo(url)
}

// 跳转系列详情页
const goDetail = (code: SeriesKey) => {
  seriesStore.setThemeCode(code)
  seriesStore.setSeriesDetail(code)

  navigateTo(`/pages/series/${code}/index`)
}

onLoad(async () => {
  getSeriesList()
  getProfile()
})
</script>
