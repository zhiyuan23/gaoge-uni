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
    <view class="flex-col-center -mt-100">
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

        <view class="bg-background px-20 pb-30">
          <scroll-view
            scroll-y
            class="max-h-70vh"
          >
            <rich-text
              class="rich-content leading-38 text-22"
              :nodes="formattedRuleInfo"
            />
          </scroll-view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang='ts'>
import { formatRichText } from '@/utils'

const props = defineProps<{
  ruleInfo: string;
  endDate: string;
}>()

const show = defineModel<boolean>({ required: true })

const formattedRuleInfo = computed(() => {
  return formatRichText(props.ruleInfo)
})

const handleClose = () => {
  show.value = false
}
</script>

<style scoped>
/* .title {
  @apply font-bold pt-46 leading-46;
} */
</style>
