<template>
  <view class="page relative w-screen overflow-x-hidden" :data-theme="themeCode">
    <!-- 页面背景图 -->
    <image
      :src="`${IMG_BASE_URL}/prize/bg-redeem-${themeCode}.png`"
      class="absolute w-full"
      mode="widthFix"
    />
    <view v-if="prizeDetail" class="relative mx-32 pt-76">
      <!-- 红包信息 -->
      <view class="card relative mb-28 w-686 h-185" :data-theme="themeCode">
        <image
          :src="`${IMG_BASE_URL}/prize/redeem-hd-${themeCode}.png`"
          class="absolute size-full"
        />
        <view class="relative h-full flex-col-start-center top-0 left-100 text-26">
          <view class="text-heavy text-40">
            {{ prizeDetail.prizeName }}
          </view>
          <view>兑换期限：{{ beginDate }}-{{ endDate }}</view>
          <view>{{ prizeDetail?.memExchangeMsg }}</view>
        </view>
      </view>

      <!-- 表单信息 -->
      <view class="rounded-2.5 bg-white color-#473729">
        <view class="text-center font-bold pt-14 leading-66">
          请填写兑奖信息
        </view>

        <view class="flex-center mx-20 h-96 border-b-1-solid-#E0E0E0">
          <text class="color-red mr-2">
            *
          </text>
          <text class="font-500 w-140">
            姓&#12288;&#12288;名
          </text>
          <input
            v-model.trim="form.receivePrizeUserName"
            type="text"
            :disabled="isSubmitted"
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
            :disabled="isSubmitted"
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
            :disabled="isSubmitted"
            :maxlength="19"
            placeholder="填写银行卡号"
            placeholder-style="color:#C0C4CC"
            class="flex-1 text-26"
          >
        </view>

        <view v-if="!isSubmitted" class="w-full flex-center-center pt-33">
          <view
            class="t-press flex-center-center rounded-4 color-white w-460 h-70"
            :style="{ background: color }"
            @click="handleSubmit"
          >
            提交
          </view>
        </view>
        <view class="w-full h-50" />
      </view>

      <!-- 温馨提示 -->
      <view class="mx-12 mt-60 pb-84">
        <rich-text
          class="rich-content leading-38 text-22"
          :nodes="formattedNotice"
        />

        <!-- 客服图标 open-type="contact" -->
        <view class="relative w-full flex-center-end pt-30 pb-50">
          <image
            :src="`${IMG_BASE_URL}/prize/ic-service-${themeCode}.png`"
            class="w-98 h-74"
          />
          <button
            class="absolute z-10 opacity-0 w-120 h-98 top-0 right-0"
            @click="showService = true"
          />
        </view>
      </view>
    </view>
    <view class="w-100vw h-50" />
  </view>

  <!-- 客服电话 -->
  <LotteryService v-model="showService" />

  <!-- 中奖海报 -->
  <LotteryPoster
    ref="posterGenerator"
    :theme-code="themeCode"
    :bg-img="seriesDetail.poster"
    :avatar="userInfo.avatarUrl"
    :nickname="userInfo.nickName"
    :phone="userInfo.mobilePhone"
    :money="prizeDetail?.bonus"
  />
</template>

<script setup lang="ts">
import { fillInInfo, getMyPrizeDetail } from '@/api'
import { useTheme } from '@/composables'
import { IMG_BASE_URL } from '@/constants'
import { useProfileStore, useSeriesStore } from '@/store'
import { Dialog, eventBus, formatRichText, formatTime, Loading, Toast } from '@/utils'

const profileStore = useProfileStore()
const seriesStore = useSeriesStore()

const { themeCode, color } = useTheme()
const { userInfo } = storeToRefs(profileStore)
const { seriesDetail } = storeToRefs(seriesStore)

const posterGenerator = ref<any>(null)
const showService = ref(false)

const prizeDetail = ref<any>(null)
const form = reactive({
  id: '',
  receivePrizeUserName: '',
  receivePrizeUserIdcard: '',
  bankCardNumber: '',
})
const isSubmitted = ref(false)

const beginDate = computed(() => formatTime(prizeDetail.value?.memExchangeBeginTime, { format: 'YYYY.MM.DD' }))
const endDate = computed(() => formatTime(prizeDetail.value?.memExchangeEndTime, { format: 'YYYY.MM.DD' }))

// 富文本格式化
const formattedNotice = computed(() => {
  return formatRichText(prizeDetail.value.memExchangeNotice)
})

// 身份证正则（支持15/18位）
const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}([\dX])$)/i

// 兑奖信息校验
const validateForm = () => {
  const rules = [
    { condition: !form.receivePrizeUserName, msg: '请填写姓名' },
    { condition: !idCardReg.test(form.receivePrizeUserIdcard), msg: '身份证号格式不正确' },
    { condition: form.bankCardNumber.length < 16, msg: '银行卡号格式不正确' },
  ]

  for (const rule of rules) {
    if (rule.condition) {
      Toast(rule.msg)
      return false
    }
  }
  return true
}

onLoad((options: any) => {
  form.id = options.id

  getDetail(options.id)
})

const getDetail = async (id: string) => {
  prizeDetail.value = await getMyPrizeDetail(id)
}

// 提交处理
const handleSubmit = async () => {
  if (isSubmitted.value || !validateForm()) return

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
    isSubmitted.value = true
    posterGenerator.value?.generateSharePoster()

    eventBus.emit('refreshPrizeList', true)
  }
  finally {
    Loading.hide()
  }
}
</script>

<style scoped>
.page[data-theme='ml'] { background-color: #E5F4DD; }
.page[data-theme='zbqr'] { background-color: #FFFBD4; }
.page[data-theme='zwcs'] { background-color: #EBF4DA; }

.card[data-theme='ml'] { color: #000; }
.card[data-theme='zbqr'] { color: #874228; }
.card[data-theme='zwcs'] { color: #473729; }
</style>
