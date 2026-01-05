<script setup lang="ts">
import { Loading, Toast } from '@/utils'

interface Props {
  bgImg: string;
  avatar: string;
  nickname: string;
  money: string;
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  width: 668,
  height: 1000,
})

const canvasWidth = props.width
const canvasHeight = props.height

const generating = ref(false)

const instance = getCurrentInstance()
const thisProxy = instance?.proxy || null

const getLocalImagePath = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src: url,
      success: res => resolve(res.path),
      fail: err => reject(err),
    })
  })
}

const generateSharePoster = async () => {
  if (generating.value) return
  generating.value = true

  Loading.show('生成海报中...')

  const ctx = uni.createCanvasContext('sharePosterCanvas', thisProxy)

  try {
    const [bgPath, avatarPath] = await Promise.all([
      getLocalImagePath(props.bgImg),
      getLocalImagePath(props.avatar),
    ])

    // 1. 绘制背景
    ctx.drawImage(bgPath, 0, 0, canvasWidth, canvasHeight)

    // 2. 圆形头像
    const avatarSize = 84
    const avatarCenterX = 110
    const avatarCenterY = 890
    const avatarRadius = avatarSize / 2

    // 计算绘制图片的左上角坐标
    const avatarDrawX = avatarCenterX - avatarRadius
    const avatarDrawY = avatarCenterY - avatarRadius

    ctx.save()
    ctx.beginPath()
    ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(avatarPath, avatarDrawX, avatarDrawY, avatarSize, avatarSize)
    ctx.restore()

    // 3. 昵称文字
    ctx.setFontSize(36)
    ctx.setFillStyle('#909399')
    ctx.setTextAlign('left')
    ctx.setTextBaseline('top')
    ctx.fillText(props.nickname, 180, 874)

    // 4. “红包” “元” 文字
    ctx.setFontSize(36)
    ctx.setFillStyle('#D73C11')
    ctx.setTextAlign('left')
    ctx.setTextBaseline('middle')
    ctx.fillText('红包', canvasWidth / 2 - 140, 515)
    ctx.fillText('元', canvasWidth / 2 - 10, 610)

    // 5. 奖金金额
    ctx.setFontSize(70)
    ctx.setFillStyle('#D73C11')
    ctx.setTextAlign('center') // 水平居中
    ctx.setTextBaseline('middle')
    ctx.fillText(props.money, canvasWidth / 2 - 80, 600)

    // 6. 提交绘制并导出
    ctx.draw(true, () => {
      setTimeout(() => {
        uni.canvasToTempFilePath({
          canvasId: 'sharePosterCanvas',
          destWidth: canvasWidth * 2,
          destHeight: canvasHeight * 2,
          fileType: 'png',
          quality: 0.95,
          success: (res) => {
            Loading.hide()
            uni.showShareImageMenu({
              path: res.tempFilePath,
            })
          },
          fail: (err) => {
            Loading.hide()
            Toast('生成失败')
            console.error(err)
          },
          complete: () => {
            generating.value = false
          },
        }, thisProxy)
      }, 300)
    })
  }
  catch (err) {
    Loading.hide()
    console.error(err)
    generating.value = false
  }
}

defineExpose({ generateSharePoster })
</script>

<template>
  <canvas
    id="sharePosterCanvas"
    canvas-id="sharePosterCanvas"
    class="fixed opacity-0"
    style=" top: -9999px;left: -9999px;"
    :style="{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }"
  />
</template>
