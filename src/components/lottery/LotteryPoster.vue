<template>
  <canvas
    id="sharePosterCanvas"
    canvas-id="sharePosterCanvas"
    class="fixed opacity-0"
    style="top: -9999px; left: -9999px;"
    :style="{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }"
  />
</template>

<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'
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
  avatar: '',
})

const canvasWidth = props.width
const canvasHeight = props.height

const generating = ref(false)

const instance = getCurrentInstance()
const thisProxy = instance?.proxy ?? null

// 获取本地图片路径，增加容错处理
const getLocalImagePath = (url?: string): Promise<string | null> => {
  if (!url) return Promise.resolve(null)

  return new Promise((resolve) => {
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

  const ctx = uni.createCanvasContext('sharePosterCanvas', thisProxy)

  try {
    // 1. 背景图必须成功加载
    const bgPath = await getLocalImagePath(props.bgImg)
    if (!bgPath) {
      throw new Error('背景图加载失败')
    }

    // 2. 头像尝试加载
    let avatarPath: string | null = null
    if (props.avatar) {
      avatarPath = await getLocalImagePath(props.avatar)
    }

    // 3. 绘制背景
    ctx.drawImage(bgPath, 0, 0, canvasWidth, canvasHeight)

    // 4. 有头像才绘制圆形头像
    if (avatarPath) {
      const avatarSize = 84
      const avatarCenterX = 110
      const avatarCenterY = 890
      const avatarRadius = avatarSize / 2

      const avatarDrawX = avatarCenterX - avatarRadius
      const avatarDrawY = avatarCenterY - avatarRadius

      ctx.save()
      ctx.beginPath()
      ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(avatarPath, avatarDrawX, avatarDrawY, avatarSize, avatarSize)
      ctx.restore()
    }

    // 5. 昵称文字
    ctx.setFontSize(36)
    ctx.setFillStyle('#909399')
    ctx.setTextAlign('left')
    ctx.setTextBaseline('top')
    ctx.fillText(props.nickname, 180, 874)

    // 6. “红包” “元” 文字
    ctx.setFontSize(36)
    ctx.setFillStyle('#D73C11')
    ctx.setTextAlign('left')
    ctx.setTextBaseline('middle')
    ctx.fillText('红包', canvasWidth / 2 - 140, 515)
    ctx.fillText('元', canvasWidth / 2 - 10, 610)

    // 7. 奖金金额
    ctx.setFontSize(70)
    ctx.setFillStyle('#D73C11')
    ctx.setTextAlign('center')
    ctx.setTextBaseline('middle')
    ctx.fillText(props.money, canvasWidth / 2 - 80, 600)

    // 8. 提交绘制并导出
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
            Toast('海报生成失败')
            console.error('canvasToTempFilePath 失败:', err)
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
    Toast('海报生成失败')
    console.error('生成海报出错:', err)
    generating.value = false
  }
}

// 暴露方法给父组件调用
defineExpose({
  generateSharePoster,
})
</script>
