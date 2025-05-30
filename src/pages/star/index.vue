<template>
  <view>
    <view class="mx-40 py-30">
      <!-- 个人信息 -->
      <!-- <view class="flex-center-between h-70">
        <view class="flex-center">
          <view class="flex-center h-40">
            <view
              v-for="color in ['inter', 'united', 'real']"
              :key="color"
              class="h-full rotate-0 rounded mr-12 w-12"
              :class="`bg-${color}`"
            />
          </view>
          <view class="text-gray-100">
            欢迎归队：
          </view>
        </view>
        <view class="flex-center">
          <view class="text-32">
            劳塔罗
          </view>
          <view class="rounded ml-10 px-10 text-24" :class="false ? 'bg-female' : 'bg-male'">
            球王
          </view>
          <view class="ml-15">
            <u-icon name="edit-pen" color="#fcfcfc" size="28" />
          </view>
        </view>
      </view>

      <view class="bg-line my-15 h-1" /> -->

      <!-- 球员列表 -->
      <block v-for="player in playerList" :key="player.id">
        <view class="h-full flex-center-between">
          <view>
            <view class="flex-center-start">
              <!-- 头像 -->
              <image
                src="@/static/images/icons/avatar.png"
                mode="scaleToFill"
                class="size-60 mr-20"
              />
              <!-- 球员信息 -->
              <view class="flex-col-start-center">
                <view class="flex-center-start">
                  <view class="text-32">
                    {{ player.name }}
                  </view>
                  <!-- 标签 -->
                  <view
                    v-if="player.call_name"
                    class="rounded ml-10 px-10 text-24"
                    :class="player.gender === 2 ? 'bg-female' : 'bg-male'"
                  >
                    {{ player.call_name }}
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
        <view class="bg-line my-15 h-1" />
      </block>
    </view>
  </view>
</template>

<script setup lang='ts'>
import { usePlayerStore } from '@/store'

const playerStore = usePlayerStore()
const playerList = computed(() => playerStore.player_list)

onMounted(() => {

})
</script>
