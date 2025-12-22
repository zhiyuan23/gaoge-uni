<template>
  <u-popup
    :show="show"
    mode="center"
    bg-color="transparent"
    overlay-opacity="0.8"
    :safe-area-inset-bottom="false"
    :close-on-click-overlay="false"
  >
    <view class="flex-col-center -mt-150">
      <!-- 关闭按钮 -->
      <view class="z-9 w-570">
        <image
          src="/static/images/icons/ic-close.png"
          class="float-right size-60 p-40"
          @click="handleClose"
        />
      </view>

      <!-- 开奖标题图片 -->
      <image
        :src="`/static/images/lottery/main-tit-${seriesCode}.png`"
        class="w-460 h-200 -mt-68"
      />

      <!-- 开奖主图片 -->
      <image
        :src="`/static/images/lottery/main-img-${seriesCode}.png`"
        class="mt-8 w-520 h-520"
      />

      <MainButton
        label="点击开奖"
        icon="finger"
        :loading="loading"
        :loading-text="loadingText"
        @click="handleConfirm"
      />

      <!-- 隐私协议展示组件 -->
      <PrivacyInfo
        v-if="!isLogin"
        v-model="isAgree"
        label-color="white"
        class="fixed bottom-100"
      />
    </view>
  </u-popup>

  <!-- 隐私协议弹窗组件 -->
  <PrivacyPopup v-model="showPrivacy" @agree="onAgree" />
</template>

<script setup lang='ts'>
import { useAuth, useTheme } from '@/composables'

const props = defineProps<{
  loading?: boolean;
  loadingText?: string;
}>()

const emit = defineEmits<{
  close: any;
  confirm: any;
}>()

const { seriesCode } = useTheme()

const { isLogin } = useAuth()

const show = defineModel<boolean>({ required: true })

const loading = computed(() => props.loading || false)
const loadingText = computed(() => props.loadingText || '加载中')

// 隐私协议相关
const isAgree = ref(false)
const showPrivacy = ref(false)

// 同意用户协议
const onAgree = () => {
  isAgree.value = true
}

const handleClose = () => {
  show.value = false
  emit('close')
}

const handleConfirm = () => {
  if (!isLogin && !isAgree.value) {
    showPrivacy.value = true
  }
  else {
    emit('confirm')
  }
}
</script>
