<template>
  <view>
    <view class="py-30">
      <block v-for="player in playerList" :key="player.id">
        <view class="h-full flex-center-between mx-40">
          <!-- 球员信息 -->
          <view>
            <view class="flex-center-start">
              <image
                src="@/static/images/icons/avatar.png"
                mode="scaleToFill"
                class="size-50"
              />
              <view class="ml-20 text-32">
                {{ player.name }}
              </view>
              <view
                v-if="player.call_name"
                class="rounded ml-10 px-10 text-24"
                :class="player.gender === 2 ? 'bg-female' : 'bg-male'"
              >
                {{ player.call_name }}
              </view>

              <view class="flex-center ml-20 h-40">
                <view
                  v-for="color in player.team"
                  :key="color"
                  class="h-full rotate-15 rounded mr-12 w-12"
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
            <view class="absolute text-gray-800 font-bold top-0 right-0 bottom-0 left-0">
              <view class="pt-22 text-14">
                {{ player.code }}
              </view>
              <view class="leading-5 text-32">
                {{ player.number }}
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
import { usePlayerStore } from '@/store'

const playerStore = usePlayerStore()
const playerList = computed(() => playerStore.player_list)

onMounted(() => {
  playerStore.getPlayerList()
  console.log('playerList', playerList)
})
</script>
