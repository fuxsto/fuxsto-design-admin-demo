<script setup lang="ts">
import { ref, h } from 'vue'
import {
  Card,
  Button,
  Drawer,
  Dialog,
  Tooltip,
  Popconfirm,
  Message,
  Notification,
  Alert,
  Result,
  Skeleton,
  Loading,
  Empty,
  Tour,
  Watermark,
  startTour,
  resetTour,
  removeMessage,
  removeNotification,
  closeAllNotifications,
  Divider,
  Chip,
  Tabs,
  TabViews,
  Text,
  type TourStep,
  type NotificationPlacement,
} from 'fuxsto-design'
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Bell,
  Play,
  ServerCrash,
} from 'lucide-vue-next'

const drawerOpen = ref(false)

/* ---------------------------------------------------------------- Tour */

const tourOpen = ref(false)
const steps: TourStep[] = [
  { target: '#fb-btn-1', title: '主要操作', description: '打开最常用的反馈弹层。', placement: 'bottom' },
  { target: '#fb-btn-2', title: '消息提示', description: '弹出全局 Message。', placement: 'bottom' },
  { target: '#fb-btn-3', title: '二次确认', description: 'Popconfirm 就地确认危险操作。', placement: 'left' },
]

function onFinishTour() {
  Message.success('引导完成')
  tourOpen.value = false
}
function onSkipTour() {
  Message.info('已跳过')
  tourOpen.value = false
}
function startFuncTour() {
  startTour({ steps, onFinish: onFinishTour, onSkip: onSkipTour })
}

/* ------------------------------------------------------------- Dialog */

// onConfirm 的返回值必须是 boolean | void | Promise，不能直接返回 Message 的 id
function confirmSubmit() {
  Dialog.confirm({
    title: '确认提交？',
    description: '提交后将进入审核流程。',
    onConfirm: () => {
      Message.success('已提交')
    },
  })
}

function confirmDelete() {
  Dialog.confirm({
    title: '删除这条数据？',
    description: '删除后不可恢复。',
    danger: true,
    onConfirm: () => {
      Message.success('已删除')
    },
  })
}

function confirmAsync() {
  Dialog.confirm({
    title: '异步操作',
    description: '点确认后模拟一个 1.2s 的请求。',
    onConfirm: () =>
      new Promise<boolean>((resolve) => {
        setTimeout(() => {
          Message.success('完成')
          resolve(true)
        }, 1200)
      }),
  })
}

/* ------------------------------------------------------------- Loading */

const loadingState = ref(false)
function startLoading() {
  loadingState.value = true
  setTimeout(() => (loadingState.value = false), 2000)
}

const exportLoading = ref(false)
function exportReport() {
  exportLoading.value = true
  setTimeout(() => {
    exportLoading.value = false
    Notification.success({ title: '导出完成', message: '示例报表已生成' })
  }, 1800)
}

/* ------------------------------------------------------- 长任务通知 */

const longTaskHandle = ref<{ close: () => void; setLoading: (v: boolean) => void } | null>(null)
function startLongTask() {
  longTaskHandle.value?.close()
  longTaskHandle.value = Notification({
    title: '正在导出示例报表',
    message: '可以继续进行其它操作',
    duration: 0,
  })
  longTaskHandle.value.setLoading(true)
  setTimeout(() => {
    longTaskHandle.value?.setLoading(false)
    longTaskHandle.value?.close()
    longTaskHandle.value = null
    Notification.success({ title: '导出完成', message: '示例报表已生成' })
  }, 2200)
}

/* --------------------------------------------------- 命令式移除 API */

// removeMessage / removeNotification / closeAllNotifications 的单独调用演示
const lastMsgId = ref<string | null>(null)
function showRemovableMessage() {
  lastMsgId.value = Message.info('这是一条可手动移除的消息')
}
function removeLastMessage() {
  if (lastMsgId.value) {
    removeMessage(lastMsgId.value)
    lastMsgId.value = null
  }
}

const lastNotifId = ref<string | null>(null)
const lastNotifPlacement = ref<NotificationPlacement>('top-right')
function showRemovableNotification() {
  const n = Notification({ title: '可移除通知', message: '点下方按钮可单独移除它', placement: 'top-right' })
  lastNotifId.value = n.id ?? null
  lastNotifPlacement.value = 'top-right'
}
function removeLastNotification() {
  if (lastNotifId.value) {
    removeNotification(lastNotifId.value, lastNotifPlacement.value)
    lastNotifId.value = null
  }
}

function resetAndStartTour() {
  resetTour()
  startTour({ steps, onFinish: onFinishTour, onSkip: onSkipTour })
}

/* ---------------------------------------------------------------- Tabs */

const tab = ref('demo')
const tabOptions = [
  { value: 'demo', label: '基础演示' },
  { value: 'state', label: '空 / 加载 / 结果' },
  { value: 'guide', label: '引导与提示' },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <Alert
      type="info"
      title="反馈组件演示"
      description="覆盖 Dialog / Drawer / Tooltip / Popconfirm / Message / Notification / Tour / Watermark / Result / Skeleton / Loading / Empty。"
    />

    <Card shadow="sm" :animate="false" padding="none">
      <div class="overflow-x-auto px-3 pt-3">
        <Tabs v-model="tab" :options="tabOptions" variant="pill" size="sm" />
      </div>
      <Divider class="!my-0" />
      <TabViews v-model="tab" :options="tabOptions">
        <!-- 基础演示 -->
        <template #demo>
          <div class="flex flex-col gap-5 p-4">
            <div class="flex flex-col gap-2">
              <Text strong size="sm">Message 轻提示</Text>
              <div class="flex flex-wrap items-center gap-2">
                <Button id="fb-btn-1" size="sm" variant="outline" :icon="Info" @click="Message.info('这是一条 info 提示')">
                  info
                </Button>
                <Button size="sm" variant="outline" :icon="CheckCircle2" @click="Message.success('操作成功')">
                  success
                </Button>
                <Button size="sm" variant="outline" :icon="AlertTriangle" @click="Message.warning('请注意余额')">
                  warning
                </Button>
                <Button size="sm" variant="outline" danger :icon="XCircle" @click="Message.error('出错了，请重试')">
                  error
                </Button>
                <Button size="sm" variant="ghost" :icon="Loader2" :loading="exportLoading" @click="exportReport">
                  loading 流转
                </Button>
                <Button size="sm" variant="ghost" :icon="ServerCrash" @click="startLongTask">长任务通知</Button>
              </div>
            </div>

            <Divider />

            <div class="flex flex-col gap-2">
              <Text strong size="sm">Dialog 对话框</Text>
              <div class="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" @click="confirmSubmit">基础确认</Button>
                <Button size="sm" variant="outline" danger @click="confirmDelete">危险确认</Button>
                <Button size="sm" variant="outline" @click="confirmAsync">异步 loading</Button>
                <Button size="sm" variant="outline" @click="Dialog.warning({ title: '警告', description: '这是一个 warning 对话框。' })">
                  warning
                </Button>
                <Button size="sm" variant="outline" @click="Dialog.success({ title: '成功', description: '这是一个 success 对话框。' })">
                  success
                </Button>
              </div>
            </div>

            <Divider />

            <div class="flex flex-col gap-2">
              <Text strong size="sm">Drawer 抽屉</Text>
              <div class="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" @click="drawerOpen = true">右侧抽屉</Button>
                <Button size="sm" variant="outline" @click="Message.info('抽屉已由上面的按钮打开')">查看说明</Button>
              </div>
            </div>

            <Divider />

            <div class="flex flex-col gap-2">
              <Text strong size="sm">Tooltip &amp; Popconfirm</Text>
              <div class="flex flex-wrap items-center gap-3">
                <Tooltip content="这是 hover 时显示的解释">
                  <Button size="sm" variant="outline">hover 看 tooltip</Button>
                </Tooltip>
                <Tooltip content="顶部 tooltip" placement="top">
                  <Button size="sm" variant="ghost">top</Button>
                </Tooltip>
                <Tooltip content="右侧 tooltip" placement="right">
                  <Button size="sm" variant="ghost">right</Button>
                </Tooltip>
                <Popconfirm id="fb-btn-3" title="确定删除吗？" description="此操作不可恢复" danger @confirm="Message.success('已删除')">
                  <Button id="fb-btn-2" size="sm" variant="outline" danger>悬停看 Popconfirm</Button>
                </Popconfirm>
              </div>
            </div>

            <Divider />

            <div class="flex flex-col gap-2">
              <Text strong size="sm">Notification 通知</Text>
              <div class="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" :icon="Bell" @click="Notification.info({ title: '新消息', message: '你有一条系统通知' })">
                  info
                </Button>
                <Button size="sm" variant="outline" :icon="CheckCircle2" @click="Notification.success({ title: '操作成功', message: '任务已加入队列' })">
                  success
                </Button>
                <Button size="sm" variant="outline" :icon="AlertTriangle" @click="Notification.warning({ title: '服务降级', message: '部分接口响应变慢' })">
                  warning
                </Button>
                <Button size="sm" variant="outline" :icon="XCircle" @click="Notification.error({ title: '连接失败', message: '无法连接服务' })">
                  error
                </Button>
                <Button size="sm" variant="ghost" @click="closeAllNotifications">closeAll</Button>
                <Button
                  size="sm"
                  variant="ghost"
                  @click="Notification({
                    duration: 6000,
                    vnode: h('div', { class: 'flex flex-col gap-1' }, [
                      h('div', { class: 'text-sm font-bold' }, '已删除 1 项'),
                      h('div', { class: 'text-xs text-muted-foreground' }, '示例提示：30 天内可恢复。'),
                      h('button', {
                        class: 'self-start text-xs font-bold text-primary hover:underline',
                        onClick: () => Message.success('已恢复'),
                      }, '撤销'),
                    ]),
                  })"
                >
                  带操作
                </Button>
              </div>
            </div>

            <Card shadow="none" :animate="false">
              <template #header><span class="text-xs font-extrabold">命令式移除 API</span></template>
              <div class="flex flex-col gap-2">
                <Text type="secondary" size="sm">演示 removeMessage / removeNotification / closeAllNotifications 的单独调用。</Text>
                <div class="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="outline" @click="showRemovableMessage">打开可移除消息</Button>
                  <Button size="sm" variant="outline" @click="removeLastMessage">移除该消息</Button>
                  <Button size="sm" variant="outline" @click="showRemovableNotification">打开可移除通知</Button>
                  <Button size="sm" variant="outline" @click="removeLastNotification">移除该通知</Button>
                </div>
              </div>
            </Card>

          </div>
        </template>

        <!-- 空 / 加载 / 结果 -->
        <template #state>
          <div class="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
            <Card shadow="none" :animate="false">
              <template #header><span class="text-xs font-extrabold">Loading 加载</span></template>
              <div class="flex flex-col gap-3">
                <Loading :loading="loadingState" tip="正在同步数据…">
                  <div class="min-h-[100px] rounded-base border border-border p-4">
                    <Text size="sm">内容区被 Loading 包裹，loading 期间不可交互。</Text>
                  </div>
                </Loading>
                <Button size="sm" variant="primary" :loading="loadingState" @click="startLoading">触发 Loading 2s</Button>
              </div>
            </Card>

            <Card shadow="none" :animate="false">
              <template #header><span class="text-xs font-extrabold">Skeleton 骨架屏</span></template>
              <Skeleton :rows="4" avatar title />
            </Card>

            <Card shadow="none" :animate="false">
              <template #header><span class="text-xs font-extrabold">Empty 空状态</span></template>
              <Empty title="没有数据" description="试着调整筛选条件">
                <template #extra>
                  <Button size="sm" variant="primary" @click="Message.info('新建（演示）')">新建</Button>
                </template>
              </Empty>
            </Card>

            <Card shadow="none" :animate="false">
              <template #header><span class="text-xs font-extrabold">Result 结果页</span></template>
              <div class="flex flex-col gap-3">
                <Result status="success" title="提交成功" description="我们已收到你的提交">
                  <template #extra>
                    <Button size="sm" variant="primary" @click="Message.info('返回（演示）')">返回</Button>
                  </template>
                </Result>
                <Divider />
                <Result status="warning" title="权限不足" description="请联系管理员" />
                <Divider />
                <Result status="error" title="出错了" description="请稍后重试">
                  <template #extra>
                    <Button size="sm" variant="ghost" @click="Message.info('已重试（演示）')">重试</Button>
                  </template>
                </Result>
              </div>
            </Card>
          </div>
        </template>

        <!-- 引导与提示 -->
        <template #guide>
          <div class="flex flex-col gap-4 p-4">
            <Card shadow="none" :animate="false">
              <template #header><span class="text-xs font-extrabold">Tour 新手引导</span></template>
              <Text type="secondary" size="sm">函数式调用适合「点一下开始巡礼」，声明式适合受控场景。</Text>
              <div class="mt-3 flex flex-wrap items-center gap-2">
                <Button size="sm" variant="primary" :icon="Play" @click="startFuncTour">函数式启动</Button>
                <Button size="sm" variant="outline" :icon="Play" @click="tourOpen = true">声明式启动</Button>
                <Button size="sm" variant="ghost" :icon="Play" @click="resetAndStartTour">重置并重启引导</Button>
                <Chip size="sm" variant="outline">3 步</Chip>
              </div>
            </Card>

            <Card shadow="none" :animate="false">
              <template #header><span class="text-xs font-extrabold">Alert 提示条</span></template>
              <div class="flex flex-col gap-2">
                <Alert type="info" title="info" description="普通信息提示" />
                <Alert type="success" title="成功" description="操作已生效" closable />
                <Alert type="warning" title="警告" description="请尽快处理" />
                <Alert type="error" title="错误" description="系统繁忙，请稍后再试" banner />
              </div>
            </Card>

            <Card shadow="none" :animate="false">
              <template #header><span class="text-xs font-extrabold">Watermark 水印</span></template>
              <Watermark text="示例水印" :rotate="-20" :opacity="0.1">
                <div class="flex min-h-[120px] items-center justify-center rounded-base border border-border bg-muted/30 p-5">
                  <Text type="secondary" size="sm">这块内容被水印覆盖</Text>
                </div>
              </Watermark>
            </Card>
          </div>
        </template>
      </TabViews>
    </Card>

    <!-- 声明式 Tour -->
    <Tour v-model:open="tourOpen" :steps="steps" @finish="onFinishTour" @skip="onSkipTour" />

    <Drawer v-model:open="drawerOpen" title="编辑面板" description="抽屉适合放比对话框更多的内容" placement="right" size="md">
      <div class="flex flex-col gap-3">
        <Alert type="info" title="这是抽屉里的提示" description="抽屉保留了页面上下文，适合做编辑面板与详情预览。" />
        <div class="flex flex-wrap items-center gap-2">
          <Button variant="ghost" @click="drawerOpen = false">取消</Button>
          <Button variant="primary" @click="drawerOpen = false; Message.success('已保存（演示）')">保存</Button>
        </div>
      </div>
    </Drawer>
  </div>
</template>
