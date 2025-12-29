<template>
  <u-popup
    :show="show"
    mode="bottom"
    bg-color="transparent"
    overlay-opacity="0.0"
    :safe-area-inset-bottom="false"
    :close-on-click-overlay="true"
    @close="handleClose"
  >
    <view class="flex-col-center">
      <view class="relative w-full overflow-hidden">
        <PopupHeader
          title="我的奖品"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        />

        <scroll-view
          scroll-y
          class="h-78vh bg-background"
          @scrolltolower="loadMore"
        >
          <!-- 加载中-正常加载速度不需要添加 -->
          <!-- <view v-if="props.loading" class="h-60vh flex flex-col items-center justify-center">
            <u-loading-icon mode="semicircle" />
            <text class="text-#999 mt-30 text-28">
              加载中...
            </text>
          </view> -->

          <!-- 表头 -->
          <view v-if="props.loading || props.data?.length" class="px-55">
            <view class="flex-center font-bold mb-20 h-74 text-28">
              <view class="w-170">
                奖品名称
              </view>
              <view class="w-130">
                状态
              </view>
              <view class="flex-1">
                详情
              </view>
            </view>

            <view
              v-for="item in props.data"
              :key="item.id"
              class="flex-center py-20 text-22 border-b-1-solid-#e8e8e8 last:border-b-0 last:pb-50"
            >
              <!-- 奖品名称 -->
              <view class="pr-10 w-160">
                {{ item.prizeName }}
              </view>

              <!-- 状态 + 颜色 -->
              <view
                class="font-bold w-130"
                :style="{ color: getStatusColor(item.status) }"
              >
                {{ item.statusName }}
              </view>

              <!-- 详情列 -->
              <view class="flex-col-end">
                <!-- 未兑奖 -->
                <template v-if="item.status === 'to_be_exchange'">
                  <view
                    v-if="item.prizeType === 'small_red_envelope'"
                    class="btn u-press"
                    :style="{ backgroundColor: color }"
                    @click="handleAction('withdraw', item.id)"
                  >
                    立即领取
                  </view>
                  <view
                    v-else-if="item.prizeType === 'large_red_envelope'"
                    class="btn u-press"
                    :style="{ backgroundColor: color }"
                    @click="handleAction('fillInfo', item.id)"
                  >
                    填写兑奖信息
                  </view>
                  <view
                    v-else-if="item.prizeType === 'one_yuan_exchange'"
                    class="btn u-press"
                    :style="{ backgroundColor: color }"
                    @click="handleAction('nearbyStore', item.id)"
                  >
                    附近兑奖门店
                  </view>

                  <text class="text-#666 mt-10">
                    兑奖截止：{{ item.memExchangeEndTime }}
                  </text>
                </template>

                <!-- 已兑奖 -->
                <template v-else-if="item.status === 'exchanged'">
                  <view>
                    <text v-if="item.type === '实物'" class="block text-#666">
                      兑奖点：{{ item.exchangeStoreName }}
                    </text>
                    <text class="block text-#666 mt-4">
                      兑奖时间：{{ item.exchangeTime }}
                    </text>
                  </view>
                </template>

                <!-- 已过期 -->
                <template v-else-if="item.status === 'expired'">
                  <text class="text-#999">
                    过期时间：{{ item.memExchangeEndTime }}
                  </text>
                </template>
              </view>
            </view>
          </view>

          <!-- 空数据 -->
          <view v-else class="flex-col-center-center">
            <image :src="`${IMG_BASE_URL}/icons/ic-empty.png`" class="size-240 mt-130" />
            <text class="font-bold mt-122 text-30">
              暂无中奖哦  快去参与活动抽奖吧
            </text>
          </view>
        </scroll-view>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang='ts'>
import { useTheme } from '@/composables'
import { IMG_BASE_URL } from '@/constants'

const props = defineProps<{
  data?: Array<any>;
  // 分页状态，由父组件控制
  loading?: boolean; // 是否正在加载下一页
  hasMore?: boolean; // 是否还有更多数据
}>()

const emit = defineEmits<{
  close: [];
  action: [item: any, type: 'nearbyStore' | 'fillInfo' | 'withdraw'];
  loadmore: [];
}>()

const { color } = useTheme()
const show = defineModel<boolean>({ required: true })

// 关闭弹窗
const handleClose = () => {
  show.value = false
  emit('close')
}

// 操作按钮
const handleAction = (type: 'nearbyStore' | 'fillInfo' | 'withdraw', id: any) => {
  emit('action', type, id)
}

// 状态颜色
const getStatusColor = (status: string) => {
  switch (status) {
    case 'to_be_exchange': return color
    case 'exchanged': return '#000'
    case 'expired': return '#999'
    default: return '#666'
  }
}

// 触发加载更多
const loadMore = () => {
  if (!props.loading && props.hasMore) {
    emit('loadmore')
  }
}

// 手势下滑关闭
const startY = ref(0)
const currentY = ref(0)
const deltaY = ref(0)
const threshold = 100 // 下滑阈值

const handleTouchStart = (e: TouchEvent) => {
  startY.value = e.touches[0].pageY
}

const handleTouchMove = (e: TouchEvent) => {
  currentY.value = e.touches[0].pageY
  deltaY.value = currentY.value - startY.value
  if (deltaY.value > 0) {
    // 可以添加视觉反馈，如移动弹窗位置
    // 例如：弹窗样式 transform: translateY(${deltaY.value}px)
  }
}

const handleTouchEnd = () => {
  if (deltaY.value > threshold) {
    handleClose()
  }
  deltaY.value = 0
}
</script>

<style scoped>
.btn {
  @apply rounded-12 text-white px-20 text-22 h-38 leading-38 mb-10;
}

.flex-col-end {
  @apply flex flex-col items-end;
}
</style>
