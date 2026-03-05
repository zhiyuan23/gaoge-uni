<template>
  <t-popup
    :visible="show"
    placement="bottom"
    :custom-style="{ background: 'transparent' }"
    :overlay-props="{ backgroundColor: 'rgba(0, 0, 0, 0)' }"
    :safe-area-inset-bottom="false"
    :close-on-overlay-click="true"
    @visible-change="onVisibleChange"
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
          <!-- 表头 -->
          <view v-if="props.loading || props.data?.length" class="px-55">
            <view class="text-bold flex-center h-74 text-28">
              <view class="pr-10 w-170">
                奖品名称
              </view>
              <view class="w-110">
                状态
              </view>
              <view class="w-355">
                详情
              </view>
            </view>

            <view
              v-for="item in props.data"
              :key="item.id"
              class="flex-center h-110 text-24 border-b-1-solid-#e8e8e8 last:border-b-0 last:pb-50"
            >
              <!-- 奖品名称 -->
              <view class="pr-10 w-170">
                {{ item.prizeName }}
              </view>

              <!-- 状态 -->
              <view
                class="font-bold w-110"
                :style="{ color: getStatusColor(item.status) }"
              >
                {{ item.statusName }}
              </view>

              <!-- 详情列 -->
              <view class="flex-col-start flex-1 text-#463628 w-355">
                <!-- 未兑奖 -->
                <view v-if="item.status === 'to_be_exchange'" class="flex-col-start-center">
                  <view
                    v-if="item.prizeType === 'small_red_envelope'"
                    class="t-press btn"
                    :style="{ backgroundColor: color }"
                    @click="handleAction('withdraw', item.id)"
                  >
                    立即领取
                  </view>
                  <view
                    v-else-if="item.prizeType === 'large_red_envelope'"
                    class="btn t-press"
                    :style="{ backgroundColor: color }"
                    @click="handleAction('fillInfo', item.id)"
                  >
                    填写兑奖信息
                  </view>
                  <view
                    v-else-if="item.prizeType === 'one_yuan_exchange'"
                    class="btn t-press"
                    :style="{ backgroundColor: color }"
                    @click="handleAction('nearbyStore', item.id)"
                  >
                    附近兑奖点
                  </view>

                  <text class="mt-10">
                    兑奖截止：{{ item.memExchangeEndTime }}
                  </text>
                </view>

                <!-- 已兑奖 -->
                <template v-else-if="item.status === 'exchanged'">
                  <view class="w-full">
                    <text v-if="item.prizeType === 'one_yuan_exchange'" class="block truncate">
                      兑奖点：{{ item.exchangeStoreName }}
                    </text>
                    <text class="block mt-4">
                      兑奖时间：{{ item.exchangeTime }}
                    </text>
                  </view>
                </template>

                <!-- 已过期 -->
                <template v-else-if="item.status === 'expired'">
                  <text>
                    过期时间：{{ item.memExchangeEndTime }}
                  </text>
                </template>
              </view>
            </view>
          </view>

          <!-- 空数据 -->
          <view v-else class="flex-col-center-center">
            <image :src="`${IMG_BASE_URL}/icons/ic-empty.png`" class="size-240 mt-130" />
            <text class="text-bold color-#918A84 mt-122 text-32">
              暂无中奖记录 快去参与活动抽奖吧
            </text>
          </view>
        </scroll-view>
      </view>
    </view>
  </t-popup>
</template>

<script setup lang="ts">
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

const onVisibleChange = ({ visible }: { visible: boolean }) => {
  if (!visible) {
    handleClose()
  }
}

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
    case 'to_be_exchange': return '#473729'
    case 'exchanged': return color
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
  @apply rounded-12 text-white px-20 text-22 h-38 leading-38;
}
</style>
