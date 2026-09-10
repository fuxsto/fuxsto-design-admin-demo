/**
 * 演示用 mock 数据。
 *
 * 说明（重要）：这里所有人名、金额、订单号、时间都是**占位演示数据**，
 * 不对应任何真实业务、真实版本或真实事件。接入真实后端时，
 * 把各页面里对 `@/mock/data` 的引用替换成你的请求层即可。
 */
import { avatarDataUri, coverDataUri } from '@/utils/media'

/* ------------------------------------------------------------------ 成员 */

export type UserRole = 'admin' | 'manager' | 'user'
export type UserStatus = 'active' | 'pending' | 'disabled'

export interface UserRow {
  id: number
  name: string
  email: string
  avatar: string
  role: UserRole
  status: UserStatus
  department: string
  lastLogin: string
  online: boolean
  joinedAt: string
  score: number
}

export const DEPARTMENTS = ['产品部', '设计部', '前端部', '后端部', '运维部', '测试部', '市场部'] as const

const SURNAMES = ['张', '李', '王', '陈', '刘', '赵', '孙', '周', '吴', '郑']
const GIVEN = ['伟', '娜', '强', '静', '洋', '磊', '敏', '超', '芳', '涛']

const pad = (n: number) => String(n).padStart(2, '0')

export const userList: UserRow[] = Array.from({ length: 42 }, (_, i) => {
  const name = SURNAMES[i % 10] + GIVEN[(i * 3) % 10]
  const dept = DEPARTMENTS[i % DEPARTMENTS.length]
  const role: UserRole = (['admin', 'manager', 'user'] as const)[i % 3]
  const status: UserStatus = (['active', 'active', 'active', 'pending', 'disabled'] as const)[i % 5]
  const day = (i % 27) + 1
  return {
    id: i + 1,
    name,
    email: `user${pad(i + 1)}@example.com`,
    avatar: avatarDataUri(name),
    role,
    status,
    department: dept,
    lastLogin: `2026-09-${pad(day)} ${pad(8 + (i % 12))}:${pad((i * 7) % 60)}`,
    online: i % 4 === 0,
    joinedAt: `202${3 + (i % 4)}-${pad((i % 12) + 1)}-${pad((i % 27) + 1)}`,
    score: 3 + ((i * 7) % 5) * 0.5,
  }
})

/* ------------------------------------------------------------------ 订单 */

export type OrderStatus = 'paid' | 'pending' | 'refunded' | 'shipping'
export type OrderChannel = 'web' | 'app' | 'miniapp' | 'h5'

export interface OrderRow {
  id: number
  no: string
  customer: string
  amount: number
  status: OrderStatus
  channel: OrderChannel
  createdAt: string
  items: number
}

export const orderList: OrderRow[] = Array.from({ length: 96 }, (_, i) => {
  const status: OrderStatus = (['paid', 'pending', 'refunded', 'shipping'] as const)[i % 4]
  const channel: OrderChannel = (['web', 'app', 'miniapp', 'h5'] as const)[i % 4]
  const day = (i % 27) + 1
  return {
    id: i + 1,
    no: `SO-2026${String(1000 + i)}`,
    customer: userList[i % userList.length].name,
    amount: 199 + ((i * 137) % 4800),
    status,
    channel,
    createdAt: `2026-09-${pad(day)} ${pad(9 + (i % 14))}:${pad((i * 11) % 60)}`,
    items: 1 + (i % 5),
  }
})

/* ---------------------------------------------------- 组织架构 / 权限树 */

export interface TreeNodeData {
  label: string
  value: string
  children?: TreeNodeData[]
}

export const orgTree: TreeNodeData[] = [
  {
    label: '研发中心',
    value: 'rd',
    children: [
      { label: '前端组', value: 'fe' },
      { label: '后端组', value: 'be' },
      { label: '测试组', value: 'qa' },
      { label: '运维组', value: 'ops' },
    ],
  },
  {
    label: '产品中心',
    value: 'pd',
    children: [
      { label: '产品组', value: 'pdm' },
      { label: '设计组', value: 'design' },
    ],
  },
  {
    label: '运营中心',
    value: 'op',
    children: [
      { label: '市场组', value: 'market' },
      { label: '用户运营', value: 'userop' },
      { label: '内容运营', value: 'content' },
    ],
  },
]

export const permissionTree: TreeNodeData[] = [
  {
    label: '工作台',
    value: 'p_dashboard',
    children: [
      { label: '查看数据看板', value: 'p_dash_view' },
      { label: '导出报表', value: 'p_dash_export' },
    ],
  },
  {
    label: '订单管理',
    value: 'p_order',
    children: [
      { label: '查看订单', value: 'p_order_view' },
      { label: '编辑订单', value: 'p_order_edit' },
      { label: '删除订单', value: 'p_order_del' },
      { label: '审核订单', value: 'p_order_audit' },
    ],
  },
  {
    label: '用户管理',
    value: 'p_user',
    children: [
      { label: '查看用户', value: 'p_user_view' },
      { label: '编辑用户', value: 'p_user_edit' },
      { label: '重置密码', value: 'p_user_reset' },
    ],
  },
  {
    label: '系统管理',
    value: 'p_system',
    children: [
      { label: '角色管理', value: 'p_role' },
      { label: '权限配置', value: 'p_perm' },
      { label: '审计日志', value: 'p_audit' },
    ],
  },
]

/* ------------------------------------------------------------------ 商品 */

export interface ProductItem {
  id: number
  name: string
  category: string
  stock: number
  price: number
  cover: string
  status: 'on' | 'off' | 'draft'
  rating: number
}

const CATEGORIES = ['机械键盘', '显示器', '鼠标', '耳机', '摄像头', '麦克风']

export const productList: ProductItem[] = Array.from({ length: 36 }, (_, i) => {
  const category = CATEGORIES[i % CATEGORIES.length]
  const name = `${category} ${String(i + 1).padStart(2, '0')}`
  return {
    id: i + 1,
    name,
    category,
    stock: 50 + ((i * 17) % 380),
    price: 99 + ((i * 73) % 4200),
    cover: coverDataUri(`prod-${i}`, 480, 360, category),
    status: (['on', 'off', 'draft'] as const)[i % 3],
    rating: 3 + ((i * 3) % 5) * 0.5,
  }
})

/* -------------------------------------------------------------- 穿梭框 */

export const transferData = [
  { key: 'vue', label: 'Vue 3', description: '渐进式 JavaScript 框架' },
  { key: 'react', label: 'React', description: '用于构建用户界面的库' },
  { key: 'ts', label: 'TypeScript', description: '带类型的 JavaScript 超集' },
  { key: 'tailwind', label: 'Tailwind CSS', description: 'Utility-first CSS 框架' },
  { key: 'vite', label: 'Vite', description: '前端构建工具' },
  { key: 'pinia', label: 'Pinia', description: 'Vue 状态管理库' },
  { key: 'router', label: 'Vue Router', description: 'Vue 官方路由' },
  { key: 'vitest', label: 'Vitest', description: '单元测试框架' },
  { key: 'playwright', label: 'Playwright', description: '端到端测试工具' },
  { key: 'eslint', label: 'ESLint', description: '代码静态检查' },
  { key: 'prettier', label: 'Prettier', description: '代码格式化' },
  { key: 'docker', label: 'Docker', description: '容器化运行时' },
]

/* ------------------------------------------------------------ 消息中心 */

export type MsgTag = 'work' | 'notice' | 'alert'

export interface MessageItem {
  id: number
  title: string
  body: string
  time: string
  starred: boolean
  done: boolean
  tag: MsgTag
}

export const messageList: MessageItem[] = [
  { id: 1, title: '《9 月第 2 周运营周报》已生成', body: '本周订单量环比上升，明细可在数据看板查看。', time: '刚刚', starred: true, done: false, tag: 'work' },
  { id: 2, title: '权限变更通知', body: '有一条角色权限调整待你确认。', time: '5 分钟前', starred: false, done: false, tag: 'notice' },
  { id: 3, title: '数据导出任务完成', body: '你发起的导出任务已生成文件，可前往下载。', time: '1 小时前', starred: true, done: true, tag: 'work' },
  { id: 4, title: '安全提醒', body: '检测到新设备登录，请确认是否本人操作。', time: '今天 09:23', starred: false, done: false, tag: 'alert' },
  { id: 5, title: '产品评审安排', body: '请于本周五前提交下季度路线图草案。', time: '昨天 17:00', starred: false, done: true, tag: 'work' },
  { id: 6, title: '会议纪要已归档', body: '《9 月产品评审会议》纪要已上传到文档库。', time: '昨天 12:30', starred: false, done: false, tag: 'notice' },
  { id: 7, title: '客户反馈待处理', body: '有一条客户反馈超时未响应，请优先处理。', time: '2 天前', starred: true, done: false, tag: 'alert' },
]

/* -------------------------------------------------------------- 时间轴 */

export interface TimelineEvent {
  timestamp: string
  title: string
  description: string
  status: 'default' | 'primary' | 'success' | 'warning' | 'error'
}

export const releaseTimeline: TimelineEvent[] = [
  { timestamp: '10:32', title: '依赖安装完成', description: '共 248 个包，耗时 21s', status: 'default' },
  { timestamp: '10:34', title: '类型检查通过', description: '0 error / 0 warning', status: 'success' },
  { timestamp: '10:36', title: '单元测试执行', description: '2 个用例失败，已定位到分页边界', status: 'error' },
  { timestamp: '10:45', title: '修复后重跑', description: '全部用例通过，覆盖率 86%', status: 'success' },
  { timestamp: '10:52', title: '构建产物生成', description: '产物体积 1.4 MB（gzip 412 KB）', status: 'primary' },
]

export const orderTimeline: TimelineEvent[] = [
  { timestamp: '2026-09-10 09:12', title: '订单创建', description: '客户在 Web 端提交订单', status: 'primary' },
  { timestamp: '2026-09-10 09:15', title: '支付成功', description: '支付渠道：示例支付', status: 'success' },
  { timestamp: '2026-09-10 11:40', title: '仓库拣货', description: '示例仓库 A 区', status: 'default' },
  { timestamp: '2026-09-10 16:08', title: '等待发货', description: '等待物流揽收', status: 'warning' },
]

/* ---------------------------------------------------------- 贡献热力图 */

export interface ContributionDay {
  date: string
  count: number
}

/** 生成本地演示用的提交热力数据（确定性，刷新不跳变） */
export function buildContribution(seed: number): ContributionDay[] {
  const days: ContributionDay[] = []
  const end = new Date('2026-09-10T00:00:00')
  for (let i = 0; i < 364; i++) {
    const d = new Date(end)
    d.setDate(end.getDate() - i)
    const r = Math.sin(i * 0.13 + seed) * 0.5 + 0.5
    const count = Math.floor(Math.pow(r, 3) * 16) + (i % 9 === 0 ? 0 : Math.floor(r * 3))
    days.push({ date: d.toISOString().slice(0, 10), count })
  }
  return days.reverse()
}

/* ---------------------------------------------------------------- 角色 */

export interface RoleItem {
  id: number
  name: string
  code: string
  desc: string
  memberIds: number[]
  permissions: string[]
  builtin?: boolean
}

export const roleList: RoleItem[] = [
  {
    id: 1,
    name: '超级管理员',
    code: 'super_admin',
    desc: '拥有全部模块的读写权限',
    memberIds: [1, 2],
    permissions: permissionTree.flatMap((g) => [g.value, ...(g.children ?? []).map((c) => c.value)]),
    builtin: true,
  },
  {
    id: 2,
    name: '订单管理员',
    code: 'order_admin',
    desc: '负责订单模块的日常处理',
    memberIds: [3, 4, 5, 6, 7],
    permissions: ['p_dash_view', 'p_dash_export', 'p_order_view', 'p_order_edit', 'p_order_audit', 'p_user_view'],
  },
  {
    id: 3,
    name: '审计员',
    code: 'auditor',
    desc: '只读权限 + 审计日志',
    memberIds: [8, 9, 10],
    permissions: ['p_dash_view', 'p_order_view', 'p_user_view', 'p_audit'],
  },
  {
    id: 4,
    name: '运营专员',
    code: 'operator',
    desc: '看板查看 + 用户维护',
    memberIds: [11, 12, 13, 14, 15, 16, 17, 18],
    permissions: ['p_dash_view', 'p_user_view', 'p_user_edit'],
  },
]

/* -------------------------------------------------------------- 看板 KPI */

export interface KpiItem {
  key: string
  title: string
  value: number
  precision: number
  prefix?: string
  suffix?: string
  delta: number
  hint: string
}

export const kpiList: KpiItem[] = [
  { key: 'revenue', title: '本月营收', value: 1284632, precision: 0, prefix: '¥', delta: 12.4, hint: '较上月' },
  { key: 'users', title: '新增用户', value: 3245, precision: 0, suffix: ' 人', delta: 8.6, hint: '较上月' },
  { key: 'orders', title: '订单总数', value: 8921, precision: 0, suffix: ' 单', delta: -2.1, hint: '较上月' },
  { key: 'rate', title: '支付转化率', value: 4.82, precision: 2, suffix: '%', delta: 0.6, hint: '较上月' },
]

export interface ProgressItem {
  name: string
  value: number
  status: 'normal' | 'success' | 'warning' | 'error'
  hint: string
}

export const projectProgress: ProgressItem[] = [
  { name: '前端工程', value: 78, status: 'normal', hint: 'Vue 3 / Vite / TypeScript' },
  { name: '后端服务', value: 62, status: 'normal', hint: 'Node.js / PostgreSQL' },
  { name: '移动端适配', value: 34, status: 'error', hint: '响应式断点与手势' },
  { name: '组件库接入', value: 92, status: 'success', hint: 'fuxsto-design 0.2.x' },
]

/* ------------------------------------------------------------ 其他素材 */

export const carouselSlides = [
  { key: 's1', title: '响应式后台布局', desc: '一套代码适配手机、平板与桌面', cover: coverDataUri('slide-1', 960, 360, '响应式布局') },
  { key: 's2', title: '表单与校验', desc: 'Form / FormItem 统一接管校验', cover: coverDataUri('slide-2', 960, 360, '表单与校验') },
  { key: 's3', title: '数据展示', desc: '表格、图表、虚拟列表开箱可用', cover: coverDataUri('slide-3', 960, 360, '数据展示') },
]

/** 演示用的流式文本（AI 页面） */
export const aiPhrases = [
  '正在读取页面结构……',
  '已识别 3 处可优化的表单校验。',
  '正在生成移动端断点建议。',
  '已产出一版改动清单，等待确认。',
  '完成，等待你的下一步指令。',
]

/** 常见问题（Collapse 演示） */
export const faqList = [
  {
    name: 'faq-1',
    title: '这套模板的数据是真实的吗？',
    body: '不是。所有数据都是本地生成的演示数据，仅用于展示组件用法，接入真实接口后替换 src/mock/data 的引用即可。',
  },
  {
    name: 'faq-2',
    title: '如何切换到暗色主题？',
    body: '主题由 CSS 变量驱动。点顶部工具栏的主题按钮会切换 html 上的 .dark 类，刷新后从 localStorage 恢复。',
  },
  {
    name: 'faq-3',
    title: '组件样式需要额外引入吗？',
    body: '需要。入口样式里必须按序写 @import "tailwindcss"; 与 @import "fuxsto-design/styles";，顺序颠倒会导致令牌不生效。',
  },
  {
    name: 'faq-4',
    title: '为什么动态路由页面的 Tailwind 类会丢失？',
    body: 'Tailwind v4 的扫描器不一定能跟上 router 里的动态 import。在样式入口用 @source 显式声明扫描范围即可。',
  },
]

/** 变更记录（只记录本模板自身改动，不虚构组件库版本） */
export const templateChangelog = [
  { date: '2026-09-10', text: '全量页面按组件库 0.2.0 的真实 API 重写，移除所有无效属性。' },
  { date: '2026-09-10', text: '补充移动端适配：侧边栏改为抽屉，表格横向滚动，栅格改为移动优先。' },
  { date: '2026-09-10', text: '素材改为本地生成，去掉外部图片依赖。' },
]
