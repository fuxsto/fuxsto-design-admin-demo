<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Card,
  Header,
  Tabs,
  TabViews,
  Timeline,
  TimelineItem,
  List,
  ListItem,
  Image,
  Carousel,
  Statistic,
  Collapse,
  CollapseItem,
  Chip,
  Badge,
  Divider,
  Button,
  Avatar,
  Title,
  Text,
  Paragraph,
  Link,
  Message,
} from 'fuxsto-design'
import { ArrowLeft, Package, Truck, CreditCard } from 'lucide-vue-next'
import { orderList, productList, orderTimeline } from '@/mock/data'

const route = useRoute()
const router = useRouter()

const id = computed(() => Number(route.params.id ?? 1))

const order = computed(() => orderList.find((o) => o.id === id.value) ?? orderList[0])
const product = computed(() => productList.find((p) => p.id === id.value) ?? productList[0])

const tab = ref('basic')
const tabOptions = [
  { value: 'basic', label: '基本信息' },
  { value: 'flow', label: '流转记录' },
  { value: 'spec', label: '规格参数' },
]

const gallery = computed(() => [
  product.value.cover,
  productList[(id.value + 1) % productList.length].cover,
  productList[(id.value + 2) % productList.length].cover,
])

const related = computed(() => orderList.filter((o) => o.id !== id.value).slice(0, 4))

const statusText: Record<string, string> = {
  paid: '已付款',
  pending: '待付款',
  refunded: '已退款',
  shipping: '配送中',
}

const collapseActive = ref<Array<string | number>>(['spec-1'])
</script>

<template>
  <div class="flex flex-col gap-4">
    <Card shadow="sm" :animate="false" padding="none">
      <Header
        :title="`订单 ${order.no}`"
        :description="`${order.customer} · ${order.createdAt}`"
        backable
        size="sm"
        bordered
        @back="router.push('/orders')"
      >
        <div class="flex flex-wrap items-center gap-2">
          <Chip size="sm" :variant="order.status === 'paid' ? 'primary' : 'outline'">
            {{ statusText[order.status] }}
          </Chip>
          <Button size="sm" variant="outline" :icon="ArrowLeft" @click="router.push('/orders')">返回列表</Button>
        </div>
      </Header>

      <div class="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3">
        <!--
          图片区：每页用普通 div 承接 Carousel 透传的尺寸，
          Image 尺寸走 width/height props（其根为 Fragment，class 无法穿透）。
        -->
        <div class="lg:col-span-1">
          <Carousel :dots="true" :arrows="true" :autoplay="false" height="200px" rounded="base">
            <div class="h-full w-full">
              <Image :src="gallery[0]" :alt="product.name" fit="cover" preview rounded="base" width="100%" height="100%" />
            </div>
            <div class="h-full w-full">
              <Image :src="gallery[1]" :alt="product.name" fit="cover" preview rounded="base" width="100%" height="100%" />
            </div>
            <div class="h-full w-full">
              <Image :src="gallery[2]" :alt="product.name" fit="cover" preview rounded="base" width="100%" height="100%" />
            </div>
          </Carousel>
        </div>

        <!-- 摘要 -->
        <div class="flex flex-col gap-3 lg:col-span-2">
          <div>
            <Title :level="3">{{ product.name }}</Title>
            <Paragraph secondary size="sm">{{ product.category }} · 库存 {{ product.stock }} 件</Paragraph>
          </div>

          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Card shadow="none" :animate="false" padding="sm">
              <Statistic title="订单金额" :value="order.amount" prefix="¥" :precision="0" size="sm" :animate="false" />
            </Card>
            <Card shadow="none" :animate="false" padding="sm">
              <Statistic title="商品件数" :value="order.items" suffix=" 件" size="sm" :animate="false" />
            </Card>
            <Card shadow="none" :animate="false" padding="sm">
              <Statistic title="客户评分" :value="product.rating" :precision="1" suffix=" / 5" size="sm" :animate="false" />
            </Card>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <Badge size="sm" variant="outline">{{ order.channel }}</Badge>
            <Badge size="sm" variant="secondary">示例数据</Badge>
            <Link href="#/orders" size="sm">查看全部订单 →</Link>
          </div>
        </div>
      </div>
    </Card>

    <Card shadow="sm" :animate="false" padding="none">
      <div class="overflow-x-auto px-3 pt-3">
        <Tabs v-model="tab" :options="tabOptions" variant="pill" size="sm" />
      </div>
      <Divider class="!my-0" />
      <TabViews v-model="tab" :options="tabOptions">
        <!-- 基本信息 -->
        <template #basic>
          <div class="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
            <Card shadow="none" :animate="false">
              <template #header>
                <div class="flex items-center gap-2">
                  <Package class="h-3.5 w-3.5 text-primary" />
                  <span class="text-xs font-extrabold">订单信息</span>
                </div>
              </template>
              <div class="flex flex-col gap-2 text-xs">
                <div class="flex justify-between gap-2">
                  <Text type="secondary">订单号</Text>
                  <b class="font-mono">{{ order.no }}</b>
                </div>
                <div class="flex justify-between gap-2">
                  <Text type="secondary">客户</Text>
                  <b>{{ order.customer }}</b>
                </div>
                <div class="flex justify-between gap-2">
                  <Text type="secondary">下单时间</Text>
                  <b>{{ order.createdAt }}</b>
                </div>
                <div class="flex justify-between gap-2">
                  <Text type="secondary">支付渠道</Text>
                  <b>示例支付</b>
                </div>
              </div>
            </Card>

            <Card shadow="none" :animate="false">
              <template #header>
                <div class="flex items-center gap-2">
                  <CreditCard class="h-3.5 w-3.5 text-primary" />
                  <span class="text-xs font-extrabold">关联记录</span>
                </div>
              </template>
              <List size="sm" hover split>
                <ListItem v-for="r in related" :key="r.id">
                  <template #prefix>
                    <Avatar :name="r.customer" size="sm" />
                  </template>
                  <template #title>{{ r.no }}</template>
                  <template #description>{{ r.customer }} · {{ r.createdAt }}</template>
                  <template #suffix>
                    <Chip size="sm" variant="outline">{{ statusText[r.status] }}</Chip>
                  </template>
                </ListItem>
              </List>
            </Card>
          </div>
        </template>

        <!-- 流转记录 -->
        <template #flow>
          <div class="p-4">
            <Card shadow="none" :animate="false">
              <template #header>
                <div class="flex items-center gap-2">
                  <Truck class="h-3.5 w-3.5 text-primary" />
                  <span class="text-xs font-extrabold">物流与状态流转</span>
                </div>
              </template>
              <Timeline>
                <TimelineItem
                  v-for="e in orderTimeline"
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

        <!-- 规格参数 -->
        <template #spec>
          <div class="p-4">
            <Collapse v-model="collapseActive">
              <CollapseItem name="spec-1" title="基础参数">
                <div class="flex flex-col gap-2 text-xs">
                  <div class="flex justify-between">
                    <Text type="secondary">商品编号</Text>
                    <b class="font-mono">SKU-{{ String(product.id).padStart(5, '0') }}</b>
                  </div>
                  <div class="flex justify-between">
                    <Text type="secondary">分类</Text>
                    <b>{{ product.category }}</b>
                  </div>
                  <div class="flex justify-between">
                    <Text type="secondary">售价</Text>
                    <b class="font-mono">¥{{ product.price }}</b>
                  </div>
                </div>
              </CollapseItem>
              <CollapseItem name="spec-2" title="库存与物流">
                <div class="flex flex-col gap-2 text-xs">
                  <div class="flex justify-between">
                    <Text type="secondary">可用库存</Text>
                    <b>{{ product.stock }} 件</b>
                  </div>
                  <div class="flex justify-between">
                    <Text type="secondary">发货仓</Text>
                    <b>示例仓库 A 区</b>
                  </div>
                </div>
              </CollapseItem>
              <CollapseItem name="spec-3" title="售后说明">
                <Text size="sm">本页所有信息均为示例数据，不代表任何真实商品或交易。</Text>
              </CollapseItem>
            </Collapse>
          </div>
        </template>
      </TabViews>
    </Card>

    <div class="flex flex-wrap items-center gap-2">
      <Button variant="ghost" @click="router.push('/orders')">返回</Button>
      <Button variant="primary" @click="Message.success('已加入示例工单（演示）')">创建工单</Button>
    </div>
  </div>
</template>
