<template>
  <view class="container page">
    <view class="w-full h-20" />

    <!-- 个人信息卡片 -->
    <view class="card">
      <!-- 头像 -->
      <view class="row avatar relative">
        <text>头像</text>
        <image
          class="size-120 rounded-full"
          :src="profile.avatarUrlBase64 || '/static/images/icons/ic-avatar.png'"
          mode="aspectFill"
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

      <!-- 用户名（不可编辑） -->
      <view class="row">
        <text>用户名</text>
        <view>{{ profile.userName || '未设置' }}</view>
      </view>
      <view class="line" />

      <!-- 昵称 -->
      <view class="row">
        <text>昵称</text>
        <input
          v-model="profile.nickName"
          type="nickname"
          placeholder="请输入昵称"
          class="flex-1 text-right text-26"
          @blur="onChangeNickname"
        >
        <view class="icon">
          <u-icon name="arrow-right" color="#909399" />
        </view>
      </view>
      <view class="line" />

      <!-- 手机号（不可编辑） -->
      <view class="row">
        <text>手机号</text>
        <view>{{ profile.mobilePhone || '未绑定' }}</view>
      </view>
    </view>

    <!-- 更多信息卡片 -->
    <view class="card">
      <!-- 性别 -->
      <view class="row" @tap="handleEditGender">
        <text>性别</text>
        <view>{{ profile.genderName || '未设置' }}</view>
        <view class="icon">
          <u-icon name="arrow-right" color="#909399" />
        </view>
      </view>
      <view class="line" />

      <!-- 生日 -->
      <view class="row" @tap="handleEditBirthday">
        <text>生日</text>
        <view>{{ profile.birthDate || '未设置' }}</view>
        <view class="icon">
          <u-icon name="arrow-right" color="#909399" />
        </view>
      </view>

      <!-- 日期选择器 -->
      <u-datetime-picker
        v-model="birthdayTimestamp"
        :show="showDatePicker"
        title="选择生日"
        mode="date"
        :min-date="minDate"
        :max-date="maxDate"
        confirm-color="var(--primary)"
        @cancel="showDatePicker = false"
        @close="showDatePicker = false"
        @confirm="onConfirmBirthday"
      />
    </view>

    <!-- 协议与说明 -->
    <view class="card">
      <view class="row">
        <text>协议与说明</text>
        <view class="icon">
          <u-icon name="arrow-right" color="#909399" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang='ts'>
import { uploadFile } from '@/api/common'
import useProfileStore from '@/store/profile'
import { formatTime } from '@/utils'

const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)

const genderOptions = ['女', '男']

// 生日选择器
const showDatePicker = ref(false)
const birthdayTimestamp = ref(Date.now())
const minDate = new Date('1900-01-01').getTime()
const maxDate = Date.now()

// 初始化加载用户信息
onLoad(() => {
  profileStore.fetchProfile()
})

// 修改头像
const onChooseAvatar = async (e: any) => {
  const { avatarUrl } = e.detail
  if (!avatarUrl) return

  const { filePath } = await uploadFile(avatarUrl)
  await profileStore.updateProfile({ avatarUrl: filePath })
}

// 修改昵称（失去焦点时保存）
const onChangeNickname = async () => {
  if (!profile.value.nickName.trim()) return

  await profileStore.updateProfile({ nickName: profile.value.nickName })
}

// 修改性别
const handleEditGender = async () => {
  const { tapIndex } = await uni.showActionSheet({ itemList: genderOptions })

  const genderName = genderOptions[tapIndex]
  const gender = tapIndex === 0 ? 0 : 1

  await profileStore.updateProfile({ gender, genderName })
}

// 打开生日选择器
const handleEditBirthday = () => {
  const birth = profile.value.birthDate
  birthdayTimestamp.value = birth ? new Date(birth).getTime() : Date.now()
  showDatePicker.value = true
}

// 确认生日
const onConfirmBirthday = async ({ value }: any) => {
  const birthDate = formatTime(value, { format: 'YYYY-MM-DD' })
  await profileStore.updateProfile({ birthDate })
  showDatePicker.value = false
}
</script>

<style scoped lang="scss">
page {
  @apply bg-bgSecondary;
}

.container {
  @apply px-24 bg-bgSecondary;
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
