<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Card,
  Statistic,
  Progress,
  Timeline,
  TimelineItem,
  Carousel,
  Image,
  Countdown,
  ContributionChart,
  VirtualList,
  ScrollArea,
  Divider,
  Chip,
  Badge,
  Button,
  Tabs,
  TabViews,
  Alert,
  Watermark,
  Text,
  Message,
  type ContributionDay,
} from 'fuxsto-design'
import { TrendingUp, RefreshCcw, Sparkles, Database, Server, Layers } from 'lucide-vue-next'
import { buildContribution, releaseTimeline, productList } from '@/mock/data'

const tab = ref('progress')
const tabOptions = [
  { value: 'progress', label: '进度 / 时间轴' },
  { value: 'countdown', label: '倒计时' },
  { value: 'contrib', label: '贡献热力图' },
  { value: 'virtual', label: '虚拟列表' },
  { value: 'watermark', label: '水印' },
]

/* ------------------------------------------------------------ 倒计时 */

// Countdown 的目标时间走 value（Date / 时间戳 / 可解析字符串），不是 target
const targets = [
  { name: '示例活动 A', value: new Date('2026-10-01T00:00:00').getTime() },
  { name: '示例活动 B', value: new Date('2026-09-11T09:00:00').getTime() },
  { name: '示例活动 C', value: new Date('2026-12-31T23:59:59').getTime() },
]

/* -------------------------------------------------------- 贡献热力图 */

const contributionA = computed<ContributionDay[]>(() => buildContribution(0))
const contributionB = computed<ContributionDay[]>(() => buildContribution(7))

/* ---------------------------------------------------------- 虚拟列表 */

const virtualItems = Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: `记录 ${String(i + 1).padStart(5, '0')}`,
  desc: `第 ${i + 1} 行 —— 虚拟列表只渲染可视区域内的行`,
}))

/* ------------------------------------------------------------ 进度条 */

const progressList = [
  { name: '依赖安装', value: 100, status: 'success' as const },
  { name: '类型检查', value: 72, status: 'normal' as const },
  { name: '单元测试', value: 45, status: 'warning' as const },
  { name: '打包构建', value: 18, status: 'error' as const },
]

/* ---------------------------------------------------------------- 其他 */

const refreshed = ref(false)
function refresh() {
  refreshed.value = true
  Message.success('已刷新（演示）')
  setTimeout(() => (refreshed.value = false), 600)
}

const covers = productList.slice(0, 4)
</script>

<template>
  <div class="flex flex-col gap-4">
    <Alert
      type="info"
      title="数据展示组件"
      description="覆盖 Statistic / Progress / Timeline / Carousel / Image / Countdown / ContributionChart / VirtualList / ScrollArea / Watermark。"
    />

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <Card shadow="sm" :animate="false">
        <Statistic title="今日营收" :value="124500" prefix="¥" :precision="0" :animate="false" />
        <Divider class="!my-3" />
        <div class="flex items-center gap-1.5 text-[11px] text-primary">
          <TrendingUp class="h-3 w-3" />
          <span>较昨日 +12.4%（示例）</span>
        </div>
      </Card>
      <Card shadow="sm" :animate="false">
        <Statistic title="新增用户" :value="3245" suffix=" 人" :animate="false" />
        <Divider class="!my-3" />
        <Progress :percentage="68" :show-text="false" status="normal" />
        <Text type="secondary" size="sm" class="mt-1 inline-block">完成本月目标 68%</Text>
      </Card>
      <Card shadow="sm" :animate="false">
        <Statistic title="接口成功率" :value="99.82" suffix="%" :precision="2" :animate="false" />
        <Divider class="!my-3" />
        <div class="flex items-center gap-3">
          <Progress :percentage="99.82" type="circle" size="sm" status="success" />
          <Text type="secondary" size="sm">最近 24 小时（示例）</Text>
        </div>
      </Card>
    </div>

    <Card shadow="sm" :animate="false" padding="none">
      <div class="overflow-x-auto px-3 pt-3">
        <Tabs v-model="tab" :options="tabOptions" variant="pill" size="sm" />
      </div>
      <Divider class="!my-0" />
      <TabViews v-model="tab" :options="tabOptions">
        <!-- 进度 / 时间轴 -->
        <template #progress>
          <div class="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
            <Card shadow="none" :animate="false">
              <template #header>
                <span class="text-xs font-extrabold">进度条</span>
                <Button size="sm" variant="ghost" :icon="RefreshCcw" :loading="refreshed" @click="refresh">刷新</Button>
              </template>
              <div class="flex flex-col gap-3">
                <div v-for="p in progressList" :key="p.name" class="flex flex-col gap-1">
                  <div class="flex justify-between text-xs">
                    <span>{{ p.name }}</span>
                    <span class="text-muted-foreground">{{ p.value }}%</span>
                  </div>
                  <Progress :percentage="p.value" :status="p.status" :show-text="false" />
                </div>
                <Divider class="!my-1" />
                <div class="flex flex-wrap items-center gap-3">
                  <Progress :percentage="70" type="circle" size="sm" />
                  <Progress :percentage="50" type="circle" size="sm" status="warning" />
                  <Progress :percentage="30" type="circle" size="sm" status="error" />
                </div>
              </div>
            </Card>

            <Card shadow="none" :animate="false">
              <template #header><span class="text-xs font-extrabold">时间轴</span></template>
              <!-- TimelineItem 用 status 控制节点配色，用 timestamp 显示时间 -->
              <Timeline>
                <TimelineItem
                  v-for="e in releaseTimeline"
                  :key="e.timestamp"
                  :title="e.title"
                  :description="e.description"
                  :timestamp="e.timestamp"
                  :status="e.status"
                />
              </Timeline>
            </Card>
          </div>
        </template>

        <!-- 倒计时 -->
        <template #countdown>
          <div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card v-for="t in targets" :key="t.name" shadow="none" :animate="false">
              <template #header>
                <span class="text-xs font-extrabold">{{ t.name }}</span>
                <Chip size="sm" variant="outline">目标时间</Chip>
              </template>
              <div class="flex justify-center">
                <Countdown :value="t.value" format="DD 天 HH:mm:ss" size="lg" />
              </div>
              <Text type="secondary" size="sm" class="mt-2 block text-center">
                {{ new Date(t.value).toLocaleString('zh-CN') }}
              </Text>
            </Card>
          </div>
        </template>

        <!-- 贡献热力图 -->
        <template #contrib>
          <div class="flex flex-col gap-4 p-4">
            <Card shadow="none" :animate="false">
              <template #header>
                <div class="flex items-center gap-2">
                  <Sparkles class="h-3.5 w-3.5 text-primary" />
                  <span class="text-xs font-extrabold">提交热力（green）</span>
                </div>
                <Chip size="sm" variant="outline">最近 52 周</Chip>
              </template>
              <div class="overflow-x-auto">
                <ContributionChart
                  :data="contributionA"
                  color-scheme="green"
                  :first-day-of-week="1"
                  :show-month-label="true"
                  :show-weekday-label="true"
                  :show-summary="true"
                />
              </div>
            </Card>

            <Card shadow="none" :animate="false">
              <template #header>
                <div class="flex items-center gap-2">
                  <Database class="h-3.5 w-3.5 text-primary" />
                  <span class="text-xs font-extrabold">活跃度（blue）</span>
                </div>
                <Chip size="sm" variant="outline">周起始：周日</Chip>
              </template>
              <div class="overflow-x-auto">
                <ContributionChart
                  :data="contributionB"
                  color-scheme="blue"
                  :first-day-of-week="0"
                  :cell-size="11"
                  :gap="3"
                  :show-month-label="true"
                  :show-summary="true"
                />
              </div>
            </Card>
          </div>
        </template>

        <!-- 虚拟列表 -->
        <template #virtual>
          <div class="p-4">
            <Card shadow="none" :animate="false">
              <template #header>
                <div class="flex items-center gap-2">
                  <Layers class="h-3.5 w-3.5 text-primary" />
                  <span class="text-xs font-extrabold">虚拟列表（5000 行）</span>
                </div>
                <Chip size="sm" variant="outline">只渲染可视行</Chip>
              </template>
              <VirtualList :items="virtualItems" :item-height="48" :height="360">
                <template #item="{ item }">
                  <div class="flex h-12 items-center gap-3 border-b border-border/40 px-3 text-xs hover:bg-muted/40">
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-base bg-muted">
                      <Database class="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div class="flex min-w-0 flex-col leading-tight">
                      <span class="truncate font-bold">{{ item.name }}</span>
                      <span class="truncate text-[10px] text-muted-foreground">{{ item.desc }}</span>
                    </div>
                    <span class="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground">#{{ item.id }}</span>
                  </div>
                </template>
              </VirtualList>
            </Card>
          </div>
        </template>

        <!-- 水印 -->
        <template #watermark>
          <div class="p-4">
            <Card shadow="none" :animate="false">
              <template #header><span class="text-xs font-extrabold">内部预览水印</span></template>
              <!-- Watermark 的文字用 text / texts，透明度用 opacity -->
              <Watermark text="内部预览 · 请勿外传" :rotate="-22" :opacity="0.12" :font-size="14" :gap="[90, 70]">
                <div class="min-h-[180px] rounded-base border border-border bg-muted/30 p-5">
                  <div class="flex flex-col gap-2">
                    <Statistic title="示例指标" :value="8642" :animate="false" size="sm" />
                    <Text type="secondary" size="sm">
                      这块内容被水印覆盖，常用于合同预览、设计稿审阅等防截图场景。
                    </Text>
                  </div>
                </div>
              </Watermark>
            </Card>
          </div>
        </template>
      </TabViews>
    </Card>

    <!-- 轮播 + 服务状态 -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card shadow="sm" :animate="false">
        <template #header><span class="text-xs font-extrabold">轮播</span></template>
        <!--
          每一页必须平铺成「直接子节点」：插槽里写 v-for 会被编译成单个 Fragment，
          Carousel 只会当成 1 页处理。
          另外：Carousel 会把「页宽/页高」以 style 形式透传到每页的根元素上，
          所以每页必须用一个普通 div 兜住；而 Image 的根是 Fragment（图片 + 预览 Teleport），
          class 无法自动穿透，尺寸只能走 width/height props。
        -->
        <Carousel :autoplay="true" :interval="3500" :dots="true" :arrows="true" height="200px" rounded="base">
          <div class="h-full w-full">
            <Image :src="covers[0].cover" :alt="covers[0].name" fit="cover" rounded="base" width="100%" height="100%" />
          </div>
          <div class="h-full w-full">
            <Image :src="covers[1].cover" :alt="covers[1].name" fit="cover" rounded="base" width="100%" height="100%" />
          </div>
          <div class="h-full w-full">
            <Image :src="covers[2].cover" :alt="covers[2].name" fit="cover" rounded="base" width="100%" height="100%" />
          </div>
          <div class="h-full w-full">
            <Image :src="covers[3].cover" :alt="covers[3].name" fit="cover" rounded="base" width="100%" height="100%" />
          </div>
        </Carousel>
      </Card>

      <Card shadow="sm" :animate="false">
        <template #header><span class="text-xs font-extrabold">服务状态（示例）</span></template>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Card v-for="s in [
            { name: 'API', desc: '正常', level: 'normal' },
            { name: 'DB', desc: '正常', level: 'normal' },
            { name: 'Cache', desc: '正常', level: 'normal' },
            { name: 'CDN', desc: '降级', level: 'degraded' },
          ]" :key="s.name" shadow="none" :animate="false" padding="sm">
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-base bg-primary/10 text-primary">
                <Server class="h-4 w-4" />
              </div>
              <div class="flex min-w-0 flex-col">
                <span class="text-xs font-bold">{{ s.name }}</span>
                <span class="text-[10px] text-muted-foreground">{{ s.desc }}</span>
              </div>
              <Badge
                size="sm"
                :variant="s.level === 'normal' ? 'primary' : 'destructive'"
                class="ml-auto"
              >
                {{ s.level === 'normal' ? '99.9%' : '降级' }}
              </Badge>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  </div>
</template>
