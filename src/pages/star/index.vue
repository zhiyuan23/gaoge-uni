<template>
  <view>
    <view class="py-20">
      <!-- 个人信息 -->
      <view class="h-full rounded-xl bg-panel mx-20 mb-20 px-20 py-15">
        <view v-if="playerDetail" class="flex-center-between" @click="edit">
          <view class="flex-center-start">
            <!-- 头像 -->
            <image
              v-if="playerDetail.avatar_url"
              :src="playerDetail.avatar_url"
              class="size-70 rounded-full mr-20"
            />
            <image
              v-else
              src="@/static/images/icons/avatar.png"
              class="size-70 rounded-full mr-20"
            />
            <!-- 球员信息 -->
            <view class="flex-col-start-center">
              <view class="flex-center-start">
                <view class="text-32">
                  {{ playerDetail.name }}
                </view>
                <!-- 称呼 -->
                <view
                  v-if="playerDetail.call_name"
                  class="rounded ml-10 px-10 text-24"
                  :class="playerDetail.gender === 2 ? 'bg-female' : 'bg-male'"
                >
                  {{ playerDetail.call_name }}
                </view>
                <!-- 昵称 -->
                <view
                  v-if="playerDetail.nickname"
                  class="rounded bg-lime-600 ml-10 px-10 text-24"
                >
                  {{ playerDetail.nickname }}
                </view>
                <view class="ml-15">
                  <u-icon name="edit-pen" color="#fcfcfc" size="24" />
                </view>
              </view>
              <!-- 球队标识 -->
              <view class="flex-center-center mt-5">
                <view
                  v-for="color in playerDetail.team"
                  :key="color"
                  class="rounded mr-8 w-30 h-12"
                  :class="`bg-${color}`"
                />
              </view>
            </view>
          </view>

          <!-- 球衣 -->
          <view class="relative text-center">
            <image
              src="@/static/images/icons/clothes.png"
              mode="scaleToFill"
              class="size-110"
            />
            <view class="absolute top-0 right-0 bottom-0 left-0">
              <!-- 球衣信息 -->
              <view class="text-gray-800 font-bold">
                <view class="pt-22" :class="playerDetail.code.length > 10 ? 'text-14' : 'text-16'">
                  {{ playerDetail.code }}
                </view>
                <view class="leading-3.5 font-sans text-32">
                  {{ playerDetail.number }}
                </view>
              </view>
              <!-- 球队标识 -->
              <view class="flex-center gap-0.5 mt-10 w-110 h-20">
                <view
                  v-for="color in playerDetail.team"
                  :key="color"
                  class="h-full rounded w-12"
                  :class="`bg-${color}`"
                />
              </view>
            </view>
          </view>
        </view>
        <block v-else>
          <picker
            :range="numberOptions"
            class="w-full"
            @change="selectNumber"
          >
            <view class="flex-center-between h-110">
              <view class="ml-15">
                选择号码绑定球员信息
              </view>
              <view class="mx-15">
                <u-icon name="arrow-right" color="#fcfcfc" size="20" />
              </view>
            </view>
          </picker>
        </block>
      </view>

      <!-- 球员列表 -->
      <block v-for="player in playerList" :key="player.id">
        <view class="h-full flex-center-between mx-40">
          <view class="flex-center-start">
            <!-- 头像 -->
            <image
              v-if="player.avatar_url"
              :src="player.avatar_url"
              class="size-70 rounded-full mr-20"
            />
            <image
              v-else
              src="@/static/images/icons/avatar.png"
              class="size-70 rounded-full mr-20"
            />
            <!-- 球员信息 -->
            <view class="flex-col-start-center">
              <view class="flex-center-start">
                <view class="text-32">
                  {{ player.name }}
                </view>
                <!-- 称呼 -->
                <view
                  v-if="player.call_name"
                  class="rounded ml-10 px-10 text-24"
                  :class="player.gender === 2 ? 'bg-female' : 'bg-male'"
                >
                  {{ player.call_name }}
                </view>
                <!-- 昵称 -->
                <view
                  v-if="player.nickname"
                  class="rounded bg-lime-600 ml-10 px-10 text-24"
                >
                  {{ player.nickname }}
                </view>
              </view>
              <!-- 球队标识 -->
              <view class="flex-center-center mt-5">
                <view
                  v-for="color in player.team"
                  :key="color"
                  class="rounded mr-8 w-30 h-12"
                  :class="`bg-${color}`"
                />
              </view>
            </view>
          </view>

          <!-- 球衣 -->
          <view class="relative text-center">
            <image
              src="@/static/images/icons/clothes.png"
              mode="scaleToFill"
              class="size-110"
            />
            <view class="absolute top-0 right-0 bottom-0 left-0">
              <!-- 球衣信息 -->
              <view class="text-gray-800 font-bold">
                <view class="pt-22" :class="player.name_size === 'small' ? 'text-14' : 'text-16'">
                  {{ player.code }}
                </view>
                <view class="leading-3.5 font-sans text-32">
                  {{ player.number }}
                </view>
              </view>
              <!-- 球队标识 -->
              <view class="flex-center gap-0.5 mt-10 w-110 h-20">
                <view
                  v-for="color in player.team"
                  :key="color"
                  class="h-full rounded w-12"
                  :class="`bg-${color}`"
                />
              </view>
            </view>
          </view>
        </view>
        <view class="bg-line mx-40 my-15 h-1" />
      </block>
    </view>
  </view>
</template>

<script setup lang='ts'>
// #ifdef MP-WEIXIN
// 分享使用示例
import { useShare } from '@/hooks'
// #endif
import { usePlayerStore } from '@/store'

// #ifdef MP-WEIXIN
const { onShareAppMessage, onShareTimeline } = useShare({
  title: '高歌球星',
  path: 'pages/star/index',
  imageUrl: '/static/images/img_share_2.jpg',
})
onShareAppMessage()
onShareTimeline()
// #endif

const playerStore = usePlayerStore()
const playerList = computed(() => playerStore.player_list)
const playerDetail = computed(() => playerStore.player_detail)
const numberOptions = computed(() => playerStore.player_numbers)

const selectNumber = ({ detail }: any) => {
  playerStore.bindPlayerOpenid(Number(detail.value))
}

const edit = () => {
  uni.navigateTo({ url: '/pages/star/edit' })
}

onMounted(() => {
  playerStore.getPlayerNumbers()
})
</script>
