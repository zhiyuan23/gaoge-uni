<template>
  <u-popup
    :show="modelValue"
    round="20"
    @close="closeAgreePrivacy"
  >
    <view class="px-45 text-30">
      <view class="pt-50 leading-30">
        {{ initTitle }}
      </view>
      <view class="text-center px-18 pt-90">
        为了更好地保障您的合法权益，请您阅读并同意 以下协议
        <text class="color-primary" @click="openPrivacyContract">
          《用户协议》《隐私政策》
        </text>
        ，未注册手 机号将自动注册
      </view>

      <view class="flex-center-around pt-120 pb-20">
        <view class="w-250">
          <u-button
            type="default"
            shape="circle"
            @click="disagree"
          >
            以后再说
          </u-button>
        </view>
        <view class="w-250">
          <u-button
            :id="agreePrivacyId"
            type="primary"
            shape="circle"
            open-type="agreePrivacyAuthorization"
            color="var(--wechat-primary)"
            @agreeprivacyauthorization="agree"
          >
            允许
          </u-button>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang='ts'>
interface AgreePrivacyProps {
  modelValue: boolean;
  // 标题
  title: string;
  // 禁止自动检测隐私
  disableCheckPrivacy: boolean;
  // 按钮id 必填项不填写时授权按钮id必须为agree-btn
  agreePrivacyId: string;
}

const props = withDefaults(defineProps<AgreePrivacyProps>(), {
  modelValue: false,
  title: '',
  disableCheckPrivacy: true,
  agreePrivacyId: 'agree-btn',
})

const emit = defineEmits(['update:modelValue', 'needPrivacyAuthorization', 'agree', 'disagree'])
// 初始化的标题
const initTitle = ref<string>('服务协议及隐私保护')
// 隐私政策
const initPrivacyContractName = ref<string>('隐私政策')

// 打开隐私
function openAgreePrivacy() {
  emit('update:modelValue', true)
}

// 关闭隐私
function closeAgreePrivacy() {
  emit('update:modelValue', false)
}

// 需要初始化的数据
function initData() {
  initTitle.value = props.title || initTitle.value
}

// 检测是否授权
function checkPrivacySetting() {
  wx.getPrivacySetting({
    success: (res: any) => {
      // 未授权弹框
      if (res.needAuthorization) {
        initPrivacyContractName.value = res.privacyContractName
        initData()
        // 是否禁用 自动检测隐私并弹框
        if (!props.disableCheckPrivacy) {
          // 需要弹出隐私协议
          openAgreePrivacy()
        }
      }
      else {
        // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用已声明过的隐私接口
        // wx.getUserProfile()
      }
    },
    fail: (e: any) => {
      console.log(e)
    },
  })
}
// 打开隐私政策
function openPrivacyContract() {
  wx.openPrivacyContract({
    success: () => {}, // 打开成功
    fail: (e: any) => {
      uni.$u.toast(`打开失败:${e}`)
    }, // 打开失败
  })
}

// 同意
function agree(e: any) {
  const buttonId = e.target.id || 'agree-btn'
  emit('agree', buttonId)
  emit('update:modelValue', false)
}

// 拒绝
function disagree() {
  emit('disagree')
  closeAgreePrivacy()
}

onMounted(() => {
  // 检测是否授权
  checkPrivacySetting()

  // // 监听授权
  // wx.onNeedPrivacyAuthorization((resolve, eventInfo) => {
  //   emit('update:modelValue', true);
  //   // 回调
  //   emit('needPrivacyAuthorization', resolve, eventInfo);
  // });
})
</script>
