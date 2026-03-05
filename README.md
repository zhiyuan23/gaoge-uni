# 五码合一营销系统 · 消费者端小程序

**技术栈**：
`Vue 3.5` · `Vite 5` · `TypeScript` · `uniapp` · `tdesign-uniapp` · `UnoCSS`

## 特性

- [x] 基于 `Vite5` 的极速开发与构建体验
- [x] 使用`pinia`状态管理
- [x] 支持多环境打包构建
- [x] 支持`Typescript`
- [x] 支持自动加载组件
- [x] 自动校验`git`提交代码格式
- [x] 集成`tdesign-uniapp`组件库
- [x] 集成`ESLint`、`StyleLint`、`EditorConfig`代码格式规范
- [x] 集成`UnoCSS`
- [x] 集成`iconify`图标库

## 目录结构

```text
dicp-wmhy-member-wechat
├ build                 vite配置统一管理
│  ├ config
│  └ plugins
├ env                   环境变量
├ scripts               一些脚本
│  ├ post-upgrade.js    依赖库清理
│  └ verify-commit.js   git提交检验
├ src
│  ├ api                接口管理
│  ├ components         公共组件
│  ├ composables        组合式函数
│  ├ constants          常量
│  ├ locale             国际化语言管理
│  ├ pages              页面管理
│  ├ plugins            插件管理
│  ├ router             路由管理
│  ├ static             静态资源
│  ├ store              状态管理
│  ├ utils              一些工具
│  ├ App.vue
│  ├ main.ts
│  ├ manifest.json      项目配置
│  ├ pages.json         页面配置
│  └ uni.scss           全局scss变量
├ types                 全局typescript类型文件
│  ├ modules            业务数据类型
│  │  ├ prize.ts
│  │  ├ series.ts
│  │  ├ shop.ts
│  │  └ themes.ts
│  ├ auto-imports.d.ts
│  ├ components.d.ts
│  ├ global.d.ts
│  ├ module.d.ts
│  └ index.ts           入口文件 
├ README.md
├ cz.config.js          cz-git配置
├ eslint.config.js      eslint配置
├ index.html
├ package.json
├ pnpm-lock.yaml
├ stylelint.config.js   stylelint配置
├ tsconfig.json
├ uno.config.ts         unocss配置
└ vite.config.ts        vite配置
```

### vite插件管理

```text
build
├ config            vite配置
│  ├ index.ts       入口文件
│  └ proxy.ts       跨域代理配置
└ plugins           vite插件
   ├ autoImport.ts  自动导入api
   ├ cleanImage.ts  自动清理图片文件
   ├ component.ts   自动导入组件
   ├ index.ts       入口文件
   ├ replaceUrl.ts  自动替换图片地址为CDN地址
   ├ unocss.ts      unocss配置
   └ visualizer.ts  包体积视图分析

```

### 接口管理

```text
api
├ modules
│  ├ auth.ts
│  ├ common.ts
│  ├ lottery.ts
│  ├ profile.ts
│  ├ series.ts
│  └ shop.ts
└ index.ts     入口文件
```

### 组合式函数管理

```text
hooks
├ useClipboard
├ useLocation
├ usePermission
├ useTheme
└ index.ts      入口文件
```

### 页面管理

```text
pages
├ common
│  ├ 404
│  │  └ index.vue
│  └ webview
│     └ index.vue
├ home                小程序首页
│  └ index.vue
├ login 
│  └ index.vue
├ profile 
│  ├ agreement.vue
│  └ index.vue
├ reward
│  ├ prize
│  │  ├ index.vue
│  │  └ redeem.vue
│  └ shop
│     ├ feedback.vue
│     └ index.vue
└ series
   ├ ml
   ├ zbqr
   ├ zwcs
   ├ detail.vue       活动详情页
   ├ index.vue        活动主页
   └ list.vue         活动列表页
```

### 状态管理（Pinia）

```text
store
├ modules
│  ├ app.ts
│  ├ auth.ts
│  ├ config.ts
│  ├ profile.ts
│  └ series.ts
└ index.ts     入口文件
```

### 工具方法

```text
utils
├ common .ts
├ eventBus.ts
├ files.ts
├ format.ts
├ modals.ts
├ navigate.ts
├ storage.ts
├ timing.ts
└ index.ts        入口文件
```

## 使用说明

### 快速开始

```bash
# 安装依赖
pnpm install

# 启动UAT环境微信小程序
pnpm dev

# 启动本地环境微信小程序
pnpm dev:local

# 启动H5
pnpm dev:h5
```

### 构建与发布

```bash
# 构建UAT环境小程序
pnpm build

# 构建生产环境小程序
pnpm build:prod
```

### 代码提交规范

```bash
pnpm cz
```

### uni-app 版本升级

更新uniapp相关依赖到最新正式版

```bash
npx @dcloudio/uvm@latest
```

或者执行下面的命令

```bash
pnpm uvm
```

升级完成后会自动引入一些无用依赖，可执行以下命令清理以减小包体积：

```bash
pnpm uvm-rm
```

### 登录鉴权

如果某个页面需要登录后才能访问，只需在 `pages.json` 中对应页面配置项下添加 `needLogin: true`:

```json
{
  "pages": [
    {
      "path": "pages/test/test",
      "needLogin": true,
      "style": {
        "navigationBarTitleText": "",
      },
    }
  ]
}
```
