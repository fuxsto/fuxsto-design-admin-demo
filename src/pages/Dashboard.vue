<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Card,
  Button,
  ButtonGroup,
  Chip,
  Divider,
  Alert,
  Tabs,
  TabViews,
  Carousel,
  Image,
  Progress,
  Timeline,
  TimelineItem,
  List,
  ListItem,
  Avatar,
  AvatarGroup,
  Skeleton,
  Empty,
  Link,
  Badge,
  Title,
  Text,
  Paragraph,
  Statistic,
  Countdown,
  Message,
} from 'fuxsto-design'
import { Rocket, Zap, Activity, ChevronRight, RefreshCcw } from 'lucide-vue-next'
import KpiCard from '@/components/KpiCard.vue'
import {
  kpiList,
  projectProgress,
  orderList,
  userList,
  productList,
  carouselSlides,
  releaseTimeline,
  templateChangelog,
} from '@/mock/data'

const router = useRouter()

/** 时间范围切换 —— ButtonGroup 适合放一组同类操作 */
const range = ref('30d')
const rangeButtons = [
  { label: '今日', value: '1d' },
  { label: '近 7 天', value: '7d' },
  { label: '近 30 天', value: '30d' },
]

const tab = ref('overview')
const tabOptions = [
  { value: 'overview', label: '概览' },
  { value: 'orders', label: '最近订单' },
  { value: 'team', label: '团队动态' },
  { value: 'about', label: '关于模板' },
]

const loading = ref(true)
onMounted(() => {
  setTimeout(() => (loading.value = false), 600)
})

const recentOrders = orderList.slice(0, 6)
const teamMembers = userList.slice(0, 5)
const topProducts = productList.slice(0, 4)

/** 演示用截止时间：固定相对时间，避免每次刷新跳变 */
const deadline = new Date('2026-09-30T23:59:59').getTime()

function go(path: string) {
  router.push(path)
}

function onRange(value: string | number) {
  range.value = String(value)
  Message.info(`已切换到「${rangeButtons.find((b) => b.value === range.value)?.label}」视图（演示）`)
}

const statusText: Record<string, string> = {
  paid: '已付款',
  pending: '待付款',
  refunded: '已退款',
  shipping: '配送中',
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- 欢迎区 -->
    <Card shadow="sm" :animate="false">
      <div class="flex flex-wrap items-center gap-4">
        <Avatar name="演示" size="lg" status="online" />
        <div class="min-w-[200px] flex-1">
          <Title :level="3">工作台</Title>
          <Paragraph secondary size="sm" class="!mt-0.5">
            下面的所有数字都来自本地生成的示例数据，仅用于演示组件排版。
          </Paragraph>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <Chip variant="primary" size="sm">示例数据</Chip>
          <Countdown :value="deadline" format="DD 天 HH:mm:ss" size="sm" />
          <Button size="sm" variant="outline" :icon="RefreshCcw" @click="Message.success('已刷新（演示）')">
            刷新
          </Button>
        </div>
      </div>
    </Card>

    <!-- 时间范围 + KPI -->
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between gap-2">
        <ButtonGroup>
          <Button
            v-for="b in rangeButtons"
            :key="b.value"
            size="sm"
            :variant="range === b.value ? 'primary' : 'outline'"
            :animate="false"
            @click="onRange(b.value)"
          >
            {{ b.label }}
          </Button>
        </ButtonGroup>
        <Text type="secondary" size="sm" class="hidden sm:block">
          统计口径：{{ rangeButtons.find((b) => b.value === range)?.label }}
        </Text>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          v-for="k in kpiList"
          :key="k.key"
          :title="k.title"
          :value="k.value"
          :precision="k.precision"
          :prefix="k.prefix"
          :suffix="k.suffix"
          :delta="k.delta"
          :hint="k.hint"
        />
      </div>
    </div>

    <Alert
      type="info"
      title="关于本模板"
      description="这是一个后台布局示例：所有页面均按 fuxsto-design 0.2.0 的真实 API 编写，数据为本地生成。"
      closable
    />

    <!-- 分区域 -->
    <Card shadow="sm" :animate="false" padding="none">
      <div class="overflow-x-auto px-3 pt-3">
        <Tabs v-model="tab" :options="tabOptions" variant="pill" size="sm" />
      </div>
      <Divider class="!my-0" />
      <TabViews v-model="tab" :options="tabOptions">
        <!-- 概览 -->
        <template #overview>
          <div class="grid grid-cols-1 gap-4 p-4 xl:grid-cols-3">
            <Card shadow="none" :animate="false" class="xl:col-span-2">
              <template #header>
                <div class="flex items-center gap-2">
                  <Rocket class="h-3.5 w-3.5 text-primary" />
                  <span class="text-xs font-extrabold">模板亮点</span>
                </div>
                <Link href="#/settings" size="sm">去设置 →</Link>
              </template>

              <!--
                Carousel 用默认插槽，每个「直接子节点」是一页。
                注意：不要在插槽里写 v-for —— 会被编译成单个 Fragment，
                组件只会当成 1 页处理。这里按页数平铺。
                另外：Carousel 把页宽/页高以 style 透传到每页根元素，故每页用普通 div 承接；
                Image 根节点是 Fragment，class 无法穿透，尺寸必须用 width/height props。
              -->
              <Carousel :autoplay="true" :interval="4500" :dots="true" :arrows="true" height="200px" rounded="base">
                <div class="relative h-full w-full">
                  <Image :src="carouselSlides[0].cover" :alt="carouselSlides[0].title" fit="cover" rounded="base" width="100%" height="100%" />
                  <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <div class="text-xs font-bold text-white">{{ carouselSlides[0].title }}</div>
                    <div class="text-[11px] text-white/80">{{ carouselSlides[0].desc }}</div>
                  </div>
                </div>
                <div class="relative h-full w-full">
                  <Image :src="carouselSlides[1].cover" :alt="carouselSlides[1].title" fit="cover" rounded="base" width="100%" height="100%" />
                  <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <div class="text-xs font-bold text-white">{{ carouselSlides[1].title }}</div>
                    <div class="text-[11px] text-white/80">{{ carouselSlides[1].desc }}</div>
                  </div>
                </div>
                <div class="relative h-full w-full">
                  <Image :src="carouselSlides[2].cover" :alt="carouselSlides[2].title" fit="cover" rounded="base" width="100%" height="100%" />
                  <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <div class="text-xs font-bold text-white">{{ carouselSlides[2].title }}</div>
                    <div class="text-[11px] text-white/80">{{ carouselSlides[2].desc }}</div>
                  </div>
                </div>
              </Carousel>

              <Divider class="!my-3" />

              <div class="flex flex-col gap-2.5">
                <div v-for="p in projectProgress" :key="p.name" class="flex flex-col gap-1">
                  <div class="flex items-center justify-between gap-2 text-xs">
                    <span class="font-bold">{{ p.name }}</span>
                    <span class="text-[11px] text-muted-foreground">{{ p.hint }} · {{ p.value }}%</span>
                  </div>
                  <Progress :percentage="p.value" :status="p.status" :show-text="false" />
                </div>
              </div>
            </Card>

            <Card shadow="none" :animate="false">
              <template #header>
                <div class="flex items-center gap-2">
                  <Zap class="h-3.5 w-3.5 text-primary" />
                  <span class="text-xs font-extrabold">团队成员</span>
                </div>
                <AvatarGroup :max="4" size="sm">
                  <Avatar v-for="m in teamMembers" :key="m.id" :name="m.name" :src="m.avatar" size="sm" />
                </AvatarGroup>
              </template>

              <Skeleton v-if="loading" :rows="4" avatar />
              <List v-else size="sm" hover :split="false">
                <ListItem v-for="m in teamMembers" :key="m.id">
                  <template #prefix>
                    <Avatar :name="m.name" :src="m.avatar" size="sm" :status="m.online ? 'online' : 'offline'" />
                  </template>
                  <template #title>{{ m.name }}</template>
                  <template #description>{{ m.department }} · {{ m.role }}</template>
                  <template #suffix>
                    <Chip size="sm" :variant="m.status === 'active' ? 'primary' : 'outline'">
                      {{ m.status === 'active' ? '活跃' : m.status === 'pending' ? '待激活' : '停用' }}
                    </Chip>
                  </template>
                </ListItem>
              </List>

              <template #footer>
                <Button size="sm" variant="ghost" @click="go('/users')">
                  查看全部 <ChevronRight class="h-3 w-3" />
                </Button>
              </template>
            </Card>
          </div>
        </template>

        <!-- 最近订单 -->
        <template #orders>
          <div class="p-4">
            <Empty v-if="!recentOrders.length" title="暂无订单" description="当前筛选条件下没有数据">
              <template #extra>
                <Button size="sm" variant="outline" @click="go('/orders')">前往订单管理</Button>
              </template>
            </Empty>
            <div v-else class="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <Card v-for="o in recentOrders" :key="o.id" shadow="none" :animate="false" interactive="lift">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex min-w-0 flex-col">
                    <span class="truncate font-mono text-xs font-bold">{{ o.no }}</span>
                    <span class="truncate text-[11px] text-muted-foreground">{{ o.customer }} · {{ o.createdAt }}</span>
                  </div>
                  <Chip size="sm" :variant="o.status === 'paid' ? 'primary' : o.status === 'refunded' ? 'secondary' : 'outline'">
                    {{ statusText[o.status] }}
                  </Chip>
                </div>
                <Divider class="!my-2" />
                <div class="flex items-center justify-between">
                  <Statistic :value="o.amount" prefix="¥" :precision="0" size="sm" :animate="false" />
                  <div class="flex items-center gap-1.5">
                    <Badge variant="outline" size="sm">{{ o.channel }}</Badge>
                    <Button size="sm" variant="ghost" @click="go(`/detail/${o.id}`)">详情</Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </template>

        <!-- 团队动态 -->
        <template #team>
          <div class="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
            <Card shadow="none" :animate="false">
              <template #header>
                <div class="flex items-center gap-2">
                  <Activity class="h-3.5 w-3.5" />
                  <span class="text-xs font-extrabold">构建流水线</span>
                </div>
              </template>
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

            <Card shadow="none" :animate="false">
              <template #header>
                <span class="text-xs font-extrabold">在售商品示例</span>
                <Chip size="sm" variant="outline">TOP 4</Chip>
              </template>
              <div class="grid grid-cols-2 gap-3">
                <div v-for="p in topProducts" :key="p.id" class="overflow-hidden rounded-base border border-border">
                  <Image :src="p.cover" :alt="p.name" fit="cover" rounded="base" width="100%" :height="96" />
                  <div class="p-2">
                    <div class="truncate text-xs font-bold">{{ p.name }}</div>
                    <div class="mt-1 flex items-center justify-between">
                      <span class="font-mono text-[11px] text-primary">¥{{ p.price }}</span>
                      <span class="text-[10px] text-muted-foreground">库存 {{ p.stock }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </template>

        <!-- 关于模板 -->
        <template #about>
          <div class="flex flex-col gap-3 p-4">
            <Title :level="4">这个模板是什么</Title>
            <Paragraph size="sm">
              一个基于 Vue 3 + TypeScript + Vite 6 + Tailwind CSS v4 的中后台布局示例，
              UI 全部来自 fuxsto-design。页面本身不绑定任何后端，数据集中在
              <Text code>src/mock/data.ts</Text>。
            </Paragraph>
            <Divider />
            <Title :level="4">近期改动</Title>
            <Timeline>
              <TimelineItem
                v-for="c in templateChangelog"
                :key="c.date"
                :title="c.date"
                :description="c.text"
                :timestamp="c.date"
                status="primary"
              />
            </Timeline>
          </div>
        </template>
      </TabViews>
    </Card>
  </div>
</template>
