<template>
  <view class="page-wrap">
    <!-- 导航栏占位 -->
    <view :style="{ height: `${navbarTotalHeight}px` }" />
    <view class="absolute z-10 h-380 top-0 right-0 left-0">
      <image class="size-full" src="/static/images/bg_team.png" mode="widthFix" />
    </view>
    <view class="relative z-20">
      <!-- 队名 -->
      <view class="m-24 px-24">
        <text>辽宁高歌足球俱乐部</text>
      </view>
      <!-- 财务面板 -->
      <view class="asset-panel">
        <view class="asset-panel__title">
          球队财务
        </view>

        <view class="asset-panel__content">
          <!-- 收入项 -->
          <view class="asset-item">
            <view class="asset-item__value">
              +{{ teamFinance.total_income }}<view class="asset-item__unit">
                元
              </view>
            </view>
            <view class="asset-item__label">
              收入
            </view>
          </view>

          <!-- 分隔线 -->
          <view class="asset-divider" />

          <!-- 支出项 -->
          <view class="asset-item">
            <view class="asset-item__value">
              -{{ teamFinance.total_expense }}<view class="asset-item__unit">
                元
              </view>
            </view>
            <view class="asset-item__label">
              支出
            </view>
          </view>

          <!-- 分隔线 -->
          <view class="asset-divider" />

          <!-- 余额项 -->
          <view class="asset-item">
            <view class="asset-item__value">
              {{ teamFinance.balance }}<view class="asset-item__unit">
                元
              </view>
            </view>
            <view class="asset-item__label">
              余额
            </view>
          </view>
        </view>
      </view>

      <!-- 资产面板 -->
      <view class="asset-panel">
        <view class="asset-panel__title">
          球队资产
        </view>

        <view class="asset-panel__content">
          <block v-for="item in teamAssets" :key="item._id">
            <view class="asset-item">
              <view class="asset-item__value">
                {{ item.amount }}<view class="asset-item__unit">
                  {{ item.unit }}
                </view>
              </view>
              <view class="asset-item__label">
                {{ item.name }}
              </view>
            </view>

            <!-- 分隔线 -->
            <view class="asset-divider" />
          </block>
        </view>
      </view>
    </view>
    <copyright />
  </view>
</template>

<script setup lang="ts">
import { useAppStore, useTeamStore } from '@/store'

const appStore = useAppStore()
const navbarTotalHeight = computed(() => appStore.getSystemInfo.statusBarHeight + 44)

const teamStore = useTeamStore()
const teamAssets = computed(() => teamStore.team_assets)
const teamFinance = computed(() => teamStore.team_finance)

onMounted(() => {

})
</script>

<style lang="scss" scoped>
.asset-panel {
  @apply mx-24 mb-20 px-24 py-20 rounded-lg bg-panel;

  &__title {
    @apply h-50 bg-[length:115rpx_15rpx] bg-gradient-to-r from-[#d2a783] bg-left-bottom bg-no-repeat pt-10 text-36;
  }

  &__content {
    @apply flex items-center justify-between mt-25 pb-10 min-h-90;
  }
}

.asset-item {
  @apply flex-1 text-center;
  &__value {
    @apply flex items-baseline justify-center text-38 font-bold;
  }

  &__unit {
    @apply text-22 font-normal pl-5;
  }

  &__label {
    @apply mt-10 text-26 text-gray-400;
  }
}

.asset-divider {
  @apply h-40 w-2 bg-line;
}

.asset-divider:last-of-type {
  @apply hidden;
}
</style>
