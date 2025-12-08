<template>
  <view class="container">
    <view class="card">
      <!-- 头像 -->
      <view class="row avatar">
        <text>头像</text>
        <image
          class="size-120 rounded-full"
          :src="userInfo.avatar || '/static/images/icons/ic-avatar.png'"
        />
        <button
          class="absolute opacity-0 w-650 h-120"
          open-type="chooseAvatar"
          @chooseavatar="onChooseAvatar"
        />
        <view class="icon">
          <u-icon name="arrow-right" color="#909399" />
        </view>
      </view>
      <view class="line" />

      <!-- 用户名 -->
      <view class="row">
        <text>用户名</text>
        <view>{{ userInfo.username }}</view>
      </view>
      <view class="line" />

      <!-- 昵称 -->
      <view class="row">
        <text>昵称</text>
        <input
          v-model="userInfo.nickname"
          type="nickname"
          placeholder="请输入昵称"
          class="text-right text-26"
          @blur="onChangeNickname"
        >
        <view class="icon">
          <u-icon name="arrow-right" color="#909399" />
        </view>
      </view>
      <view class="line" />
      <view class="row">
        <text>手机号 </text>
        <view>{{ userInfo.phone }}</view>
      </view>
    </view>

    <view class="card">
      <!-- 性别 -->
      <view class="row" @click="handleEditGender">
        <text>性别</text>
        <view>{{ userInfo.gender }}</view>
        <view class="icon">
          <u-icon name="arrow-right" color="#909399" />
        </view>
      </view>
      <view class="line" />

      <!-- 生日 -->
      <view class="row" @click="handleEditBirthday">
        <text>生日</text>
        <view>{{ userInfo.birthday }}</view>
        <view class="icon">
          <u-icon name="arrow-right" color="#909399" />
        </view>
      </view>
      <u-datetime-picker
        v-model="birthdayTimestamp"
        :show="showDatePicker"
        title="选择生日"
        mode="date"
        :min-date="minDate"
        :max-date="maxDate"
        :close-on-click-overlay="true"
        confirm-color="var(--primary)"
        @cancel="showDatePicker = false"
        @close="showDatePicker = false"
        @confirm="onConfirmBirthday"
      />
    </view>

    <view class="card">
      <!-- 协议与说明 -->
      <view class="row">
        <text>协议与说明</text>
        <view class="icon">
          <u-icon name="arrow-right" color="#909399" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { formatTime } from '@/utils'

const userInfo = reactive({
  avatar: '',
  username: 'DY0000001',
  nickname: '邢道荣',
  phone: '186****5507',
  gender: '男',
  birthday: '1998-08-06',
})

const chooseGender = ['男', '女']

// 日期选择相关
const showDatePicker = ref(false)
const birthdayTimestamp = ref(Date.now())
const minDate = new Date('1900-01-01').getTime()
const maxDate = Date.now()

// 修改头像
const onChooseAvatar = (e: any) => {
  const { avatarUrl } = e.detail
  userInfo.avatar = avatarUrl
}

// 修改昵称
const onChangeNickname = (e: any) => {
  console.log('输入昵称', e.detail.value)
}

// 修改性别
const handleEditGender = () => {
  uni.showActionSheet({
    itemList: chooseGender,
    success: (res) => {
      userInfo.gender = chooseGender[res.tapIndex]
    },
  })
}

// 打开日期选择器（根据当前的 birthday）
const handleEditBirthday = () => {
  birthdayTimestamp.value = new Date(userInfo.birthday).getTime()
  showDatePicker.value = true
}

// 日期选择确认
const onConfirmBirthday = (e: any) => {
  userInfo.birthday = formatTime(e.value)
  showDatePicker.value = false
}
</script>

<style scoped lang="scss">
.container {
  @apply px-24 pt-20 pb-10;
}

.card {
  @apply rounded-1.5 bg-background mb-20;
}

.row {
  @apply flex-center-between pl-28 pr-58 h-96 relative;
  text {
    @apply color-secondary;
  }
  .icon {
    @apply absolute right-20;
  }
}

.avatar {
  @apply h-148;
}

.line {
  @apply mx-24 h-1 bg-border;
}
</style>
