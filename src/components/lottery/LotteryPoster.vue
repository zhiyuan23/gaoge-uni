<template>
  <canvas
    id="sharePosterCanvas"
    canvas-id="sharePosterCanvas"
    class="fixed opacity-0"
    style="top: -9999px; left: -9999px;"
    :style="{ width: `${width}px`, height: `${height}px` }"
  />
</template>

<script setup lang="ts">
import { Loading } from '@/utils'

const props = defineProps<{
  themeCode: string;
  bgImg: string;
  avatar?: string;
  nickname: string;
  phone: string;
  money: string;
  width?: number;
  height?: number;
}>()

// 默认头像地址
const DEFAULT_AVATAR = '/static/images/icons/ic-avatar.png'

const themeCode = computed(() => props.themeCode || 'zbqr')
const width = computed(() => props.width || 668)
const height = computed(() => props.height || 1000)
const avatar = computed(() => props.avatar || DEFAULT_AVATAR)
const bgImg = computed(() => props.bgImg)
const nickname = computed(() => props.nickname)
const phone = computed(() => props.phone)
const money = computed(() => props.money || '')

// 主题布局配置表
const ThemeConfig: Record<string, any> = {
  zbqr: {
    layout: 'bottom-left',
    offsetX: 60,
    offsetY: 45,
    userColor: '#000000',
    moneyColor: '#C44F2A',
    moneyLeftX: 0,
    moneyCenterY: 300,
  },
  zwcs: {
    layout: 'top-center-group',
    offsetX: 0,
    offsetY: 230,
    userColor: '#94503E',
    moneyColor: '#C44F2A',
    moneyLeftX: 0,
    moneyCenterY: 460,
  },
  ml: {
    layout: 'bottom-left',
    offsetX: 0,
    offsetY: 0,
    userColor: '#000000',
    moneyColor: '#DC0C1C',
    moneyLeftX: 10,
    moneyCenterY: 390,
  },
}

const generating = ref(false)
const { proxy } = getCurrentInstance()!

const getLocalImagePath = (url: string): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!url) return resolve(null)

    if (url.startsWith('/static') || url.startsWith('static')) {
      return resolve(url)
    }

    uni.getImageInfo({
      src: url,
      success: res => resolve(res.path),
      fail: () => resolve(null),
    })
  })
}

const generateSharePoster = async () => {
  if (generating.value) return
  generating.value = true

  Loading.show('生成海报中...')
  const ctx = uni.createCanvasContext('sharePosterCanvas', proxy)
  const config = ThemeConfig[themeCode.value] || ThemeConfig.ml

  try {
    const [bgPath, avatarPath] = await Promise.all([
      getLocalImagePath(bgImg.value),
      getLocalImagePath(avatar.value),
    ])

    if (!bgPath) throw new Error('背景图加载失败')

    // 1. 绘制背景
    ctx.drawImage(bgPath, 0, 0, width.value, height.value)

    // 2. 绘制用户信息
    const avatarSize = 80
    const spacing = 10

    ctx.setFontSize(20)
    ctx.setFillStyle(config.userColor)

    if (config.layout === 'top-center-group') {
      const idText = `ID:${nickname.value}`
      const phoneText = `手机号:${phone.value}`
      const textWidth = Math.max(ctx.measureText(idText).width, ctx.measureText(phoneText).width)
      const totalWidth = avatarSize + spacing + textWidth

      const startX = (width.value - totalWidth) / 2
      const centerY = config.offsetY + (avatarSize / 2)

      // 绘制头像
      if (avatarPath) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(startX + (avatarSize / 2), centerY, avatarSize / 2, 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(avatarPath, startX, centerY - (avatarSize / 2), avatarSize, avatarSize)
        ctx.restore()
      }

      ctx.setTextAlign('left')
      ctx.setTextBaseline('bottom')
      ctx.fillText(idText, startX + avatarSize + spacing, centerY - 3)
      ctx.setTextBaseline('top')
      ctx.fillText(phoneText, startX + avatarSize + spacing, centerY + 3)
    }
    else {
      const offsetY = config.offsetY
      const offsetX = config.offsetX
      const avatarX = 110 + offsetX
      const avatarY = 850 + offsetY
      const textX = 170 + offsetX
      const textNameY = 825 + offsetY
      const textPhoneY = 865 + offsetY

      if (avatarPath) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(avatarPath, avatarX - (avatarSize / 2), avatarY - (avatarSize / 2), avatarSize, avatarSize)
        ctx.restore()
      }

      ctx.setTextAlign('left')
      ctx.setTextBaseline('top')
      ctx.fillText(`ID:${nickname.value}`, textX, textNameY)
      ctx.setTextBaseline('middle')
      ctx.fillText(`手机号:${phone.value}`, textX, textPhoneY)
    }

    // 3. 奖金金额
    const moneyText = `${money.value}元现金红包`
    const centerX = width.value / 2 + config.moneyLeftX
    const centerY = config.moneyCenterY

    ctx.save()
    ctx.font = 'normal bold 50px sans-serif'
    ctx.setShadow(0, 0, 8, 'rgba(0, 0, 0, 0.2)')
    ctx.setLineWidth(10)
    ctx.setStrokeStyle('#ffffff')
    ctx.setTextAlign('center')
    ctx.setTextBaseline('middle')
    ctx.setLineJoin('round')
    ctx.strokeText(moneyText, centerX, centerY)
    ctx.setFillStyle(config.moneyColor)
    ctx.fillText(moneyText, centerX, centerY)
    ctx.restore()

    // 4. 导出
    ctx.draw(false, () => {
      setTimeout(() => {
        uni.canvasToTempFilePath({
          canvasId: 'sharePosterCanvas',
          destWidth: width.value * 2,
          destHeight: height.value * 2,
          fileType: 'png',
          quality: 1,
          success: (res) => {
            Loading.hide()
            uni.showShareImageMenu({ path: res.tempFilePath })
          },
          fail: () => { Loading.hide() },
          complete: () => (generating.value = false),
        }, proxy)
      }, 300)
    })
  }
  catch {
    Loading.hide()
    generating.value = false
  }
}

defineExpose({ generateSharePoster })
</script>
