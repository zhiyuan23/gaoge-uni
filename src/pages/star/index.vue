<template>
  <view>
    <view class="py-30rpx">
      <block v-for="player in playerList" :key="player.id">
        <view class="mx-40rpx h-full flex-center-between">
          <!-- 球员信息 -->
          <view>
            <view class="flex-center-start">
              <image
                src="@/static/images/icons/avatar.png"
                mode="scaleToFill"
                class="h-50rpx w-50rpx"
              />
              <view class="ml-20rpx text-32rpx">
                {{ player.name }}
              </view>
              <view
                v-if="player.call_name"
                class="ml-10rpx rounded px-10rpx text-24rpx"
                :class="player.gender === 2 ? 'bg-female' : 'bg-male'"
              >
                {{ player.call_name }}
              </view>

              <view class="ml-20rpx h-40rpx flex-center">
                <view
                  v-for="color in player.team"
                  :key="color"
                  class="mr-12rpx h-full w-12rpx rotate-15 rounded"
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
              class="h-100rpx w-100rpx"
            />
            <view class="absolute bottom-0 left-0 right-0 top-0 text-gray-800 font-bold">
              <view class="pt-20rpx text-14rpx">
                {{ player.code }}
              </view>
              <view class="text-30rpx leading-4">
                {{ player.number }}
              </view>
            </view>
          </view>
        </view>
        <view class="mx-40rpx my-15rpx h-1rpx bg-line" />
      </block>
    </view>
  </view>
</template>

<script setup lang='ts'>
import { usePlayerStore } from '@/store'

const playerStore = usePlayerStore()
const playerList = computed(() => playerStore.player_list)

onMounted(() => {
  playerStore.getPlayerList()
  console.log('playerList', playerList)
})
</script>
