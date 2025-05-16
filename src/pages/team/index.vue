<template>
  <view class="page-wrap">
    <!-- 导航栏占位 -->
    <view :style="{ height: `${navbarTotalHeight}px` }" />
    <view class="bg">
      <image src="/static/images/bg_team.png" mode="widthFix" />
    </view>
    <view class="container">
      <!-- 队名 -->
      <view class="team-name">
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
  teamStore.getAssetList()
  teamStore.getFinanceDetail()
})
</script>

<style lang="scss" scoped>
.bg {
  @apply absolute top-0 left-0 right-0 h-380rpx z-10;
  image {
    @apply w-full h-full;
  }
}
.container {
  @apply relative z-20;

  .team-name {
    @apply m-24rpx px-24rpx;
  }
  .asset-panel {
    @apply mx-24rpx mb-20rpx px-24rpx py-20rpx rounded-lg bg-panel;

    &__title {
      @apply h-50rpx bg-[length:115rpx_15rpx] bg-gradient-to-r from-[#d2a783] bg-left-bottom bg-no-repeat pt-10rpx text-36rpx;
    }

    &__content {
      @apply flex items-center justify-between mt-25rpx pb-10rpx min-h-90rpx;
    }
  }

  .asset-item {
    @apply flex-1 text-center;
    &__value {
      @apply flex items-baseline justify-center text-38rpx font-bold;
    }

    &__unit {
      @apply text-22rpx font-normal pl-5rpx;
    }

    &__label {
      @apply mt-10rpx text-26rpx text-gray-400;
    }
  }

  .asset-divider {
    @apply h-40rpx w-2rpx bg-[#343a4e];
  }

  .asset-divider:last-of-type {
    @apply hidden;
  }
}
</style>
