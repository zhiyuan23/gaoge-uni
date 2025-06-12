<template>
  <view>
    <view class="overflow-hidden rounded w-750">
      <u-swiper
        height="600rpx"
        :list="bannerImgs"
        indicator
        indicator-mode="line"
        circular
        radius="0"
        interval="10000"
        duration="500"
      />
    </view>
    <!-- <view class="w-full flex-center-around mt-30">
      <view
        v-for="team in playingTeam"
        :key="team.code"
        class="flex-col-center-center text-center w-250"
      >
        <image
          :src="team.logoUrl"
          class="w-164 h-67"
        />
        <view class="rounded mt-15 w-120 h-10" :class="`bg-${team.code}`" />
      </view>

      <view v-if="false" class="flex-center-around mb-20 pb-10">
        <block
          v-for="(team, index) in recentChampionMatch.teams"
          :key="team"
        >
          <view class="w-auto flex-col-center-center text-center">
            <image
              :src="`/static/images/team/logo_${team}.png`"
              class="w-164 h-67"
              mode="aspectFit"
            />
            <view class="rounded mt-15 w-120 h-10" :class="`bg-${team}`" />
          </view>
          <image
            v-if="index !== recentChampionMatch.teams.length - 1"
            src="/static/images/icons/icon_vs.png"
            class="w-50 h-36"
            mode="aspectFit"
          />
        </block>
      </view>
    </view> -->

    <!-- 联赛信息 -->
    <view v-if="recentLeagueMatch" class="rounded-lg bg-panel shadow-md mx-24 mt-30 p-20">
      <view class="flex-col-center-center mb-20">
        <view class="leading-6.5 text-34">
          {{ recentLeagueMatch.title }}
        </view>
        <view class="rounded from-red-500 to-yellow-500 bg-gradient-to-r w-200 h-10" />
      </view>
      <view class="flex-center-start h-50 text-26">
        <u-icon name="map" color="#fff" size="24" />
        <text class="pl-15">
          {{ recentLeagueMatch.venue }}
        </text>
      </view>
      <view class="flex-center-start h-50 text-26">
        <u-icon name="clock" color="#fff" size="22" />
        <text class="pl-15">
          {{ leagueMatchTime }}
        </text>
      </view>
    </view>

    <!-- 冠军赛信息 -->
    <view v-if="recentChampionMatch" class="rounded-lg bg-panel shadow-md mx-24 mt-30 p-20">
      <view class="flex-col-center-center mb-20">
        <view class="leading-6.5 text-34">
          {{ recentChampionMatch.title }}
        </view>
        <view class="rounded from-yellow-500 to-blue-500 bg-gradient-to-r w-200 h-10" />
      </view>
      <view class="flex-center-start h-50 text-26">
        <u-icon name="map" color="#fff" size="24" />
        <text class="pl-15">
          {{ recentChampionMatch.venue }}
        </text>
      </view>
      <view class="flex-center-start h-50 text-26">
        <u-icon name="clock" color="#fff" size="22" />
        <text class="pl-15">
          {{ championMatchTime }}
        </text>
      </view>
    </view>

    <!-- 杯赛信息 -->
    <view v-if="recentCupMatch" class="rounded-lg bg-panel shadow-md mx-24 mt-30 p-20">
      <view class="flex-col-center-center mb-20">
        <view class="leading-6.5 text-34">
          {{ recentCupMatch.title }}
        </view>
        <view class="rounded bg-violet-500 w-200 h-10" />
      </view>
      <view class="flex-center-start h-50 text-26">
        <u-icon name="map" color="#fff" size="24" />
        <text class="pl-15">
          {{ recentCupMatch.venue }}
        </text>
      </view>
      <view class="flex-center-start h-50 text-26">
        <u-icon name="clock" color="#fff" size="22" />
        <text class="pl-15">
          {{ recentCupMatch.match_time ? cupMatchTime : '-' }}
        </text>
      </view>
    </view>

    <!-- #ifdef MP-WEIXIN -->
    <!-- 隐私协议组件 -->
    <agree-privacy v-model="showAgreePrivacy" :disable-check-privacy="false" @agree="handleAgree" />
    <!-- #endif -->
  </view>
</template>

<script setup lang='ts'>
// #ifdef MP-WEIXIN
import { useShare } from '@/hooks'
// #endif
import { useHomeStore, useMatchStore } from '@/store'
import { formatTime } from '@/utils/time'

// #ifdef MP-WEIXIN
const { onShareAppMessage, onShareTimeline } = useShare({
  title: '赛事信息',
  path: 'pages/home/index',
  imageUrl: '/static/images/img_share_1.jpg',
})
onShareAppMessage()
onShareTimeline()
// #endif

const title = ref<string>()
title.value = import.meta.env.VITE_APP_TITLE

// 首页数据
const homeStore = useHomeStore()
const matchStore = useMatchStore()
const { bannerImgs } = storeToRefs(homeStore)
const { recentChampionMatch, recentLeagueMatch, recentCupMatch } = storeToRefs(matchStore)

const leagueMatchTime = computed(() => formatTime(recentLeagueMatch.value.match_time))
const championMatchTime = computed(() => formatTime(recentChampionMatch.value.match_time))
const cupMatchTime = computed(() => formatTime(recentCupMatch.value.match_time))

const showAgreePrivacy = ref(false)

// 同意隐私协议
function handleAgree() {
  console.log('同意隐私政策')
}

onMounted(() => {
  homeStore.getBannerImgs()
  matchStore.getRecentMatch({ latestTime: 'latest', type: 'league' })
  matchStore.getRecentMatch({ latestTime: 'latest', type: 'champion' })
  matchStore.getRecentMatch({ latestTime: 'latest', type: 'cup' })
})
</script>
