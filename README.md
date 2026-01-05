# 五码合一营销系统 · 消费者端小程序


**技术选型**：
`Vue 3.4` · `Vite 5` · `TypeScript` · `uniapp` · `uview-plus` · `UnoCSS`


### 特性

- [x] 集成`uview-plus3.0 ui`库
- [x] 支持多环境打包构建
- [x] 使用`pinia`状态管理
- [x] 封装网络请求，并支持`Typescript`
- [x] 支持路径别名
- [x] 支持自动加载组件和`API`
- [x] 自动校验`git`提交代码格式
- [x] 集成`ESLint`、`StyleLint`、`EditorConfig`代码格式规范
- [x] `Typescript`支持
- [x] 集成`UnoCSS`
- [x] 集成`iconify`图标库
- [x] 集成`z-paging`下拉刷新功能
- [x] 添加页面跳转拦截，登录权限校验
- [x] 支持国际化

### 目录结构
```
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
│  ├ pages-account      个人资料分包
│  ├ pages-reward       中奖相关分包
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

#### vite插件管理
```
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

#### 接口管理
```
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

#### 组合式函数管理
```
hooks
├ useClipboard
├ useLocation
├ usePermission
├ useTheme
└ index.ts      入口文件
```

### 页面管理
```
pages
├ common
│  ├ 404
│  │  └ index.vue
│  └ webview
│     └ index.vue
├ home 
│  └ index.vue        小程序首页
└ series
   ├ ml
   ├ zbqr
   ├ zwcs
   ├ detail.vue       活动详情页
   ├ index.vue        活动主页
   └ list.vue         活动列表页

pages-account
├ login 
│  └ index.vue
└ profile 
  └ index.vue

pages-reward
├ prize 
│  ├ index.vue
│  ├ poster.vue
│  └ redeem-info.vue
└ shop 
   └ index.vue
```

#### 状态管理
```
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
```
utils
├ common .ts
├ delay.ts
├ format.ts
├ modals.ts
├ navigate.ts
├ storage.ts
├ throttle.ts
├ time.ts
└ index.ts        入口文件
```

### 使用方法

```bash
# 安装依赖
pnpm install

# 启动微信小程序
pnpm dev

# 启动H5
pnpm dev:h5
```

### 发布

```bash
# 构建开发环境
pnpm build
pnpm build:h5

# 构建测试环境
pnpm build:mp-weixin-test
pnpm build:h5-test

# 构建生产环境
pnpm build:mp-weixin-prod
pnpm build:h5-prod
```

### 代码提交
```bash
pnpm cz
```

### 更新uniapp版本

更新uniapp相关依赖到最新正式版
```bash
npx @dcloudio/uvm@latest
```
或者执行下面的命令
```bash
pnpm uvm
```

在升级完后，会自动添加很多无用依赖，执行下面的代码减小保体积
```
pnpm uvm-rm
```

### `v3` 代码块
在 `vue` 文件中，输入 `v3` 按 `tab` 即可快速生成页面模板，可以大大加快页面生成。
> 原理：基于 VSCode 代码块生成。

### 登录鉴权
页面如果需要登录才能访问，只需在 `pages.json` 文件中需要鉴权的页面下设置 `needLogin` 属性设置为 `true` 即可，比如
```
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
