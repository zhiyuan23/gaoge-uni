import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    ignores: [
      'dist/**',
      '.vscode/**',
      '.idea/**',
      'node_modules/**',
      'src/uni_modules/**',
      'src/manifest.json',
      'src/pages.json',
      'README.md',
    ],
  },
  {
    rules: {
      // vue顶级标签的顺序
      'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
      // 需要尾随逗号
      'comma-dangle': ['error', 'only-multiline'],
      // 允许console
      'no-console': 'off',
      // 需要分号
      '@stylistic/semi': ['error', 'never'],
      // 块内的空行
      'padded-blocks': ['error', 'never'],
      // 顶级函数应使用 function 关键字声明
      'antfu/top-level-function': 'off',
      // 全局的 process 不能用
      'node/prefer-global/process': 'off',
      // 禁止未使用的捕获组
      'regexp/no-unused-capturing-group': 'off',
      // 允许接口和类型别名中的成员之间使用三个分隔符
      '@stylistic/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
        multilineDetection: 'brackets',
      }],
      'object-curly-newline': 'off',
      // if 语句后需要换行
      'antfu/if-newline': 'off',
      // 关闭变量在使用前定义检查
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      // 强制 defineProps 使用类型声明风格
      'vue/define-props-declaration': ['error', 'type-based'],
      // 强制 defineEmits 使用类型声明风格
      'vue/define-emits-declaration': ['error', 'type-based'],
    },
  },
)
