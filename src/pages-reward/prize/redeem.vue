<script setup lang="ts">
import { fillInInfo, getMyPrizeDetail } from '@/api'
import { useTheme } from '@/composables'
import { useProfileStore, useSeriesStore } from '@/store'
import { Dialog, formatTime, Loading, Toast } from '@/utils'

const profileStore = useProfileStore()
const seriesStore = useSeriesStore()

const { themeCode, color, redeem } = useTheme()
const { userInfo } = storeToRefs(profileStore)
const { seriesDetail } = storeToRefs(seriesStore)

const posterGenerator = ref<any>(null)

const prizeDetail = ref()
const form = reactive({
  id: '',
  receivePrizeUserName: '',
  receivePrizeUserIdcard: '',
  bankCardNumber: '',
})

const beginDate = computed(() => formatTime(prizeDetail.value?.memExchangeBeginTime, { format: 'YYYY.MM.DD' }))
const endDate = computed(() => formatTime(prizeDetail.value?.memExchangeEndTime, { format: 'YYYY.MM.DD' }))

// 身份证正则（支持15/18位）
const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}([\dX])$)/i

onLoad((options: any) => {
  form.id = options.id

  getDetail(options.id)
})

const getDetail = async (id: string) => {
  prizeDetail.value = await getMyPrizeDetail(id)
}

// 提交处理
const handleSubmit = async () => {
  // 必填校验
  if (!form.receivePrizeUserName) {
    Toast('请填写姓名')
    return
  }
  if (!form.receivePrizeUserIdcard) {
    Toast('请填写身份证号')
    return
  }
  if (!form.bankCardNumber) {
    Toast('请填写银行卡号')
    return
  }

  // 身份证格式校验
  if (!idCardReg.test(form.receivePrizeUserIdcard)) {
    Toast('身份证号格式不正确')
    return
  }

  // 银行卡校验（长度+纯数字）
  if (form.bankCardNumber.length < 16 || form.bankCardNumber.length > 19 || !/^\d+$/.test(form.bankCardNumber)) {
    Toast('银行卡号长度或格式不正确')
    return
  }

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
    await fillInInfo(form)
    posterGenerator.value?.generateSharePoster()

    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 1]
    prevPage.$vm.fetchMyPrizeList()
  }
  finally {
    Loading.hide()
  }
}
</script>

<template>
  <view class="page w-screen overflow-x-hidden" :style="{ backgroundColor: redeem.bgColor }">
    <view class="w-full h-30" />
    <view class="rounded-2.5 mx-18 px-12 pt-45" :style="{ backgroundColor: redeem.bgSubColor }">
      <!-- 红包信息 -->
      <view class="relative mb-28 w-687 h-185">
        <image
          :src="`/pages-reward/static/images/prize/redeem-hd-${themeCode}.png`"
          class="absolute size-full"
        />
        <view class="relative h-full flex-col-start-center top-0 left-100" :style="{ color: redeem.color }">
          <view class="font-bold text-40">
            {{ prizeDetail.prizeName }}
          </view>
          <view>兑换期限：{{ beginDate }}-{{ endDate }}</view>
          <view>{{ prizeDetail.memExchangeMsg }}</view>
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
            v-model.trim="form.receivePrizeUserName"
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
            v-model.trim="form.receivePrizeUserIdcard"
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
            v-model.trim="form.bankCardNumber"
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
            :src="`/pages-reward/static/images/prize/ic-service-${themeCode}.png`"
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

  <LotteryPoster
    ref="posterGenerator"
    :bg-img="seriesDetail.poster"
    :avatar="userInfo.avatarUrl"
    :nickname="userInfo.nickName"
    :money="prizeDetail.bonus"
  />
</template>
