<template>
  <u-popup
    :show="show"
    mode="center"
    bg-color="transparent"
    overlay-opacity="0.0"
    :safe-area-inset-bottom="false"
    :close-on-click-overlay="false"
  >
    <view v-if="show" class="relative h-screen w-screen overflow-hidden">
      <view
        class="h-full flex-start-center transition-transform duration-0 will-change-transform"
        :style="{
          width: `${currentThemeConfig.total * 100}vw`,
          transform: `translate3d(-${(currentIndex - 1) * 100}vw, 0, 0)`,
        }"
      >
        <image
          v-for="i in currentThemeConfig.total"
          :key="i"
          :src="i === 1
            ? seriesDetail.openBottleImg
            : `${IMG_BASE_URL}/animation/gif-${themeCode}/pic-${i}.png`"
          mode="aspectFill"
          class="h-full w-screen flex-shrink-0 -translate-y-60rpx"
        />
      </view>

      <image
        v-if="!isPlaying"
        src="/static/images/icons/ic-close.png"
        class="absolute top-50% z-9 size-60 p-40 right-30"
        :class="isML ? '-mt-660' : '-mt-600'"
        @click="handleClose"
      />

      <view
        class="absolute top-50% z-10 w-full flex-col-center"
        :class="[
          { 'btn-fade-out': isPlaying && currentIndex !== 1 },
          ...ui.drawFooter,
        ]"
      >
        <MainButton
          label="点击开奖"
          type="draw"
          v-bind="ui.drawBtn"
          :loading="authLoading"
          :font-color="textColor"
          :icon-url="iconUrl"
          @click="handleConfirm"
        />

        <view v-if="!isLogin && !authLoading" class="z-10 opacity-0 -mt-120">
          <u-button v-if="!isAgree" :custom-style="loginBtnStyle" @click="showPrivacy = true" />
          <block v-else>
            <u-button v-if="isMember" :custom-style="loginBtnStyle" @click.stop="handleLogin" />
            <u-button v-else :custom-style="loginBtnStyle" open-type="getPhoneNumber" @getphonenumber="handleLogin" />
          </block>
        </view>

        <PrivacyInfo v-if="!isLogin" v-model="isAgree" :theme-code="themeCode" label-color="white" class="mt-30" />
      </view>
    </view>
  </u-popup>

  <PrivacyPopup v-model="showPrivacy" @agree="isAgree = true" />
</template>

<script setup lang="ts">
import { useTheme } from '@/composables'
import { IMG_BASE_URL } from '@/constants'
import { useAuthStore, useSeriesStore } from '@/store'
import { sleep } from '@/utils'

const props = defineProps<{
  loading?: boolean;
}>()
const emit = defineEmits<{
  close: [];
  confirm: [];
  finished: [];
}>()

const authStore = useAuthStore()
const seriesStore = useSeriesStore()
const { themeCode, textColor, ui } = useTheme()
const { isLogin, isMember, loading: authLoading } = storeToRefs(authStore)
const { seriesDetail } = storeToRefs(seriesStore)
const show = defineModel<boolean>({ required: true })

const isML = computed(() => themeCode.value === 'ml')
const isAgree = ref(false)
const showPrivacy = ref(false)
const loginBtnStyle = reactive({ width: '540rpx', height: '120rpx' })
const iconUrl = isML.value ? `${IMG_BASE_URL}/icons/ic-finger-ml.png` : ''

// 动画逻辑相关
const THEME_CONFIG: any = {
  ml: { total: 6, pauseAt: 5 },
  zwcs: { total: 6, pauseAt: 5 },
  zbqr: { total: 8, pauseAt: 6 },
}
const FPS_TIMER = 100
const STAY_TIME = 500
const currentThemeConfig = computed(() => THEME_CONFIG[themeCode.value])
const isPlaying = ref(false)
const currentIndex = ref(1)
let animationTimer: any = null

watch(show, (val) => {
  if (!val) clearAllTasks()
})

onUnmounted(() => {
  clearAllTasks()
})

const handleConfirm = () => {
  if (props.loading || authLoading.value || isPlaying.value) return
  emit('confirm')
}

const handleClose = () => {
  show.value = false
  setTimeout(() => {
    currentIndex.value = 1
  }, 200)
  emit('close')
}

const handleLogin = (e: any) => {
  const phoneCode = e?.detail?.code || ''
  authStore.login(phoneCode, false)
}

// 播放开奖动画
const playDrawAnim = () => {
  if (isPlaying.value) return
  isPlaying.value = true
  currentIndex.value = 1

  const { total, pauseAt } = currentThemeConfig.value

  const next = () => {
    if (!show.value || !isPlaying.value) return

    if (currentIndex.value < total) {
      // 开始播放
      currentIndex.value++

      let delay = FPS_TIMER

      // 停顿帧
      if (currentIndex.value === pauseAt) {
        delay = STAY_TIME
      }

      // 最后一帧
      if (currentIndex.value === total) {
        emit('finished')
      }

      // 进入下一帧
      animationTimer = setTimeout(next, delay)
    }
    else {
      // 动画完成
      stopDrawAnim()
    }
  }

  // 启动第一跳
  animationTimer = setTimeout(next, FPS_TIMER)
}

// 停止开奖动画
const stopDrawAnim = async () => {
  if (animationTimer) clearTimeout(animationTimer)
  await sleep(200)
  show.value = false
  isPlaying.value = false
  currentIndex.value = 1
}

// 清除定时任务
const clearAllTasks = () => {
  if (animationTimer) {
    clearTimeout(animationTimer)
    animationTimer = null
  }
  isPlaying.value = false
}

defineExpose({ playDrawAnim })
</script>

<style lang="scss" scoped>
.btn-fade-out {
  animation: fadeOut 0.6s ease-out forwards;
  pointer-events: none;
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>
