# fuxsto-design 组件全量清单

> 数据源：fuxsto-design 官方组件站点组件清单（spec v0.1.8，生成于 2026-09-09）  
> 交叉校验：本地已安装 `fuxsto-design@0.2.0` 的 `dist/index.d.ts` 导出列表  
> 站点共登记 **86** 个条目，其中 **9** 个为纯文档页（无 API/无导出），**77** 个为真实可用组件/工具函数。

## 汇总

| 分类 | 条目数 | 说明 |
|---|---|---|
| 基础组件 | 29 | 全部为可在模板中使用的组件 |
| 表单组件 | 20 | 全部为可在模板中使用的组件 |
| 反馈组件 | 15 | 全部为可在模板中使用的组件 |
| 数据展示 | 8 | 全部为可在模板中使用的组件 |
| 导航组件 | 4 | 全部为可在模板中使用的组件 |
| 工具 | 1 | 全部为可在模板中使用的组件 |
| 入门 | 4 | 文档页：组件总览 / 快速开始 / Playground ×2 |
| 指南 | 3 | 文档页：设计原则与主题 / 暗色与无障碍 / 更新日志 |
| 支持项目 | 2 | 文档页：Sponsor / Feedback |

**硬性要求口径：模板需覆盖的 = 76 个组件 + 1 个工具函数 `cn` = 77 项。**

## 基础组件（29）

| # | 组件 | 导出名 | slug | 主要用途 |
|---|---|---|---|---|
| 1 | **Avatar** | `Avatar` | `avatar` | 展示一个人或一个组织。图片加载失败时自动按名字生成缩写占位，不会留下空框。 |
| 2 | **AvatarGroup** | `AvatarGroup` | `avatar-group` | 把多个头像叠成一排并折叠出「+N」。协作者列表、参与人预览用它。 |
| 3 | **Badge** | `Badge` | `badge` | 数字或圆点提示。单独用是独立徽标，套住一个元素就变成右上角角标，用来标未读、待办数量。 |
| 4 | **Button** | `Button` | `button` | 所有需要用户点一下才发生的事都从它开始。五种变体覆盖主次操作、危险操作和纯图标按钮，自带 loading 与禁用态。 |
| 5 | **ButtonGroup** | `ButtonGroup` | `button-group` | 把一组同类操作拼成一条，共享圆角与边框。适合工具栏、分段操作，不适合装互不相关的按钮。 |
| 6 | **Card** | `Card` | `card` | 给一块内容画出边界。头部、正文、底部三段结构，是列表项、表单区块、仪表盘面板最常用的外壳。 |
| 7 | **Tag** | `Chip / Tag` | `chip` | 一小块可读可点的标签。展示状态、分类、关键词，开 selectable 后可以当轻量筛选器用。 |
| 8 | **ChipGroup** | `ChipGroup / TagGroup` | `chip-group` | 管一排 Chip 的选中状态，支持单选与多选。要做筛选条用它，不要自己在外面维护数组。 |
| 9 | **Collapse** | `Collapse` | `collapse` | 把长内容折起来，只在需要时展开。FAQ、高级设置、日志详情都适合。 |
| 10 | **CollapseItem** | `CollapseItem` | `collapse-item` | Collapse 的单个面板，负责自己的标题与展开状态。 |
| 11 | **ContextMenu** | `ContextMenu` | `context-menu` | 右键唤起的操作菜单。给表格行、卡片、画布元素提供就地操作。 |
| 12 | **Divider** | `Divider` | `divider` | 在内容之间划一条线。支持横竖两向和居中文字，用来分区块比堆 margin 更明确。 |
| 13 | **Link** | `Link` | `link` | 行内可点的链接。语义变体配色、下划线开关、禁用态，导航和「查看更多」用它而不是手写 a 标签。 |
| 14 | **List** | `List` | `list` | 纵向排列的条目容器，比 Table 轻，适合消息、动态、设置项。 |
| 15 | **ListItem** | `ListItem` | `list-item` | List 的单条内容，提供左图标、主副标题、右侧操作区的固定骨架。 |
| 16 | **Menu** | `Menu` | `menu` | 点击后弹出的操作列表。放次要操作、更多操作，避免把十个按钮全铺在界面上。 |
| 17 | **Pagination** | `Pagination` | `pagination` | 数据太多时分页翻阅。与 Table 搭配是最常见的组合。 |
| 18 | **Paragraph** | `Paragraph` | `paragraph` | 整段正文文字。控制行距、是否可复制，和 Title / Text 搭出文章式排版。 |
| 19 | **ScrollArea** | `ScrollArea` | `scroll-area` | 给自己一块区域换一套更克制的滚动条。thin / md / thick 三档粗细，可自动隐藏，不依赖浏览器默认样式。 |
| 20 | **Segmented** | `Segmented` | `segmented` | 几个互斥选项之间快速切换，比 Radio 更紧凑、比 Tabs 更轻。时间范围、视图模式切换的首选。 |
| 21 | **Steps** | `Steps` | `steps` | 把一件多步骤的事画成进度条，让用户知道自己在第几步、还剩几步。表单向导、审核流程用它。 |
| 22 | **TabViews** | `TabViews` | `tab-views` | 带过渡的视图切换容器，配合 Tabs 使用，负责内容区的进出动画。 |
| 23 | **Table** | `Table` | `table` | 结构化数据的行列展示。列定义、自定义单元格、空态与加载态都在组件内处理。 |
| 24 | **Tabs** | `Tabs` | `tabs` | 同一块区域里切换几组平级内容，切换成本低、上下文不丢。层级更深的导航别用它。 |
| 25 | **Text** | `Text` | `text` | 一行字的最小单位。语义变体（default / secondary / success / warning / danger）、加粗、斜体、删除线、可复制，按需组合。 |
| 26 | **Title** | `Title` | `title` | 页面的各级标题。1 到 6 级对应 h1-h6，语义变体配色，需要复制整段标题时开 copyable。 |
| 27 | **Transfer** | `Transfer` | `transfer` | 两栏之间把数据搬来搬去。选权限、选收件人、选字段列，比一堆 Checkbox 更清楚已选和待选各有什么。 |
| 28 | **Tree** | `Tree` | `tree` | 嵌套数据的层级展示。展开收起、单选多选、异步懒加载子节点，组织架构、目录树、分类筛选用它。 |
| 29 | **VirtualList** | `VirtualList` | `virtual-list` | 上千条数据也只渲染看得到的那几行。固定行高、按可视区域裁剪，长名单、日志流、大表格行用它不会卡。 |

## 表单组件（20）

| # | 组件 | 导出名 | slug | 主要用途 |
|---|---|---|---|---|
| 30 | **AutoComplete** | `AutoComplete` | `auto-complete` | 边打字边给候选。用户心里有个大概答案但记不全时用它，比在 Select 里翻找更直接。 |
| 31 | **Cascader** | `Cascader` | `cascader` | 多级联动地选一个值。省市区、分类树这类「前一级定了后一级才出来」的数据，比几个 Select 串起来更顺手。 |
| 32 | **Checkbox** | `Checkbox` | `checkbox` | 可以选多个，也可以单独当「我已阅读并同意」用。支持半选态。 |
| 33 | **CheckboxGroup** | `CheckboxGroup` | `checkbox-group` | 管一组 Checkbox 的取值数组，负责全选、半选与上限控制。 |
| 34 | **ColorPicker** | `ColorPicker` | `color-picker` | 选一个颜色。色相饱和度面板、透明度、预设色板、取色器吸管，主题定制、标注配色用它。 |
| 35 | **DatePicker** | `DatePicker` | `date-picker` | 选一个日期或一段日期范围。单日、范围、快捷选项（今天/本周/近30天）、月份翻页，排程、筛选时间窗。 |
| 36 | **Form** | `Form` | `form` | 一组输入的统一管理者：布局、标签对齐、校验规则、整体提交与重置都由它接管。 |
| 37 | **FormItem** | `FormItem` | `form-item` | 单个字段的容器，负责标签、必填标记、校验反馈与错误文案的位置。 |
| 38 | **Input** | `Input` | `input` | 最基础的文字输入。前后缀图标、清除按钮、字数统计、密码显隐都在里面。 |
| 39 | **InputNumber** | `InputNumber` | `input-number` | 只能输数字的输入框。步进按钮、精度小数位、前后缀单位，数量、金额、配额用它而不是普通 Input。 |
| 40 | **PinInput** | `PinInput` | `pin-input` | 分格填写的短验证码。手机验证码、邮箱验证码、支付密码用它，比单个长输入框更合适。 |
| 41 | **Radio** | `Radio` | `radio` | 一组选项里只能选一个，且选项要全部亮出来给人看。 |
| 42 | **RadioGroup** | `RadioGroup` | `radio-group` | 管一组 Radio 的取值，负责互斥逻辑与横竖排布。 |
| 43 | **Rate** | `Rate` | `rate` | 给一个东西打分。半星、只读、自定义字符与尺寸，评价、评分、满意度采集。 |
| 44 | **Select** | `Select` | `select` | 选项太多铺不开时收进下拉框。支持搜索、清除、禁用项与自定义选项渲染。 |
| 45 | **Slider** | `Slider` | `slider` | 在一个区间里拖动选值。单值或双滑块选范围、步进与刻度标记，调参、价格区间用它比 InputNumber 更直观。 |
| 46 | **Switch** | `Switch` | `switch` | 一个开关一件事，改完立刻生效。需要点「保存」才生效的场景请用 Checkbox。 |
| 47 | **Textarea** | `Textarea` | `textarea` | 多行文字输入。清除按钮、字数上限计数、自适应高度，写备注、描述、长回复用它。 |
| 48 | **TimePicker** | `TimePicker` | `time-picker` | 选一个时间点。小时/分钟/秒三列联动，也支持选一段时长，预约、提醒、定时任务。 |
| 49 | **Upload** | `Upload` | `upload` | 把本地文件传上去。拖拽上传、多文件、缩略图预览、进度条与上传状态，头像、附件、批量导入。 |

## 反馈组件（15）

| # | 组件 | 导出名 | slug | 主要用途 |
|---|---|---|---|---|
| 50 | **Alert** | `Alert` | `alert` | 页面顶部的内联提示条。四种类型（info / success / warning / error）、可关闭、带图标、可整行 banner，比 Message 更持久、比 Result 更轻。 |
| 51 | **BackTop** | `BackTop` | `back-top` | 长页面滚到底后一键回顶。滚动超过阈值才出现，不占视觉。 |
| 52 | **Dialog** | `Dialog / DialogComponent` | `dialog` | 打断当前流程，要用户先处理完这件事。确认删除、填一个小表单、看一段详情。 |
| 53 | **Drawer** | `Drawer` | `drawer` | 从边缘滑出的面板。比 Dialog 能装更多内容，又不像新页面那样丢掉上下文。 |
| 54 | **Empty** | `Empty` | `empty` | 列表没数据时该显示什么。区分「一条都还没有」和「筛选后没命中」，并给出下一步动作。 |
| 55 | **Loading** | `Loading` | `loading` | 局部或全屏的加载遮罩。可以包住一块区域，也可以用指令挂在任意容器上。 |
| 56 | **Message** | `Message (函数)` | `message` | 轻量的全局提示，几秒后自己消失。用于「保存成功」这类不需要用户回应的结果。 |
| 57 | **Notification** | `Notification (函数)` | `notification` | 右上角的通知卡片，能放标题、正文和操作按钮。适合信息量比 Message 大、可以稍后再看的消息。 |
| 58 | **Popconfirm** | `Popconfirm` | `popconfirm` | 就地确认一个有风险的操作。比 Dialog 轻，适合「确定删除这一行吗」。 |
| 59 | **Result** | `Result` | `result` | 一整页的结果反馈。支付成功、提交完成、403、500，附带主次操作引导。 |
| 60 | **Skeleton** | `Skeleton` | `skeleton` | 内容还没到时先占好位置，避免加载完成时页面整体跳动。 |
| 61 | **StreamingText** | `StreamingText` | `streaming-text` | AI 思考过程风格的流式文本切换。传入一个文本列表，组件会按 random/sequence 模式自动轮换，字符串宽度平滑过渡，手动 next/prev/goTo 可控，loading 状态文字级扫光。 |
| 62 | **Tooltip** | `Tooltip` | `tooltip` | 悬停时补一句解释。图标按钮的含义、被截断的文字全文、字段的填写说明。 |
| 63 | **Tour** | `Tour / startTour` | `tour` | 第一次进来带用户走一遍。聚光灯挖孔聚焦目标、步骤气泡讲解、声明式与函数式两种调用，新人引导、功能巡礼。 |
| 64 | **Watermark** | `Watermark` | `watermark` | 在内容上铺一层半透明的文字或图片印记。版权声明、防截图泄密、内部预览水印，旋转角度、平铺间距、透明度都可调。 |

## 数据展示（8）

| # | 组件 | 导出名 | slug | 主要用途 |
|---|---|---|---|---|
| 65 | **Carousel** | `Carousel` | `carousel` | 几张图轮流翻。slide 滑动和 fade 淡入两种切换、自动播放、箭头与指示点，首页 banner、商品轮播。 |
| 66 | **ContributionChart** | `ContributionChart` | `contribution-chart` | GitHub 风格的贡献热力图。一年 52 周 × 7 天网格，4 级配色、悬停 Tooltip、点击事件、月份/星期标签可配，活动记录、学习打卡、内容产出。 |
| 67 | **Countdown** | `Countdown` | `countdown` | 从某个时间点往零倒数。自定义格式（天时分秒）、数字滚动动画、到点回调，活动倒计时、限时优惠。 |
| 68 | **Image** | `Image` | `image` | 展示一张图，加载时有占位、加载失败有回退、点开能放大看全图。头像缩略、商品图、配图都用它。 |
| 69 | **Progress** | `Progress` | `progress` | 一件事做到什么程度了。线形与环形两种，用于上传、任务、配额占用。 |
| 70 | **Statistic** | `Statistic` | `statistic` | 把一个关键数字放大展示，带滚动动画与前后缀。仪表盘顶部的核心指标卡用它。 |
| 71 | **Timeline** | `Timeline` | `timeline` | 按时间顺序讲一串事情。操作日志、物流轨迹、版本历史。 |
| 72 | **TimelineItem** | `TimelineItem` | `timeline-item` | Timeline 的单个节点，负责时间、图标、状态色与内容排布。 |

## 导航组件（4）

| # | 组件 | 导出名 | slug | 主要用途 |
|---|---|---|---|---|
| 73 | **Anchor** | `Anchor` | `anchor` | 长文档里「这一段讲什么」的侧边索引。滚动时自动高亮当前段，点一下跳到对应区块。 |
| 74 | **Breadcrumb** | `Breadcrumb` | `breadcrumb` | 告诉用户「我现在在哪、上一层是什么」。层级深的后台页面必备。 |
| 75 | **BreadcrumbItem** | `BreadcrumbItem` | `breadcrumb-item` | Breadcrumb 的单个节点，负责链接跳转与当前项的高亮。 |
| 76 | **Header** | `Header` | `header` | 页面顶部的固定栏。放品牌、主导航与右侧操作区，自带滚动时的毛玻璃与边框变化。 |

## 工具（1）

| # | 组件 | 导出名 | slug | 主要用途 |
|---|---|---|---|---|
| 77 | **cn** | `cn (工具函数)` | `cn` | 合并类名的工具函数，处理条件类名与 Tailwind 冲突覆盖。二次封装组件时几乎一定会用到。 |

## 非组件条目（文档页，无需在模板中使用）

| 条目 | slug | 分类 |
|---|---|---|
| Playground | `ai-playground` | 入门 |
| 快速开始 | `getting-started` | 入门 |
| 组件总览 | `overview` | 入门 |
| Playground | `playground` | 入门 |
| 更新日志 | `changelog` | 指南 |
| 暗色与无障碍 | `dark-mode` | 指南 |
| 设计原则与主题 | `design` | 指南 |
| Sponsor | `donate` | 支持项目 |
| Feedback | `feedback` | 支持项目 |
