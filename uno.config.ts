import { entriesToCss, toArray } from '@unocss/core'
import {
  defineConfig,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { presetWeapp } from 'unocss-preset-weapp'
import { extractorAttributify, transformerClass } from 'unocss-preset-weapp/transformer'
import { darkTheme, lightTheme } from './themes'

const { presetWeappAttributify, transformerAttributify } = extractorAttributify()

// 设置rpx为默认单位
function createRpxRules(prefix: string, properties: string[]): any[] {
  return [
    [
      new RegExp(`^${prefix}-(-?[\\d.]+)$`),
      (match: string[]) => {
        const value = match[1]
        return Object.fromEntries(properties.map(prop => [prop, `${value}rpx`]))
      },
      { autocomplete: `${prefix}-<num>` },
    ],
    // 支持负值写法（如 -ml-20）
    [
      new RegExp(`^-${prefix}-(-?[\\d.]+)$`),
      (match: string[]) => {
        const value = match[1]
        return Object.fromEntries(properties.map(prop => [prop, `-${value}rpx`]))
      },
      { autocomplete: `-${prefix}-<num>` },
    ],
  ]
}

export default defineConfig({
  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        'src/**/*.{js,ts}',
      ],
    },
  },
  presets: [
    presetWeapp() as any,
    presetWeappAttributify() as any,
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  safelist: [
    'h-100',
    'h-126',
    'h-160',
  ],
  /**
   * 自定义快捷语句
   * @see https://github.com/unocss/unocss#shortcuts
   */
  rules: [
    // 边距
    ...createRpxRules('m', ['margin']),
    ...createRpxRules('mx', ['margin-left', 'margin-right']),
    ...createRpxRules('my', ['margin-top', 'margin-bottom']),
    ...createRpxRules('ml', ['margin-left']),
    ...createRpxRules('mr', ['margin-right']),
    ...createRpxRules('mt', ['margin-top']),
    ...createRpxRules('mb', ['margin-bottom']),

    // 内边距
    ...createRpxRules('p', ['padding']),
    ...createRpxRules('px', ['padding-left', 'padding-right']),
    ...createRpxRules('py', ['padding-top', 'padding-bottom']),
    ...createRpxRules('pl', ['padding-left']),
    ...createRpxRules('pr', ['padding-right']),
    ...createRpxRules('pt', ['padding-top']),
    ...createRpxRules('pb', ['padding-bottom']),
    ...createRpxRules('gap', ['gap']),

    // 尺寸
    ...createRpxRules('w', ['width']),
    ...createRpxRules('h', ['height']),
    ...createRpxRules('min-w', ['min-width']),
    ...createRpxRules('max-w', ['max-width']),
    ...createRpxRules('min-h', ['min-height']),
    ...createRpxRules('max-h', ['max-height']),
    ...createRpxRules('leading', ['line-height']),

    // 定位
    ...createRpxRules('top', ['top']),
    ...createRpxRules('right', ['right']),
    ...createRpxRules('bottom', ['bottom']),
    ...createRpxRules('left', ['left']),
    ...createRpxRules('inset', ['top', 'right', 'bottom', 'left']),

    // 字体大小（可选）
    [/^text-(\d+)$/, ([, d]) => ({ 'font-size': `${d}rpx` })],
  ],
  shortcuts: [
    [/^flex-?(col)?-(start|end|center|baseline|stretch)-?(start|end|center|between|around|evenly|left|right)?$/, ([, col, items, justify]) => {
      const cls = ['flex']
      if (col === 'col') {
        cls.push('flex-col')
      }
      if (items === 'center' && !justify) {
        cls.push('items-center')
        cls.push('justify-center')
      }
      else {
        cls.push(`items-${items}`)
        if (justify) {
          cls.push(`justify-${justify}`)
        }
      }
      return cls.join(' ')
    }],
  ],
  theme: {
    colors: {
      primary: lightTheme['--primary'],
      primaryTint: lightTheme['--primary-tint'],
      default: lightTheme['--text-primary'],
      secondary: lightTheme['--text-secondary'],
      background: lightTheme['--bg-container'],
      border: lightTheme['--border-base'],
      wechat: lightTheme['--wechat-primary'],
    },
    spacing: { row: { base: '20rpx' } },
  },
  preflights: [
    {
      getCSS: () => {
        const returnCss: any = []
        // 明亮主题
        const lightCss = entriesToCss(Object.entries(lightTheme))
        const lightRoots = toArray([`*,::before,::after`, `::backdrop`])
        returnCss.push(lightRoots.map(root => `${root}{${lightCss}}`).join(''))
        // 暗黑主题
        const darkCss = entriesToCss(Object.entries(darkTheme))
        const darkRoots = toArray([`html.dark,html.dark *,html.dark ::before,html.dark ::after`, `html.dark ::backdrop`])
        returnCss.push(darkRoots.map(root => `${root}{${darkCss}}`).join(''))

        return returnCss.join('')
      },
    },
  ],
  transformers: [
    // 启用 @apply 功能
    transformerDirectives({ enforce: 'pre' }),
    // 启用 () 分组功能
    transformerVariantGroup(),
    transformerAttributify() as any,
    transformerClass(),
  ],
})
