<template>
  <u-popup
    :show="showDialog"
    mode="center"
    bg-color="transparent"
    overlay-opacity="0.8"
    :safe-area-inset-bottom="false"
    :close-on-click-overlay="false"
  >
    <view class="flex-col-center -mt-80">
      <!-- 关闭按钮 -->
      <view class="w-660">
        <view class="float-right w-64">
          <image
            src="/static/images/result-dialog/ic-close.png"
            mode="widthFix"
            @click="handleClose"
          />
        </view>
      </view>

      <view class="relative z-2 flex-col-center overflow-hidden rounded-xl bg-background w-660 h-420">
        <!-- 中奖提示 -->
        <block v-if="prizeInfo?.status === 'won'">
          <view class="flex-start">
            <view class="relative w-370 left-0">
              <image src="https://img14.360buyimg.com/n7/jfs/t1/23011/18/29173/54148/665ee53cF87ed7142/f325fb2464ec72bb.png" mode="aspectFit" />
            </view>
            <view class="relative h-100% flex-col-center text-center color-#F00A0A w-370 -ml-80">
              <!-- 实物奖 -->
              <block v-if="prizeInfo?.type === 'physical'">
                <view class="mb-40 text-30">
                  恭喜你获得
                </view>
                <view class="font-bold leading-54 text-40">
                  1元换购魔力<br>550mL一瓶
                </view>
                <view class="text-30">
                  （换购产品随机）
                </view>
                <view class="color-#000 mt-40 leading-35">
                  实物瓶盖为唯一兑奖凭证，<br>请妥善保管
                </view>
              </block>
              <!-- 现金红包 -->
              <block v-if="prizeInfo?.type === 'cash'">
                <view class="mb-50 text-30">
                  恭喜你获得
                </view>
                <view class="font-bold mb-70 leading-54 text-40">
                  红包888元
                </view>
              </block>
            </view>
          </view>
        </block>

        <!-- 未中奖提示 -->
        <block v-else-if="prizeInfo?.status === 'lost'">
          <view class="flex-col-center-center h-140">
            <view class="text-center color-#F77600 font-bold px-35 leading-90 text-48">
              该瓶盖已中奖红包888元
            </view>
            <view class="font-bold leading-90 text-48">
              <text v-if="prizeInfo.isExchanged" class="color-#007E41">
                已兑换
              </text>
              <text v-else class="color-#F77600">
                尚未兑换
              </text>
            </view>
          </view>
          <view class="mt-40 h-72 leading-48">
            <view>扫码时间：{{ prizeInfo.scanTime }}</view>
            <view>兑奖截止：{{ prizeInfo.exchangeTime }}</view>
          </view>
        </block>

        <!-- 参与受限提示 -->
        <block v-else-if="prizeInfo?.status === 'fail'">
          <view class="flex-col-center-center h-140">
            <view class="text-center color-#F77600 font-bold px-35 leading-90 text-48">
              您累计参与次数已达上限， 无法参与活动
            </view>
          </view>
        </block>
      </view>
      <!-- 装饰条 -->
      <view class="rounded-2xl bg-#88CC34 w-660 h-50 -mt-40" />

      <view class="mt-80 h-230">
        <!-- 操作按钮 -->
        <block v-if="!prizeInfo?.isExchanged">
          <view class="h-100">
            <u-button
              color="#88CC34"
              :custom-style="{
                width: '540rpx',
                height: '100rpx',
                fontSize: '46rpx',
                fontWeight: 'bold',
              }"
              @click="handleConfirm"
            >
              立即领取
            </u-button>
          </view>

          <!-- 提示话术 -->
          <view class="flex-start text-center mx-40 mt-40">
            <u-icon name="error-circle-fill" color="#fff" size="20" />
            <view class="color-white pl-10 leading-46 text-30">
              请于中奖后30天内带上实物瓶盖到兑奖点兑奖<br>中奖记录可在「我的奖品」中查看
            </view>
          </view>
        </block>
      </view>
    </view>

    <!-- 购物车图标 -->
    <view class="fixed top-50% mt-260 w-150 right-15">
      <image
        src="/static/images/result-dialog/ic-cart.png"
        mode="aspectFit"
        @click="handleGoToShop"
      />
    </view>
  </u-popup>
</template>

<script setup lang='ts'>
import { defaultPrizeInfo, type PrizeInfo } from '@/types/modules/prize'
import { navigateToMiniApp } from '@/utils/navigate'

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    prizeInfo: PrizeInfo; // 奖品信息
  }>(),
  {
    prizeInfo: () => (defaultPrizeInfo),
  },
)

const emit = defineEmits(['update:modelValue', 'close', 'confirm'])

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

function handleClose() {
  showDialog.value = false
  emit('close')
}

function handleConfirm() {
  emit('confirm')
}

function handleGoToShop() {
  navigateToMiniApp({
    appId: 'wx6fb110526c12fc40',
    path: 'sub1/pages/ys-Exchange/ys-Exchange',
  })
}
</script>
