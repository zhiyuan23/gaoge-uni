<template>
  <view class="page w-screen overflow-x-hidden" :style="{ backgroundColor: redeem.bgColor }">
    <view class="w-full h-30" />
    <view class="rounded-2.5 mx-18 px-12 pt-45" :style="{ backgroundColor: redeem.bgSubColor }">
      <!-- 红包信息 -->
      <view class="relative mb-28 w-687 h-185">
        <image
          :src="`/static/images/prize/redeem-hd-${themeCode}.png`"
          class="absolute size-full"
        />
        <view class="relative h-full flex-col-start-center top-0 left-100" :style="{ color: redeem.color }">
          <view class="font-bold text-40">
            888元红包
          </view>
          <view>兑换期限：2026.11.01-2026.12.31</view>
          <view>12天后过期</view>
        </view>
      </view>

      <!-- 表单信息 -->
      <view class="rounded-2.5 bg-white h-520" :style="{ color: redeem.color }">
        <view class="text-center font-bold pt-14 leading-66">
          请填写兑奖信息
        </view>

        <view class="flex-center mx-20 h-96 border-b-1-solid-#E0E0E0">
          <text class="color-red mr-2">
            *
          </text>
          <text class="font-500 w-140">
            姓名
          </text>
          <input
            v-model.trim="form.name"
            type="text"
            :maxlength="20"
            placeholder="填写姓名"
            placeholder-style="color:#C0C4CC"
            class="flex-1 text-26"
          >
        </view>

        <view class="flex-center mx-20 h-96 border-b-1-solid-#E0E0E0">
          <text class="color-red mr-2">
            *
          </text>
          <text class="font-500 w-140">
            身份证号
          </text>
          <input
            v-model.trim="form.idCard"
            type="text"
            :maxlength="18"
            placeholder="填写身份证号"
            placeholder-style="color:#C0C4CC"
            class="flex-1 text-26"
          >
        </view>

        <view class="flex-center mx-20 h-96 border-b-1-solid-#E0E0E0">
          <text class="color-red mr-2">
            *
          </text>
          <text class="font-500 w-140">
            银行卡号
          </text>
          <input
            v-model.trim="form.bankCard"
            type="digit"
            :maxlength="19"
            placeholder="填写银行卡号"
            placeholder-style="color:#C0C4CC"
            class="flex-1 text-26"
          >
        </view>

        <view class="w-full text-center pt-33 pb-50">
          <MainButton
            label="提交"
            width="460"
            height="70"
            @click="handleSubmit"
          />
        </view>
      </view>

      <!-- 温馨提示 -->
      <view class="flex-col-center mx-28" :style="{ color: redeem.color }">
        <view class="font-bold pt-68 pb-34">
          温馨提示
        </view>
        <view class="pb-84 leading-38 text-22">
          收集个人信息用于代缴中奖者个人所得税，信息提交后无法更改，请确认正确无误后再进行提交，信息确认后会在72小时内转账至银行卡，如因所提供的信息不准确而造成无法兑换奖品的，损失由消费者自行承担。消费者因奖品过期失效而无法填写信息的，将视为自动放弃兑奖。
        </view>
        <view class="relative w-full flex-center-end pb-80">
          <image
            :src="`/static/images/prize/ic-service-${themeCode}.png`"
            class="w-98 h-74"
          />
          <button
            open-type="contact"
            class="absolute z-10 opacity-0 w-120 h-98 top-0 right-0"
          />
        </view>
      </view>
    </view>
    <view class="w-100vw h-30" />
  </view>

  <PosterShare
    ref="posterGenerator"
    bg-img="https://youke2.picui.cn/s1/2025/12/20/69466dece70be.png"
    :avatar="profile.avatarUrl"
    :nickname="profile.nickname"
    :money="prizeDetail.cash"
  />
</template>

<script setup lang='ts'>
import { useTheme } from '@/composables'
import useProfileStore from '@/store/profile'
import { Dialog, Loading } from '@/utils'
import PosterShare from './poster.vue'

const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)
const { themeCode, color, redeem } = useTheme()

const posterGenerator = ref<any>(null)
const prizeDetail = ref({
  cash: '888',
})
const form = reactive({
  name: '',
  idCard: '',
  bankCard: '',
})

// 身份证正则（支持15/18位）
// const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}([\dX])$)/i

// 提交处理
const handleSubmit = async () => {
  // 必填校验
  if (!form.name) {
    Dialog('请填写姓名')
    return
  }
  if (!form.idCard) {
    Dialog('请填写身份证号')
    return
  }
  if (!form.bankCard) {
    Dialog('请填写银行卡号')
    return
  }

  // // 身份证格式校验
  // if (!idCardReg.test(form.idCard)) {
  //   Dialog('身份证号格式不正确')
  //   return
  // }

  // // 银行卡校验（长度+纯数字+Luhn）
  // if (form.bankCard.length < 16 || form.bankCard.length > 19 || !/^\d+$/.test(form.bankCard)) {
  //   Dialog('银行卡号长度或格式不正确')
  //   return
  // }

  await Dialog(
    '信息提交后无法更改，请确认正确无误后再进行提交，如因所提供的信息不准确而造成无法兑换奖品的，损失由消费者自行承担',
    {
      showCancel: true,
      confirmText: '确认兑奖',
      confirmColor: color,
    },
  )

  Loading.show('提交中...')

  try {
    await posterGenerator.value?.generateSharePoster()
  }
  finally {
    Loading.hide()
  }
}

onLoad(() => {
  profileStore.fetchProfile()
  // myPrizeStore.fetchDetail()
})
</script>
