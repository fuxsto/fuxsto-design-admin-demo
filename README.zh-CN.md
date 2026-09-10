# fuxsto-design-admin-demo

[English](./README.md) · [简体中文](./README.zh-CN.md)

**基于 [fuxsto-design](https://design.fuxsto.cn) 构建的生产级形态管理后台模板。**

Vue 3.5 · TypeScript · Vite 6 · Tailwind CSS v4 —— 14 个页面，覆盖组件库**全部 84 个导出**，
响应式适配到 375px，五道静态审计门禁接入 CI。

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](./LICENSE)
[![Vue 3.5](https://img.shields.io/badge/Vue-3.5-42b883.svg)](https://vuejs.org)
[![Vite 6](https://img.shields.io/badge/Vite-6-646cff.svg)](https://vite.dev)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com)
[![Components](https://img.shields.io/badge/coverage-84%2F84-brightgreen.svg)](#组件覆盖率)

## 界面截图

|  |  |
| :---: | :---: |
| ![工作台](docs/screenshots/dashboard.png)<br>**工作台** | ![暗色模式](docs/screenshots/dashboard-dark.png)<br>**暗色模式** |
| ![用户管理](docs/screenshots/users.png)<br>**用户管理 · 表格 + 分页** | ![表单全集](docs/screenshots/form-demo.png)<br>**表单全集** |
| ![数据展示](docs/screenshots/data-display.png)<br>**数据展示** | ![详情](docs/screenshots/detail.png)<br>**详情 · 轮播 + 时间线** |
| ![角色权限](docs/screenshots/roles.png)<br>**角色与权限 · 树 + 穿梭框** | ![反馈组件](docs/screenshots/feedback.png)<br>**反馈组件** |
| ![登录](docs/screenshots/login.png)<br>**登录** | ![移动端工作台](docs/screenshots/mobile-dashboard.png)<br>**响应式 · 390px** |
| ![移动端表格](docs/screenshots/mobile-users.png)<br>**响应式表格** | *另有 列表、AI 流式、<br>系统设置、个人中心。* |

截图位于 [`docs/screenshots/`](docs/screenshots)，由生产构建重新生成 ——
见 [CONTRIBUTING.md](./CONTRIBUTING.md#regenerating-screenshots)。

---

## 为什么用这个模板

多数后台模板是「把一些组件堆成几个页面」。这个模板反着来：**从组件库的导出清单出发**，
先保证没有任何组件被闲置，再把它套进真实产品的形状里。

- **组件全覆盖** —— 84/84 个导出全部用到，由 `scripts/coverage-audit.cjs` 强制校验。
- **真实产品形态** —— 登录、仪表盘、CRUD 表格、角色权限、表单套件、设置、个人中心，
  而不是零散的组件演示。
- **默认响应式** —— 抽屉式导航、自适应栅格、可横向滚动的表格，一直到 375px。
- **零外部资源** —— 占位图在本地生成为 SVG data URI，离线可用。
- **内建验证** —— `npm run verify` 会在出现未知属性、覆盖率缺口或「Vue 无法继承的属性」时直接失败。
- **亮 / 暗主题**，偏好持久化。

## 快速开始

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # 生产构建
npm run preview   # 预览生产构建
```

需要 **Node >= 22.18**（见 `.nvmrc`）。

### 可用脚本

| 脚本 | 作用 |
|------|------|
| `npm run dev` | Vite 开发服务器（HMR） |
| `npm run build` | 生产构建，输出到 `dist/` |
| `npm run preview` | 本地预览生产构建 |
| `npm run type-check` | 全项目 `vue-tsc --noEmit` |
| `npm run audit` | 三道静态审计（覆盖率 · 属性合法性 · 属性透传） |
| `npm run verify` | `type-check` + `audit`，即 CI 所跑的门禁 |

## 项目结构

```
src/
├── main.ts                    # 入口
├── App.vue                    # <RouterView/> + <BackTop/>
├── style.css                  # @import "tailwindcss"; @import "fuxsto-design/styles"
├── router/
│   └── index.ts               # 14 个页面组件（13 个路由页 + 404），hash 模式
├── stores/
│   ├── theme.ts               # 亮 / 暗模式 + localStorage
│   └── user.ts                # 模拟用户资料
├── mock/
│   └── data.ts                # 用户 / 订单 / 商品 / 组织 / 权限
├── layouts/
│   └── MainLayout.vue         # Header + 侧栏 + 面包屑 + RouterView
├── components/
│   └── KpiCard.vue            # 应用级可复用卡片
├── utils/
│   └── media.ts               # 本地 SVG 占位图（封面 / 头像）
└── pages/
    ├── Login.vue              # 密码 / 验证码 / PIN
    ├── Dashboard.vue          # KPI + Tabs（总览 / 订单 / 团队 / 发布）
    ├── Users.vue              # Table + Pagination + Drawer 表单
    ├── Roles.vue              # Tree + Transfer
    ├── Orders.vue             # Table + KPI + Drawer
    ├── FormDemo.vue           # 完整表单套件
    ├── ListDemo.vue           # List + PinInput + ScrollArea
    ├── Detail.vue             # Tabs + Timeline + Image 轮播
    ├── Feedback.vue           # Message / Notification / Dialog / Tour ...
    ├── DataDisplay.vue        # Statistic / Progress / Countdown / VirtualList
    ├── AIDemo.vue             # StreamingText
    ├── Settings.vue           # Anchor + ColorPicker + Switch
    ├── Profile.vue            # Avatar + Form + Upload
    └── NotFound.vue           # 404

scripts/                        # 验证脚本（见下文）
docs/component-inventory.md     # 组件库清单
```

## 各页面使用的组件

| 页面 | 主要组件 |
|------|----------|
| **Dashboard** | Statistic · Chip · Tabs · TabViews · Carousel · Image · Alert · Progress · Timeline · Avatar · AvatarGroup · List · ListItem · Skeleton · Empty · Link · Title · Paragraph · Text · Badge |
| **Users** | Table · Pagination · Input · Select · Button · Chip · Drawer · Form · FormItem · Avatar · Switch · Popconfirm · Tooltip · Segmented · RadioGroup · Radio · Empty · Message · Dialog · Divider |
| **Roles** | Tree · Transfer · Card · List · ListItem · Avatar · AvatarGroup · Alert · Form · FormItem · Select · Drawer · Tabs · TabViews · Dialog |
| **Orders** | Table · Pagination · Statistic · Input · Select · Drawer · Segmented · Chip · Tooltip · Popconfirm · Empty · Message · Dialog · Badge · Divider |
| **FormDemo** | Form · FormItem · Input · InputNumber · Textarea · Select · AutoComplete · Cascader · DatePicker · TimePicker · Switch · RadioGroup · Radio · CheckboxGroup · Checkbox · Slider · Rate · ColorPicker · Upload · Alert |
| **ListDemo** | List · ListItem · Chip · ChipGroup · Segmented · Collapse · CollapseItem · Empty · PinInput · Input · Avatar · Badge · Skeleton · ScrollArea |
| **Detail** | Header（吸顶 + 毛玻璃）· Tabs · TabViews · Timeline · TimelineItem · List · ListItem · Image · Carousel · Statistic · Result · Chip · Link · Title · Paragraph · Text |
| **Feedback** | Message · Notification · Dialog · Drawer · Tooltip · Popconfirm · Alert · Result · Skeleton · Loading · Empty · Tour · Watermark |
| **DataDisplay** | Statistic · Progress · Timeline · Carousel · Image · Countdown · ContributionChart · VirtualList · ScrollArea |
| **AI** | StreamingText（顺序 / 随机 / 静态 / 对话） |
| **Settings** | Anchor · Switch · Segmented · ColorPicker · Slider · Select · RadioGroup · Radio · Input · Alert · Notification |
| **Profile** | Avatar · Card · Form · FormItem · Input · Upload · Switch · Divider · Statistic · Chip |

此外，`MainLayout.vue` 用到的应用外壳组件：
Header · Breadcrumb · BreadcrumbItem · Menu · Tooltip · Avatar · Badge · Divider · Watermark · Tour（`startTour`）。

## 组件覆盖率

组件库共导出 **84** 个被跟踪的 token（73 个 SFC、3 个命令式 API —— `Message` /
`Notification` / `Dialog`、工具函数 `cn`，以及别名 `Tag` / `TagGroup`）。

> **84 / 84 已使用 · 0 缺失**

随时可跑 `npm run audit` 复核。若后续改动导致某个组件不再被使用，该审计会**故意失败**。

## 验证

五道门禁，每次提交都必须全绿：

```bash
npm run verify   # type-check + 三道静态审计
npm run build
```

| 门禁 | 脚本 | 检查内容 |
|------|------|----------|
| 类型安全 | `npm run type-check` | `vue-tsc --noEmit`，0 错误 |
| 构建 | `npm run build` | 生产构建成功 |
| 组件覆盖 | `scripts/coverage-audit.cjs` | 每个导出都被真正使用（84/84） |
| 属性合法性 | `scripts/prop-legality-audit.cjs` | 无未知属性（对照已安装的 `.d.ts` 基线） |
| 属性透传 | `scripts/fallthrough-audit.cjs` | **Fragment 根组件**上不出现 `class` / `style` / 未声明属性 |

`fallthrough-audit.cjs` 通过静态扫描组件库编译产物中的
`return openBlock(), createElementBlock(Fragment, ...)` 来自动推导 Fragment 根组件集合，
因此在 `fuxsto-design` 升级后依然正确，而不是靠写死的清单。

## fuxsto-design 避坑要点

以下都是极易踩错、且本模板在开发中真实踩过并修掉的问题。

- **Fragment 根组件不能接收 `class` / `style`。**
  `Image`、`Table`、`Pagination`、`Slider` 的根节点是 **Fragment**（例如 `Image` 是「一个 `<div>`
  + 预览用 `<Teleport>`」）。Vue 3 无法把非 prop 属性自动继承到 Fragment 上，于是会打印
  `[Vue warn]: Extraneous non-props attributes (class) ... renders fragment`，
  并**静默丢弃该属性** —— 典型症状就是图片塌缩、看起来「组件里没有图片」。
  `Image` 的尺寸请走 props：`<Image src="…" fit="cover" width="100%" height="100%" />`。
- **`Carousel` 的每一页必须是普通元素。**
  `Carousel` 会把页宽/页高以 inline `style` 写到每页的**根节点**上，所以每页要用普通元素
  （如 `<div class="h-full w-full">`）兜住，内层组件再填满它。不要把 `<Image>` 直接作为
  `Carousel` 的直接子节点；也不要在默认插槽里写 `v-for` —— 它会被编译成单个 Fragment，
  轮播只会当成 1 页。
- **本地 SVG 媒体必须用 `rgb()`。**
  通过 `<img src>` 加载的 SVG 不能可靠地支空格语法 `hsl(H S% L%)`，会渲染成空白。
  `src/utils/media.ts` 正是因此改用 `rgb(r, g, b)` 并显式声明 `width` / `height`。
- **`Tabs` / `TabViews`** 用 `:options="[{ label, value }]"`，不是 `<Tabs.Item>`。
  `TabViews` 用按 `value` 命名的具名插槽（如 `<template #basic>`）。
- **`StreamingText`** 的 props 是 `texts` 与 `currentIndex`（不是 `textList` / `index`）。
- **`Header`** 的默认插槽即右侧操作区 —— 没有名为 `actions` 的插槽。
- **`Menu`** 的 `options` 是二维数组（分组）；`@select` 回传完整的 `MenuItem`。
- **`Tooltip` / `Popconfirm`** 包裹单个触发元素。
- **Tailwind v4 + Vite**：v4 的扫描器有时抓不到 router 里通过 `() => import(...)` 引入的 `.vue`
  文件。在 CSS 入口加上 `@source "../**/*.{vue,ts,tsx,js,jsx}"` 强制扫描。

## 二次开发

1. 从 `src/router/index.ts` 入手理解 路由 → 页面 的映射。
2. 每个页面的演示状态放在 `<script setup>`，`<template>` 只负责布局。
3. `src/stores/theme.ts` 把亮/暗偏好持久化到 `localStorage`。
4. 要接真实接口，把来自 `@/mock/data` 的导入换成你自己的请求层。
   组件 API 保持不变 —— 一旦某个 prop 越界，审计会直接报出来。

## 贡献

请先阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)，其中写明了上述硬性规则与 PR 必须通过的五道门禁。
缺陷与需求请使用 [Issue 模板](.github/ISSUE_TEMPLATE)。安全问题见 [SECURITY.md](./SECURITY.md)。

本项目遵循 [Contributor Covenant](./CODE_OF_CONDUCT.md) 行为准则。

## 许可证

[MIT](./LICENSE) © fuxsto

## 致谢

- [fuxsto-design](https://design.fuxsto.cn) —— 本模板所依赖的组件库。
- [Vue](https://vuejs.org) · [Vite](https://vite.dev) · [Tailwind CSS](https://tailwindcss.com)
- [lucide-vue-next](https://lucide.dev) —— 图标。
