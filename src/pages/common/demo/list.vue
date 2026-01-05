<script setup lang="ts">
// 列表数据
const list = ref<Array<{ id: number;title: string;desc: string }>>([])
const pageNo = ref(1)
const pageSize = 10
const loadingMore = ref(false)
const noMore = ref(false)

// 模拟接口
const fetchList = async (page: number, size: number) => {
  await new Promise(resolve => setTimeout(resolve, 600))
  const data = Array.from({ length: size }, (_, i) => ({
    id: (page - 1) * size + i + 1,
    title: `标题 ${page}-${i + 1}`,
    desc: '这是一条示例数据',
  }))
  const noMoreData = page >= 3
  return { data, noMore: noMoreData }
}

// 加载列表函数
const loadList = async (refresh = false) => {
  if (refresh) pageNo.value = 1
  if (!refresh) loadingMore.value = true

  const res = await fetchList(pageNo.value, pageSize)
  if (refresh) {
    list.value = res.data
  }
  else {
    list.value = [...list.value, ...res.data]
  }

  noMore.value = res.noMore
  loadingMore.value = false
  if (refresh) uni.stopPullDownRefresh() // ✅ 使用全局 uni API
  if (!refresh) pageNo.value += 1
}

// 页面加载
onMounted(() => {
  loadList(true)
})
</script>

<template>
  <view class="min-h-screen bg-gray-100 p-20">
    <!-- 列表 -->
    <view v-for="item in list" :key="item.id" class="rounded bg-white shadow mb-16 p-20">
      <view class="text-lg font-bold">
        {{ item.title }}
      </view>
      <view class="text-sm text-gray-500 mt-2">
        {{ item.desc }}
      </view>
    </view>

    <!-- 上拉加载中 -->
    <view v-if="loadingMore" class="text-center text-gray-500 py-4">
      加载中...
    </view>

    <!-- 没有更多 -->
    <view v-if="noMore" class="text-center text-gray-400 py-4">
      —— 没有更多了 ——
    </view>
  </view>
</template>

<style lang="scss" scoped>
/* 额外样式可用 UnoCSS 替代 */
</style>
