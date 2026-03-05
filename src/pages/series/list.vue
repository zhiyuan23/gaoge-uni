<template>
  <StatusPage
    v-if="isRequestFail"
    type="netError"
    @click="refresh"
  />
  <template v-else>
    <!-- 顶部区域 -->
    <view class="relative w-100vw bg-#F3ECC2 pt-80">
      <image
        class="w-full h-500"
        :src="`${IMG_BASE_URL}/home/bg-header.png`"
      />
      <!-- 个人信息 -->
      <view class="w-full flex-center-start rounded-t-6 bg-#FEFBF2 h-146 -mt-110" @click="goUserPage">
        <view class="pl-50 pr-20">
          <t-avatar
            :image="userInfo?.avatarUrl || `${IMG_BASE_URL}/icons/ic-avatar.png`"
            size="55px"
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

    <!-- 系列列表 -->
    <PressFeedback v-for="item in seriesList" :key="item.code">
      <view
        class="relative overflow-hidden rounded-2.5 mx-32 mt-60 w-686 h-294"
        @click="goDetail(item.code)"
      >
        <image
          class="w-full bg-gray-100"
          :src="item.activityEntryImg"
          mode="widthFix"
        />
      </view>
    </PressFeedback>
    <view class="h-60" />
  </template>
</template>

<script setup lang="ts">
import type { SeriesKey } from '@/types'
import { IMG_BASE_URL } from '@/constants'
import { useAuthStore, useProfileStore, useSeriesStore } from '@/store'
import { navigateTo, storage } from '@/utils'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const seriesStore = useSeriesStore()

const { isLogin } = storeToRefs(authStore)
const { userInfo } = storeToRefs(profileStore)
const { seriesList, isRequestFail } = storeToRefs(seriesStore)

onLoad(async () => {
  getSeriesList()
  getProfile()
})

// 获取主题列表
const getSeriesList = () => {
  seriesStore.fetchSeriesList()
}

// 获取用户信息
const getProfile = () => {
  const sessionKey = storage.get('sessionKey')

  if (isLogin.value && sessionKey) {
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

// 跳转系列详情页
const goDetail = (code: SeriesKey) => {
  seriesStore.setThemeCode(code)
  seriesStore.setSeriesDetail(code)

  navigateTo(`/pages/series/${code}/index`)
}

// 刷新
const refresh = async () => {
  authStore.silentLogin()
  seriesStore.fetchSeriesList(true)
}
</script>
