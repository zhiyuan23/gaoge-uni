<script setup lang="ts">
import { onHide, onShow } from '@dcloudio/uni-app'
import { onUnmounted, ref, watch } from 'vue'

const props = defineProps<{ list?: any[] }>()

const shouldRender = ref(false)
const winners = ref<any[]>([])
const currentWinner = ref<any>(null)

let intervalId: number | null = null
let timeoutId: number | null = null

// 彻底停止所有定时任务
const stopCarousel = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

// 启动轮播逻辑
const startCarousel = (list: any[]) => {
  stopCarousel()

  if (!list?.length) {
    currentWinner.value = null
    winners.value = []
    return
  }

  winners.value = list.map((item, index) => ({
    ...item,
    id: item.id || `winner-${Date.now()}-${index}`,
  }))

  let index = 0

  const showNext = () => {
    shouldRender.value = false

    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      currentWinner.value = winners.value[index]
      index = (index + 1) % winners.value.length
      shouldRender.value = true
      timeoutId = null
    }, 150) as any
  }

  // 立即执行第一次
  showNext()
  // 开启循环
  intervalId = setInterval(showNext, 3800) as any
}

// 如果数据内容没变，则不重启轮播
watch(
  () => props.list,
  (newList, oldList) => {
    if (JSON.stringify(newList) === JSON.stringify(oldList)) return
    startCarousel(newList ?? [])
  },
  { immediate: true, deep: true },
)

onUnmounted(stopCarousel)

onHide(stopCarousel)

onShow(() => {
  if (props.list?.length) {
    startCarousel(props.list)
  }
})
</script>

<template>
  <view
    v-if="currentWinner"
    class="pointer-events-none z-50 flex justify-center top-24 right-0 left-0"
  >
    <view
      v-if="shouldRender"
      :key="currentWinner.id"
      class="animate-marquee mx-auto inline-flex items-center rounded-full bg-white/60 text-black shadow-sm backdrop-blur-sm px-24 h-40 text-22"
    >
      <text class="truncate">
        恭喜用户{{ currentWinner.userName || '神秘用户' }}，抽中
        <text>
          {{ currentWinner.prizeName || '神秘大奖' }}
        </text>！
      </text>
    </view>
  </view>
</template>

<style scoped>
@keyframes marquee {
  0% {
    opacity: 0;
    transform: translateY(20rpx);
  }

  10% {
    opacity: 1;
    transform: translateY(0);
  }

  90% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(-20rpx);
  }
}

.animate-marquee {
  animation: marquee 3.8s ease-in-out forwards;
  will-change: transform, opacity;
}
</style>
