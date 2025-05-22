<template>
  <view>
    <view class="pb-30rpx">
      <block v-for="palyer in playerList" :key="palyer.id">
        <view class="mx-40rpx mb-15rpx h-70rpx flex-center-between border-b-1 border-b-indigo-500">
          <view class="flex-center-start">
            <image
              src="@/static/images/icons/avatar.png"
              mode="scaleToFill"
              class="h-50rpx w-50rpx"
            />
            <view class="ml-20rpx w-130rpx">
              {{ palyer.name }}
            </view>
          </view>
          <view class="w-80rpx text-center">
            {{ palyer.number }}
          </view>
        </view>
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
  console.log('playerList', playerList.value)
})
</script>
