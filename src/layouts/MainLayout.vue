<script setup lang="ts">
import { ref, computed, type Component } from 'vue'
import { useRouter, useRoute, RouterView } from 'vue-router'
import {
  Header,
  Drawer,
  Breadcrumb,
  BreadcrumbItem,
  Avatar,
  AvatarGroup,
  Menu,
  Tooltip,
  Chip,
  Badge,
  Divider,
  Input,
  Button,
  ScrollArea,
  Tour,
  startTour,
  Notification,
  Message,
  type TourStep,
} from 'fuxsto-design'
import {
  Search,
  Bell,
  Sun,
  Moon,
  HelpCircle,
  Menu as MenuIcon,
  LogOut,
  Settings as SettingsIcon,
  User as UserIcon,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Package,
  FileText,
  ListFilter,
  MessageSquare,
  BarChart3,
  Sparkles,
  Settings,
} from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const { isDark, toggle } = useThemeStore()
const userStore = useUserStore()
const user = computed(() => userStore.state.user)

const iconMap: Record<string, Component> = {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Package,
  FileText,
  ListFilter,
  MessageSquare,
  BarChart3,
  Sparkles,
  Settings,
}

/* ---------------------------------------------------------- 侧边导航数据 */

interface NavItem {
  key: string
  title: string
  icon: Component
  path: string
  badge?: string
}

const navItems = computed<NavItem[]>(() => {
  const layout = router.options.routes.find((r) => r.path === '/')
  if (!layout?.children) return []
  return layout.children
    .filter((c) => c.meta && !c.meta.hidden)
    .map((c) => {
      const iconName = (c.meta?.icon as string) ?? ''
      return {
        key: String(c.name ?? c.path),
        title: (c.meta?.title as string) ?? String(c.name ?? c.path),
        icon: iconMap[iconName] ?? LayoutDashboard,
        path: `/${c.path}`,
      }
    })
})

const activeKey = computed(() => String(route.name ?? 'dashboard'))

function goNav(item: NavItem) {
  router.push(item.path)
  mobileNavOpen.value = false
}

/* ------------------------------------------------------------ 移动端抽屉 */

const mobileNavOpen = ref(false)

/* -------------------------------------------------------------- 面包屑 */

const breadcrumbItems = computed(() =>
  route.matched
    .filter((r) => r.meta?.title)
    .map((r, i, arr) => ({
      title: String(r.meta?.title ?? r.name ?? r.path),
      current: i === arr.length - 1,
    })),
)

/* ---------------------------------------------------------------- 通知 */

const unread = ref(3)
function showNotifications() {
  Notification({
    title: `你有 ${unread.value} 条未读消息`,
    message: '这只是演示用的本地通知，不对应任何真实事件。',
    type: 'info',
    duration: 4000,
  })
  unread.value = 0
}

/* ------------------------------------------------------------ 用户菜单 */

const userMenuOptions = [
  [
    { label: '个人中心', value: 'profile', icon: UserIcon as Component },
    { label: '系统设置', value: 'settings', icon: SettingsIcon as Component },
  ],
  [{ label: '退出登录', value: 'logout', icon: LogOut as Component, danger: true }],
]

function onUserMenu(opt: { value: string | number }) {
  const key = String(opt.value)
  if (key === 'profile') router.push('/profile')
  else if (key === 'settings') router.push('/settings')
  else if (key === 'logout') {
    Message.success('已退出登录（演示）')
    router.push('/login')
  }
}

/* -------------------------------------------------------------- 搜索 */

const searchKeyword = ref('')
function onSearch() {
  const kw = searchKeyword.value.trim()
  if (!kw) return
  Message.info(`演示搜索：${kw}`)
  searchKeyword.value = ''
}

/* ------------------------------------------------------------ 新手引导 */

const tourOpen = ref(false)
const tourSteps: TourStep[] = [
  { target: '#fx-nav-toggle', title: '导航开关', description: '窄屏下点这里呼出侧边导航。', placement: 'bottom' },
  { target: '#fx-header-actions', title: '顶部操作区', description: '搜索、通知、主题切换与个人菜单都在这里。', placement: 'bottom' },
  { target: '#fx-sidebar', title: '侧边导航', description: '宽屏常驻，窄屏收进抽屉。', placement: 'right' },
]

function runTour() {
  startTour({
    steps: tourSteps,
    onFinish: () => Message.success('引导完成'),
    onSkip: () => Message.info('已跳过引导'),
  })
}

/* ------------------------------------------------------------ 侧栏内容 */

const onlineMembers = computed(() => userStore.state.user ? [userStore.state.user.name] : [])
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground">
    <Header
      title="Fuxsto Admin Pro"
      description="响应式后台模板示例"
      size="md"
      bordered
      glass
      sticky
    >
      <div id="fx-header-actions" class="flex items-center gap-1.5">
        <!-- 窄屏：呼出侧边导航 -->
        <Button
          id="fx-nav-toggle"
          class="lg:hidden"
          size="sm"
          variant="ghost"
          :icon="MenuIcon"
          :animate="false"
          @click="mobileNavOpen = true"
        />

        <Input
          v-model="searchKeyword"
          size="sm"
          class="hidden md:block md:w-44 lg:w-60"
          placeholder="搜索（演示）"
          :prefix-icon="Search"
          clearable
          @keyup.enter="onSearch"
        />

        <Tooltip content="切换明暗主题">
          <Button size="sm" variant="ghost" :icon="isDark ? Sun : Moon" :animate="false" @click="toggle" />
        </Tooltip>

        <Tooltip content="新手引导">
          <Button size="sm" variant="ghost" :icon="HelpCircle" :animate="false" @click="runTour" />
        </Tooltip>

        <Tooltip content="通知">
          <div class="relative inline-flex">
            <Button size="sm" variant="ghost" :icon="Bell" :animate="false" @click="showNotifications" />
            <Badge v-if="unread" :value="String(unread)" variant="destructive" size="sm" class="pointer-events-none absolute -right-1 -top-1" />
          </div>
        </Tooltip>

        <Divider direction="vertical" class="mx-0.5 hidden sm:block" />

        <Menu :options="userMenuOptions" placement="bottom-end" @select="onUserMenu">
          <button class="flex items-center gap-2 rounded-full py-1 pl-1 pr-1 transition-colors hover:bg-muted">
            <Avatar
              :name="user?.name ?? '演示'"
              :src="user?.avatar"
              :status="user?.online ? 'online' : 'offline'"
              size="sm"
            />
            <span class="hidden text-xs font-bold md:inline">{{ user?.name }}</span>
          </button>
        </Menu>
      </div>
    </Header>

    <div class="flex w-full flex-1">
      <!-- 宽屏常驻侧栏 -->
      <aside id="fx-sidebar" class="hidden w-56 shrink-0 border-r border-border bg-background lg:flex lg:flex-col xl:w-60">
        <ScrollArea class="flex-1" orientation="vertical">
          <nav class="flex flex-col gap-1 p-3">
            <button
              v-for="item in navItems"
              :key="item.key"
              class="flex h-9 items-center gap-2.5 rounded-base px-3 text-left text-xs font-medium transition-colors"
              :class="
                activeKey === item.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              "
              @click="goNav(item)"
            >
              <component :is="item.icon" class="h-4 w-4 shrink-0" />
              <span class="truncate">{{ item.title }}</span>
            </button>
          </nav>
        </ScrollArea>

        <div class="border-t border-border p-3">
          <div class="rounded-base bg-muted p-3">
            <div class="mb-1.5 flex items-center gap-1.5 text-xs font-bold">
              <Sparkles class="h-3 w-3" />
              <span>演示提示</span>
            </div>
            <p class="text-[11px] leading-relaxed text-muted-foreground">
              全部数据均为本地生成的示例数据。点右上角的问号可以启动引导。
            </p>
            <div class="mt-2 flex items-center gap-2">
              <AvatarGroup :max="3" size="sm">
                <Avatar
                  v-for="n in onlineMembers"
                  :key="n"
                  :name="n"
                  size="sm"
                />
                <Avatar name="示例 A" size="sm" />
                <Avatar name="示例 B" size="sm" />
                <Avatar name="示例 C" size="sm" />
              </AvatarGroup>
              <Chip size="sm" variant="outline">在线</Chip>
            </div>
          </div>
        </div>
      </aside>

      <!-- 窄屏抽屉侧栏 -->
      <Drawer v-model:open="mobileNavOpen" title="导航" placement="left" size="sm">
        <nav class="flex flex-col gap-1">
          <button
            v-for="item in navItems"
            :key="item.key"
            class="flex h-10 items-center gap-2.5 rounded-base px-3 text-left text-sm transition-colors"
            :class="
              activeKey === item.key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            "
            @click="goNav(item)"
          >
            <component :is="item.icon" class="h-4 w-4 shrink-0" />
            <span>{{ item.title }}</span>
          </button>
        </nav>
      </Drawer>

      <!-- 主区域 -->
      <main class="flex min-w-0 flex-1 flex-col">
        <div class="flex h-10 items-center gap-2 border-b border-border px-3 sm:px-4 lg:px-6">
          <Breadcrumb separator="/" size="sm">
            <BreadcrumbItem v-for="(b, i) in breadcrumbItems" :key="i" :current="b.current">
              {{ b.title }}
            </BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div class="flex-1 overflow-x-hidden p-3 sm:p-4 lg:p-6">
          <RouterView v-slot="{ Component }">
            <transition name="fx-fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </RouterView>
        </div>
      </main>
    </div>

    <!-- 声明式 Tour（与函数式 startTour 二选一，这里保留组件用法示例） -->
    <Tour v-model:open="tourOpen" :steps="tourSteps" />
  </div>
</template>

<style scoped>
.fx-fade-enter-active,
.fx-fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.fx-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fx-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
