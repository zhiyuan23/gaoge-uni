<template>
  <view v-if="currentWinner" class="pointer-events-none z-50 top-200 top-24 right-0 left-0">
    <view
      v-if="shouldRender"
      :key="`${currentWinner.id}-wrapper`"
      class="animate-marquee mx-auto inline-flex truncate rounded-5 bg-white/60 text-black px-24 leading-40 text-22"
    >
      <text class="truncate">
        {{ currentWinner.userName || '神秘用户' }}，抽中
        <text class="">
          {{ currentWinner.prizeName || '神秘大奖' }}
        </text>！
      </text>
    </view>
  </view>
</template>

<script setup lang='ts'>
const props = defineProps<{ list?: any[] }>()

const shouldRender = ref(true)
const winners = ref<any[]>([])
const currentWinner = ref<any>(null)
let interval: number | null = null

const resetAndStartCarousel = (list: any[]) => {
  if (!list?.length) {
    currentWinner.value = null
    winners.value = []
    if (interval) {
      clearInterval(interval)
      interval = null
    }
    return
  }

  winners.value = list.map((item, index) => ({
    ...item,
    id: item.id || Date.now() + index,
  }))

  if (interval) {
    clearInterval(interval)
    interval = null
  }

  let index = 0

  const showNext = () => {
    shouldRender.value = false

    setTimeout(() => {
      currentWinner.value = winners.value[index]
      index = (index + 1) % winners.value.length
      shouldRender.value = true
    }, 50)
  }

  showNext()
  interval = setInterval(showNext, 3800)
}

watch(
  () => props.list,
  (newList) => {
    resetAndStartCarousel(newList ?? [])
  },
  { immediate: true, deep: true },
)

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
@keyframes marquee {
  0% {
    opacity: 0;
    transform: translateY(30rpx);
  }

  15% {
    opacity: 1;
    transform: translateY(0);
  }

  85% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(-30rpx);
  }
}

.animate-marquee {
  animation: marquee 3.8s ease-in-out forwards;
}
</style>
