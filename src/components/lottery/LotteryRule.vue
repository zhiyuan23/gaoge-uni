<template>
  <u-popup
    :show="show"
    mode="center"
    bg-color="transparent"
    overlay-opacity="0.8"
    :safe-area-inset-bottom="false"
    :close-on-click-overlay="true"
    @close="show = false"
  >
    <view class="flex-col-center -mt-200">
      <!-- 关闭按钮 -->
      <view class="w-680" @click="handleClose">
        <image
          src="/static/images/icons/ic-close.png"
          class="float-right size-60 py-20 pb-20"
        />
      </view>

      <!-- 主体区域 -->
      <view class="overflow-hidden rounded-2.5 w-680">
        <PopupHeader title="活动规则" />

        <view class="bg-background px-30 pb-40">
          <view class="title" :style="{ color }">
            活动说明
          </view>
          <rich-text
            class="rich-content leading-38 text-22"
            :nodes="props.ruleInfo"
          />

          <view class="title" :style="{ color }">
            活动范围
          </view>
          <view class="leading-38 text-22">
            中国境内(不含港、澳、台)
          </view>

          <view class="title" :style="{ color }">
            活动时间
          </view>
          <view class="leading-38 text-22">
            {{ props.endDate }}截止
          </view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang='ts'>
import { useTheme } from '@/composables'

const props = defineProps<{
  ruleInfo: string | undefined;
  endDate: string;
}>()

const { color } = useTheme()

const show = defineModel<boolean>({ required: true })

const handleClose = () => {
  show.value = false
}
</script>

<style scoped>
.title {
  @apply font-bold pt-46 leading-46;
}
</style>
