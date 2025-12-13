<template>
  <u-popup
    :show="show"
    mode="center"
    bg-color="transparent"
    overlay-opacity="0.6"
    :safe-area-inset-bottom="false"
    :close-on-click-overlay="true"
    @close="show = false"
  >
    <view class="flex-col-center -mt-200">
      <!-- 关闭按钮 -->
      <view class="w-680">
        <image
          src="/static/images/icons/ic-close.png"
          class="float-right size-60"
          @click="handleClose"
        />
      </view>

      <!-- 主体区域 -->
      <view class="overflow-hidden rounded-2.5 w-680">
        <view class="relative">
          <image
            :src="`/static/images/lottery/bg-rule-hd-${type}.png`"
            class="w-full h-132"
          />
          <view class="absolute w-full text-center text-white font-bold h-132 top-44 text-34">
            活动说明
          </view>
        </view>

        <view class="bg-background px-30 pb-40 -mt-2">
          <view class="color-textTheme font-bold pt-46 leading-46">
            说动说明
          </view>
          <view class="leading-38 text-22">
            【活动奖项设置】<br>
            特等奖:666元微信红包，中奖率0.00027%<br>
            一等奖:66元微信红包，中奖率0.005%<br>
            二等奖:2元微信红包，中奖率0.5%<br>
            三等奖:1元微信红包，中奖率1.0%<br>
            四等奖:0.5元微信红包，中奖率16.5%<br>
            幸运奖:壹元换购，线下指定兑奖点可兑，中奖率30%<br>
            以上奖项通过抽奖可得，活动装共投放135,000,000份，<br>
            活动总数与奖品数以实际投放数量为准，综合中奖率48%。
          </view>

          <view class="color-#FF8400 font-bold pt-46 leading-46">
            活动范围
          </view>
          <view class="leading-38 text-22">
            中国境内(不含港、澳、台)
          </view>

          <view class="color-#FF8400 font-bold pt-46 leading-46">
            活动时间
          </view>
          <view class="leading-38 text-22">
            2026年6月30日23:59:59截止
          </view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang='ts'>
const props = defineProps<{
  type?: string;
}>()

const emit = defineEmits<{
  close: [];
}>()

const show = defineModel<boolean>({ required: true })

const type = computed(() => props.type ?? 'ml')

const handleClose = () => {
  show.value = false
  emit('close')
}
</script>
