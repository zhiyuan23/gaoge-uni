<template>
  <u-popup
    :show="show"
    mode="bottom"
    bg-color="transparent"
    overlay-opacity="0.6"
    :safe-area-inset-bottom="false"
    :close-on-click-overlay="true"
    @close="show = false"
  >
    <view class="flex-col-center">
      <!-- 主体区域 -->
      <view class="w-full rounded-1.5 bg-ml">
        <view class="relative overflow-hidden h-110">
          <image
            :src="`/static/images/lottery/bg-rule-hd-${type}.png`"
            mode="widthFix"
            class="w-full"
          />
          <view class="absolute w-full text-center text-white font-bold h-132 top-44 text-34">
            客服电话
          </view>
        </view>
        <view class="relative rounded-[12rpx_12rpx_0rpx_0rpx] bg-[linear-gradient(41deg,_#D6DADD,_#FFFFFF,_#FFFFFF,_#DDE2E4)] bg-background mx-25 h-430">
          <view class="flex-col-center-center px-30 pt-62">
            <view class="flex-center-center">
              <image src="/static/images/lottery/ic-service.png" class="size-70" />
              <view class="color-textTheme font-bold pl-22 text-38">
                400-123-1234
              </view>
            </view>
            <view class="mt-20">
              工作时间：工作日9:00～17:00
            </view>
          </view>

          <view class="flex-center-center mt-40 pb-20">
            <view class="mr-60 w-240">
              <u-button
                type="default"
                shape="circle"
                :custom-style="{
                  background: '#fff',
                  color: '#333',
                }"
                @click="handleClose"
              >
                取消
              </u-button>
            </view>
            <view class="w-240">
              <u-button
                type="primary"
                shape="circle"
                color="var(--theme-ml)"
                @click="handleCall('400-123-1234')"
              >
                呼叫
              </u-button>
            </view>
          </view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
const props = defineProps<{
  type?: string;
}>()

const emit = defineEmits<{
  close: [];
}>()

const show = defineModel<boolean>({ required: true })

const type = computed(() => props.type ?? 'ml')

// 打电话
const handleCall = (phoneNumber: string) => {
  uni.makePhoneCall({
    phoneNumber,
  })
}

// 关闭弹窗
const handleClose = () => {
  show.value = false
  emit('close')
}
</script>
