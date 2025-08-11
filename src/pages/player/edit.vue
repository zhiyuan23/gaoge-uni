<template>
  <view class="text-white mx-40 py-20">
    <button
      class="size-140 flex-center-center rounded-full leading-4 my-20 p-0 text-26"
      open-type="chooseAvatar"
      @chooseavatar="onChooseAvatar"
    >
      <image v-if="playerDetail.avatar_url" class="size-140" :src="playerDetail.avatar_url" />
      <view v-else>
        上传头像
      </view>
    </button>
    <view class="">
      <u--form
        label-position="left"
        :model="playerDetail"
        label-width="80"
        :rules="rules"
        error-type="border-bottom"
      >
        <!-- 号码 -->
        <u-form-item label="号码" border-bottom prop="number">
          <view>{{ playerDetail.number }}</view>
        </u-form-item>

        <!-- 球星 -->
        <u-form-item label="球星" border-bottom prop="name">
          <u--input
            v-model="playerDetail.name"
            color="text-white"
            maxlength="8"
          />
        </u-form-item>

        <!-- 球衣名称 -->
        <u-form-item label="球衣名称" border-bottom prop="code">
          <u--input
            v-model="playerDetail.code"
            color="text-white"
            maxlength="10"
          />
        </u-form-item>

        <!-- 称呼 -->
        <u-form-item label="称呼" prop="call_name" border-bottom>
          <u--input
            v-model="playerDetail.call_name"
            placeholder="你的称呼"
            color="text-white"
            maxlength="5"
          />
        </u-form-item>

        <!-- 称呼 -->
        <u-form-item label="昵称" prop="nickname" border-bottom>
          <u--input
            v-model="playerDetail.nickname"
            placeholder="你的昵称"
            color="text-white"
            maxlength="5"
          />
        </u-form-item>

        <!-- 真实姓名 -->
        <u-form-item label="真实姓名" prop="real_name" border-bottom>
          <u--input
            v-model="playerDetail.real_name"
            color="text-white"
            maxlength="4"
          />
        </u-form-item>
      </u--form>
    </view>
    <view class="fixed w-full flex-col-center-center bottom-50 left-0">
      <view class="mb-30 w-600">
        <u-button shape="circle" :loading="submitLoading" @click="submit">
          提交修改
        </u-button>
      </view>
      <view class="w-600">
        <u-button shape="circle" :loading="unbindLoading" @click="unbind(playerDetail.number)">
          解除绑定
        </u-button>
      </view>
    </view>
  </view>
</template>

<script setup lang='ts'>
import { uploadToCloud } from '@/api/common'
import { usePlayerStore } from '@/store'

const playerStore = usePlayerStore()
const { playerDetail } = storeToRefs(playerStore)

const submitLoading = ref(false)
const unbindLoading = ref(false)

const rules = ref({
  number: [
    {
      required: true,
      message: '此为必填字段',
      trigger: ['blur', 'change'],
    },
  ],
  name: [
    {
      required: true,
      message: '此为必填字段',
      trigger: ['blur', 'change'],
    },
  ],
})

// 修改个人信息
const updateInfo = async (params: any, showToast = false) => {
  await playerStore.updatePlayerInfo(params)

  if (showToast) {
    uni.showToast({ title: '修改成功' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
}

// 修改头像
const onChooseAvatar = async (e: any) => {
  const res = await uploadToCloud(e.detail.avatarUrl, 'avatar')

  const { number } = playerDetail.value
  const params = {
    number,
    avatar_url: res,
  }
  updateInfo(params)
}

const submit = async () => {
  const {
    number,
    name,
    call_name,
    real_name,
    nickname,
    code,
    avatar_url,
  } = playerDetail.value

  const params = {
    number,
    name,
    call_name,
    real_name,
    nickname,
    code,
    avatar_url,
  }
  console.log('提交修改', params)

  updateInfo(params, true)
}

const unbind = async (number: number) => {
  const { confirm } = await uni.showModal({
    title: '提示',
    content: '如号码选择错误可通过解绑后重新选择自己的号码绑定',
    confirmText: '解绑重选',
  })
  if (confirm) {
    unbindLoading.value = true
    await playerStore.unbindPlayerOpenid(number)
    uni.navigateBack()
  }
}

onLoad((query?: AnyObject) => {
  const number = Number(query?.number || 0)
  playerStore.getPlayerDetail(number)
})
</script>
