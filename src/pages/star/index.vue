<template>
  <view>
    <view v-for="palyer in playerList" :key="palyer.id">
      <view>
        {{ palyer.name }}
      </view>
      <view>
        {{ palyer.number }}
      </view>
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
