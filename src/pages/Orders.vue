<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Card,
  Table,
  Pagination,
  Statistic,
  Input,
  Select,
  Button,
  Badge,
  Chip,
  Drawer,
  Segmented,
  Steps,
  Tooltip,
  Popconfirm,
  Empty,
  Divider,
  Text,
  Message,
  Dialog,
  type TableColumn,
  type StepsOption,
} from 'fuxsto-design'
import { Search, RefreshCcw, Eye, Truck, Ban, Download, Plus } from 'lucide-vue-next'
import { orderList, type OrderRow, type OrderStatus, type OrderChannel } from '@/mock/data'

const router = useRouter()

const keyword = ref('')
const status = ref('')
const channel = ref('')
const seg = ref<'all' | 'unfinished' | 'paid' | 'refund'>('all')
const loading = ref(false)

const current = ref(1)
const pageSize = ref(10)
const selected = ref<Array<string | number>>([])

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '已付款', value: 'paid' },
  { label: '待付款', value: 'pending' },
  { label: '已退款', value: 'refunded' },
  { label: '配送中', value: 'shipping' },
]

const channelOptions = [
  { label: '全部渠道', value: '' },
  { label: 'Web', value: 'web' },
  { label: 'App', value: 'app' },
  { label: '小程序', value: 'miniapp' },
  { label: 'H5', value: 'h5' },
]

const segOptions = [
  { label: '全部', value: 'all' },
  { label: '未完成', value: 'unfinished' },
  { label: '已付款', value: 'paid' },
  { label: '已退款', value: 'refund' },
]

const statusText: Record<OrderStatus, string> = {
  paid: '已付款',
  pending: '待付款',
  refunded: '已退款',
  shipping: '配送中',
}
const channelText: Record<OrderChannel, string> = {
  web: 'Web',
  app: 'App',
  miniapp: '小程序',
  h5: 'H5',
}

const filtered = computed(() =>
  orderList.filter((o) => {
    if (seg.value === 'unfinished' && (o.status === 'paid' || o.status === 'refunded')) return false
    if (seg.value === 'paid' && o.status !== 'paid') return false
    if (seg.value === 'refund' && o.status !== 'refunded') return false
    if (status.value && o.status !== status.value) return false
    if (channel.value && o.channel !== channel.value) return false
    if (keyword.value) {
      const k = keyword.value.trim().toLowerCase()
      if (!o.no.toLowerCase().includes(k) && !o.customer.toLowerCase().includes(k)) return false
    }
    return true
  }),
)

const paged = computed(() =>
  filtered.value.slice((current.value - 1) * pageSize.value, current.value * pageSize.value),
)

const summary = computed(() => {
  const list = filtered.value
  return {
    total: list.length,
    amount: list.reduce((s, o) => s + o.amount, 0),
    paid: list.filter((o) => o.status === 'paid').length,
    refund: list.filter((o) => o.status === 'refunded').length,
  }
})

const columns: TableColumn[] = [
  { key: 'no', title: '订单号', width: 150, sortable: true },
  { key: 'customer', title: '客户', width: 110 },
  { key: 'channel', title: '渠道', width: 100, align: 'center' },
  { key: 'amount', title: '金额', width: 130, align: 'right', sortable: (a: OrderRow, b: OrderRow) => a.amount - b.amount },
  { key: 'status', title: '状态', width: 110, align: 'center' },
  { key: 'createdAt', title: '创建时间', width: 150 },
  { key: 'action', title: '操作', width: 150, align: 'right' },
]

/* ------------------------------------------------------------ 抽屉详情 */

const drawerOpen = ref(false)
const currentOrder = ref<OrderRow | null>(null)

const flowSteps: StepsOption[] = [
  { title: '下单', description: '客户提交订单' },
  { title: '支付', description: '支付渠道确认' },
  { title: '拣货', description: '仓库备货' },
  { title: '发货', description: '物流揽收' },
  { title: '完成', description: '客户签收' },
]

/** 把订单状态映射到流程节点下标 */
const flowIndex: Record<OrderStatus, number> = {
  pending: 0,
  paid: 1,
  shipping: 3,
  refunded: 1,
}

function openDetail(o: OrderRow) {
  currentOrder.value = o
  drawerOpen.value = true
}

function ship(o: OrderRow) {
  Message.success(`订单 ${o.no} 已标记为发货（演示）`)
}

function refund(o: OrderRow) {
  Dialog.confirm({
    title: `确认退款 ${o.no}？`,
    description: `将退回 ¥${o.amount.toLocaleString()}（演示，不会产生真实资金变动）`,
    danger: true,
    onConfirm: () => {
      Message.success('已发起退款（演示）')
    },
  })
}

function gotoDetail(id: number) {
  router.push(`/detail/${id}`)
}

function reload() {
  loading.value = true
  setTimeout(() => (loading.value = false), 500)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- KPI -->
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Card shadow="sm" :animate="false">
        <Statistic title="订单总数" :value="summary.total" suffix=" 单" size="sm" :animate="false" />
      </Card>
      <Card shadow="sm" :animate="false">
        <Statistic title="订单金额" :value="summary.amount" prefix="¥" :precision="0" size="sm" :animate="false" />
      </Card>
      <Card shadow="sm" :animate="false">
        <Statistic title="已付款" :value="summary.paid" suffix=" 单" size="sm" :animate="false" />
      </Card>
      <Card shadow="sm" :animate="false">
        <Statistic title="已退款" :value="summary.refund" suffix=" 单" size="sm" :animate="false" />
      </Card>
    </div>

    <Card shadow="sm" :animate="false" padding="none">
      <div class="flex flex-col gap-3 p-3 sm:p-4">
        <div class="flex flex-wrap items-center gap-2">
          <Input
            v-model="keyword"
            size="sm"
            class="w-full sm:w-56"
            placeholder="搜索订单号 / 客户"
            :prefix-icon="Search"
            clearable
          />
          <Select v-model="status" :options="statusOptions" size="sm" class="w-full sm:w-32" />
          <Select v-model="channel" :options="channelOptions" size="sm" class="w-full sm:w-32" />
          <Button variant="ghost" size="sm" :icon="RefreshCcw" :loading="loading" @click="reload">刷新</Button>
          <div class="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" :icon="Download" @click="Message.info('已导出（演示）')">导出</Button>
            <Button variant="primary" size="sm" :icon="Plus" @click="Message.info('新建订单（演示）')">新建</Button>
          </div>
        </div>
        <Segmented v-model="seg" :options="segOptions" size="sm" block />
      </div>

      <div class="px-3 pb-2 sm:px-4">
        <div class="overflow-x-auto">
          <div class="min-w-[900px]">
            <Table
              v-model:selected-row-keys="selected"
              :columns="columns"
              :data="paged"
              row-key="id"
              size="sm"
              selectable
              :loading="loading"
              :animate="false"
            >
              <template #cell-no="{ row }">
                <span class="cursor-pointer font-mono font-bold hover:text-primary" @click="openDetail(row)">{{ row.no }}</span>
              </template>
              <template #cell-channel="{ row }">
                <Badge size="sm" variant="outline">{{ channelText[row.channel as OrderChannel] }}</Badge>
              </template>
              <template #cell-amount="{ row }">
                <span class="font-mono tabular-nums">¥{{ row.amount.toLocaleString() }}</span>
              </template>
              <template #cell-status="{ row }">
                <Chip size="sm" :variant="row.status === 'paid' ? 'primary' : row.status === 'refunded' ? 'secondary' : 'outline'">
                  {{ statusText[row.status as OrderStatus] }}
                </Chip>
              </template>
              <template #cell-action="{ row }">
                <div class="inline-flex items-center gap-1">
                  <Tooltip content="详情">
                    <Button size="sm" variant="ghost" :icon="Eye" :animate="false" @click.stop="gotoDetail(row.id)" />
                  </Tooltip>
                  <Tooltip content="标记发货">
                    <Button
                      size="sm"
                      variant="ghost"
                      :icon="Truck"
                      :animate="false"
                      :disabled="row.status !== 'paid'"
                      @click.stop="ship(row)"
                    />
                  </Tooltip>
                  <Popconfirm title="确认退款？" description="演示环境不会真的退款" danger @confirm="refund(row)">
                    <Button size="sm" variant="ghost" danger :icon="Ban" :animate="false" :disabled="row.status === 'refunded'" @click.stop />
                  </Popconfirm>
                </div>
              </template>
            </Table>
          </div>
        </div>

        <Empty v-if="!filtered.length" title="没有匹配的订单" description="试着调整筛选条件">
          <template #extra>
            <Button size="sm" variant="outline" @click="(keyword = ''), (status = ''), (channel = ''), (seg = 'all')">
              清除筛选
            </Button>
          </template>
        </Empty>
      </div>

      <div v-if="filtered.length" class="flex flex-col gap-3 border-t border-border px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <Text type="secondary" size="sm">共 {{ filtered.length }} 条 · 已选 {{ selected.length }} 条</Text>
        <div class="overflow-x-auto">
          <Pagination
            v-model:current="current"
            v-model:page-size="pageSize"
            :total="filtered.length"
            :page-sizes="[10, 20, 50]"
            size="sm"
            show-total
          />
        </div>
      </div>
    </Card>

    <!-- 抽屉详情：用 Steps 展示订单流转 -->
    <Drawer
      v-model:open="drawerOpen"
      :title="currentOrder?.no ?? '订单详情'"
      :description="currentOrder ? `${currentOrder.customer} · ${currentOrder.createdAt}` : ''"
      placement="right"
      size="md"
    >
      <template v-if="currentOrder">
        <Steps
          :options="flowSteps"
          :current="flowIndex[currentOrder.status as OrderStatus]"
          size="sm"
          direction="horizontal"
        />

        <Divider class="!my-4" />

        <div class="grid grid-cols-2 gap-3">
          <Card shadow="none" :animate="false" padding="sm">
            <Statistic title="金额" :value="currentOrder.amount" prefix="¥" :precision="0" size="sm" :animate="false" />
          </Card>
          <Card shadow="none" :animate="false" padding="sm">
            <Statistic title="商品件数" :value="currentOrder.items" suffix=" 件" size="sm" :animate="false" />
          </Card>
        </div>

        <Divider class="!my-4" />

        <div class="flex flex-col gap-2 text-xs">
          <div class="flex justify-between gap-2">
            <Text type="secondary">客户</Text>
            <b>{{ currentOrder.customer }}</b>
          </div>
          <div class="flex justify-between gap-2">
            <Text type="secondary">渠道</Text>
            <Badge size="sm" variant="outline">{{ channelText[currentOrder.channel as OrderChannel] }}</Badge>
          </div>
          <div class="flex justify-between gap-2">
            <Text type="secondary">状态</Text>
            <Chip size="sm" :variant="currentOrder.status === 'paid' ? 'primary' : 'outline'">
              {{ statusText[currentOrder.status as OrderStatus] }}
            </Chip>
          </div>
          <div class="flex justify-between gap-2">
            <Text type="secondary">下单时间</Text>
            <b>{{ currentOrder.createdAt }}</b>
          </div>
        </div>

        <Divider class="!my-4" />

        <div class="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" @click="Message.success('已通过审核（演示）')">审核通过</Button>
          <Button variant="outline" size="sm" :icon="Truck" :disabled="currentOrder.status !== 'paid'" @click="ship(currentOrder)">
            标记发货
          </Button>
        </div>
      </template>
    </Drawer>
  </div>
</template>
