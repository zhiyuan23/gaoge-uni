/**
 * @name ConfigUnoCSSPlugin
 * @description UnoCSS相关配置
 */
import UnoCSS from 'unocss/vite'

export const ConfigUnoCSSPlugin = () => {
  return UnoCSS({
    // 强制断言以绕过旧版本的类型检查限制
    ...({ hmrTopLevel: true } as any),
  })
}
