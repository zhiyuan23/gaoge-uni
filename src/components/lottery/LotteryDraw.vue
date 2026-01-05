<script setup lang="ts">
import { useTheme } from '@/composables'
import { IMG_BASE_URL } from '@/constants'
import { useAuthStore } from '@/store'

const props = defineProps<{
  loading?: boolean;
  loadingText?: string;
}>()

const emit = defineEmits<{
  close: any;
  confirm: any;
}>()

const authStore = useAuthStore()

const { themeCode } = useTheme()
const { isLogin, isMember, loading: authLoading } = storeToRefs(authStore)

const show = defineModel<boolean>({ required: true })

const loading = computed(() => props.loading || false)
const loadingText = computed(() => props.loadingText || '点击开奖')

const btnStyle = reactive({
  width: '540rpx',
  height: '102rpx',
})

// 隐私协议相关
const isAgree = ref(false)
const showPrivacy = ref(false)

// 点击登录
const handleLogin = (e: any) => {
  const phoneCode = e ? e.detail.code : ''
  authStore.login(phoneCode, false)
}

// 同意用户协议
const onAgree = () => {
  isAgree.value = true
}

const handleClose = () => {
  show.value = false
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

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
      <view class="z-9 w-570 h-140">
        <image
          src="/static/images/icons/ic-close.png"
          class="float-right size-60 p-40"
          @click="handleClose"
        />
      </view>

      <!-- 开奖标题图片 -->
      <image
        :src="`${IMG_BASE_URL}/lottery/draw-tit-${themeCode}.png`"
        class="w-460 h-200 -mt-68"
      />

      <!-- 开奖主图片 -->
      <image
        :src="`${IMG_BASE_URL}/lottery/draw-img-${themeCode}.png`"
        class="mt-8 w-520 h-520"
      />
      <MainButton
        label="点击开奖"
        icon="finger"
        :loading="loading || authLoading"
        :loading-text="loadingText"
        @click="handleConfirm"
      />

      <view v-if="!isLogin && !authLoading" class="z-10 opacity-1 -mt-102">
        <u-button
          v-if="!isAgree"
          :custom-style="btnStyle"
          @click="showPrivacy = true"
        />
        <block v-else>
          <u-button
            v-if="isMember"
            :custom-style="btnStyle"
            @click.stop="handleLogin"
          />
          <u-button
            v-else
            :custom-style="btnStyle"
            open-type="getPhoneNumber"
            @getphonenumber="handleLogin"
          />
        </block>
      </view>

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
