<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Card,
  List,
  ListItem,
  Chip,
  ChipGroup,
  Tag,
  TagGroup,
  Segmented,
  Empty,
  PinInput,
  Input,
  Avatar,
  Badge,
  Button,
  Skeleton,
  ScrollArea,
  Divider,
  Switch,
  Collapse,
  CollapseItem,
  Text,
  Message,
} from 'fuxsto-design'
import { Plus, Search, Mail, Sparkles, Inbox, Star, CheckCircle2, Circle, Lock } from 'lucide-vue-next'
import { messageList, faqList, type MsgTag } from '@/mock/data'

type FilterKey = 'all' | 'unread' | 'starred' | 'done'

const segKey = ref<FilterKey>('all')
const segOptions = [
  { label: '全部', value: 'all' },
  { label: '未读', value: 'unread' },
  { label: '已加星', value: 'starred' },
  { label: '已完成', value: 'done' },
]

const keyword = ref('')

const messages = ref(messageList.map((m) => ({ ...m })))

const activeTags = ref<string[]>(['work'])
const tagOptions = [
  { label: '工作', value: 'work' },
  { label: '通知', value: 'notice' },
  { label: '告警', value: 'alert' },
]

const tagText: Record<MsgTag, string> = { work: '工作', notice: '通知', alert: '告警' }

const filtered = computed(() =>
  messages.value.filter((m) => {
    if (segKey.value === 'unread' && m.done) return false
    if (segKey.value === 'starred' && !m.starred) return false
    if (segKey.value === 'done' && !m.done) return false
    if (activeTags.value.length && !activeTags.value.includes(m.tag)) return false
    if (keyword.value) {
      const k = keyword.value.trim().toLowerCase()
      if (!m.title.toLowerCase().includes(k) && !m.body.toLowerCase().includes(k)) return false
    }
    return true
  }),
)

const unreadCount = computed(() => messages.value.filter((m) => !m.done).length)
const starredCount = computed(() => messages.value.filter((m) => m.starred).length)
const doneCount = computed(() => messages.value.filter((m) => m.done).length)

/* ---------------------------------------------------------------- PIN */

const pinValue = ref('')
const pinDone = ref(false)

// PinInput 在填满时抛的是 complete，不是 finish
function onPinComplete(value: string) {
  pinDone.value = value.length === 6
  if (pinDone.value) Message.success('PIN 已设置（演示）')
}

/* ------------------------------------------------------------ 折叠面板 */

const collapseActive = ref<Array<string | number>>(['faq-1'])

/* ---------------------------------------------------------------- 加载 */

const loading = ref(false)
function reload() {
  loading.value = true
  setTimeout(() => (loading.value = false), 600)
}

/* -------------------------------------------------------------- 长列表 */

const longList = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  title: `滚动项 ${i + 1}`,
  meta: `第 ${i + 1} 行 · 由 ScrollArea 提供自定义滚动条`,
}))
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- 筛选 -->
    <Card shadow="sm" :animate="false">
      <div class="flex flex-col gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <Input
            v-model="keyword"
            size="sm"
            class="w-full sm:w-64"
            placeholder="搜索消息 / 任务"
            :prefix-icon="Search"
            clearable
          />
          <Button size="sm" variant="ghost" :icon="Plus" @click="Message.info('新建任务（演示）')">新建任务</Button>
        </div>

        <Segmented v-model="segKey" :options="segOptions" size="sm" block />

        <div class="flex flex-wrap items-center gap-2">
          <Text type="secondary" size="sm">按标签筛选：</Text>
          <!-- ChipGroup 没有 options 属性，需要把 Chip 放进默认插槽，并用 value 标记取值 -->
          <ChipGroup v-model="activeTags" multiple size="sm">
            <Chip v-for="t in tagOptions" :key="t.value" :value="t.value" selectable size="sm">
              {{ t.label }}
            </Chip>
          </ChipGroup>
        </div>
      </div>
    </Card>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <!-- 主列表 -->
      <Card shadow="sm" :animate="false" class="lg:col-span-2" padding="none">
        <template #header>
          <div class="flex items-center gap-2">
            <Inbox class="h-3.5 w-3.5 text-primary" />
            <span class="text-xs font-extrabold">收件箱</span>
            <Chip size="sm" variant="outline">{{ filtered.length }}</Chip>
          </div>
          <Button size="sm" variant="ghost" @click="reload">刷新</Button>
        </template>

        <div class="px-2 pb-2">
          <Skeleton v-if="loading" :rows="4" />
          <template v-else>
            <List size="sm" hover split>
              <ListItem v-for="m in filtered" :key="m.id">
                <template #prefix>
                  <button
                    class="text-muted-foreground transition-colors hover:text-foreground"
                    :aria-label="m.done ? '标记为未完成' : '标记为已完成'"
                    @click="m.done = !m.done"
                  >
                    <CheckCircle2 v-if="m.done" class="h-4 w-4 text-primary" />
                    <Circle v-else class="h-4 w-4" />
                  </button>
                </template>
                <template #title>
                  <span :class="m.done && 'line-through'">{{ m.title }}</span>
                </template>
                <template #description>{{ m.body }}</template>
                <template #suffix>
                  <div class="flex items-center gap-1.5">
                    <Chip size="sm" :variant="m.tag === 'alert' ? 'secondary' : 'outline'">
                      {{ tagText[m.tag] }}
                    </Chip>
                    <span class="hidden text-[10px] text-muted-foreground sm:inline">{{ m.time }}</span>
                    <button
                      class="text-muted-foreground transition-colors hover:text-warning"
                      :class="m.starred && 'text-warning'"
                      :aria-label="m.starred ? '取消星标' : '加星标'"
                      @click="m.starred = !m.starred"
                    >
                      <Star class="h-3.5 w-3.5" :class="m.starred && 'fill-warning'" />
                    </button>
                  </div>
                </template>
              </ListItem>
            </List>

            <Empty v-if="!filtered.length" title="暂无消息" description="试着调整筛选条件">
              <template #extra>
                <Button
                  size="sm"
                  variant="outline"
                  @click="(keyword = ''), (segKey = 'all'), (activeTags = ['work', 'notice', 'alert'])"
                >
                  清除筛选
                </Button>
              </template>
            </Empty>
          </template>
        </div>
      </Card>

      <!-- 侧栏 -->
      <div class="flex flex-col gap-4">
        <Card shadow="sm" :animate="false">
          <template #header>
            <div class="flex items-center gap-2">
              <Mail class="h-3.5 w-3.5 text-primary" />
              <span class="text-xs font-extrabold">统计</span>
            </div>
          </template>
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <Text type="secondary" size="sm">未读消息</Text>
              <Badge :value="String(unreadCount)" variant="destructive" />
            </div>
            <div class="flex items-center justify-between">
              <Text type="secondary" size="sm">已加星</Text>
              <Badge :value="String(starredCount)" variant="secondary" />
            </div>
            <div class="flex items-center justify-between">
              <Text type="secondary" size="sm">已完成</Text>
              <Badge :value="String(doneCount)" variant="primary" />
            </div>
          </div>

          <Divider class="!my-3" />

          <Collapse v-model="collapseActive">
            <CollapseItem v-for="c in faqList" :key="c.name" :name="c.name" :title="c.title">
              <Text size="sm">{{ c.body }}</Text>
            </CollapseItem>
          </Collapse>
        </Card>

        <Card shadow="sm" :animate="false">
          <template #header>
            <div class="flex items-center gap-2">
              <Sparkles class="h-3.5 w-3.5 text-primary" />
              <span class="text-xs font-extrabold">标签别名（Tag / TagGroup）</span>
            </div>
          </template>
          <div class="flex flex-col gap-2">
            <Text type="secondary" size="sm">Tag 与 TagGroup 是 Chip / ChipGroup 的别名导出，属性完全一致。</Text>
            <TagGroup multiple size="sm">
              <Tag v-for="t in tagOptions" :key="t.value" :value="t.value" selectable size="sm">
                {{ t.label }}
              </Tag>
            </TagGroup>
          </div>
        </Card>

        <Card shadow="sm" :animate="false">
          <template #header>
            <div class="flex items-center gap-2">
              <Lock class="h-3.5 w-3.5 text-primary" />
              <span class="text-xs font-extrabold">设置 PIN 码</span>
            </div>
            <Switch :model-value="true" size="sm" disabled />
          </template>
          <div class="flex flex-col items-center gap-2">
            <Text type="secondary" size="sm" class="text-center">输入 6 位数字作为演示用的 PIN</Text>
            <PinInput v-model="pinValue" :length="6" mask @complete="onPinComplete" />
            <Text v-if="pinDone" type="success" size="sm">已设置</Text>
          </div>
        </Card>

        <Card shadow="sm" :animate="false">
          <template #header>
            <div class="flex items-center gap-2">
              <Sparkles class="h-3.5 w-3.5 text-primary" />
              <span class="text-xs font-extrabold">长列表</span>
            </div>
          </template>
          <ScrollArea max-height="240px" thumb-size="sm">
            <div class="flex flex-col">
              <div
                v-for="item in longList"
                :key="item.id"
                class="border-b border-border/40 px-3 py-2 text-xs last:border-0 hover:bg-muted/40"
              >
                <div class="font-bold">{{ item.title }}</div>
                <div class="text-[11px] text-muted-foreground">{{ item.meta }}</div>
              </div>
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  </div>
</template>
