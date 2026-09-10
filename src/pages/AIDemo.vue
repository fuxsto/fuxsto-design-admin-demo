<script setup lang="ts">
import { ref } from 'vue'
import {
  Card,
  StreamingText,
  Button,
  Input,
  Chip,
  Divider,
  Alert,
  Segmented,
  Switch,
  Slider,
  Progress,
  Avatar,
  Badge,
  Text,
  Message,
} from 'fuxsto-design'
import { Sparkles, Send, RefreshCcw } from 'lucide-vue-next'
import { aiPhrases } from '@/mock/data'

/**
 * StreamingText 的受控用法：
 * - texts  : 需要轮换的文本数组
 * - mode   : sequence 顺序 / random 随机
 * - currentIndex : 当前展示第几条（可用 v-model 思路手动控制）
 * - loading: 显示「思考中」的扫光状态
 */
const mode = ref<'sequence' | 'random'>('sequence')
const currentIndex = ref(0)
const loading = ref(false)
const speed = ref(1600)
const visible = ref(true)

const modeOptions = [
  { label: '顺序', value: 'sequence' },
  { label: '随机', value: 'random' },
]

const draft = ref('')
const sent = ref<string[]>([])

function onIndexChange(index: number) {
  currentIndex.value = index
}

function send() {
  const text = draft.value.trim()
  if (!text) {
    Message.warning('请输入内容')
    return
  }
  sent.value = [...sent.value, text]
  draft.value = ''
  loading.value = true
  setTimeout(() => (loading.value = false), 1500)
  Message.success('已提交（演示，不会产生真实请求）')
}

function restart() {
  currentIndex.value = 0
  Message.info('已回到第一条')
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <Alert
      type="info"
      title="StreamingText"
      description="按 texts + mode 自动轮换文本，宽度平滑过渡；currentIndex 可手动定位，loading 会显示扫光。"
    />

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <!-- 主演示 -->
      <Card shadow="sm" :animate="false" class="xl:col-span-2">
        <template #header>
          <div class="flex items-center gap-2">
            <Sparkles class="h-3.5 w-3.5 text-primary" />
            <span class="text-xs font-extrabold">流式文本</span>
            <Badge :value="String(currentIndex + 1)" variant="primary" size="sm" />
          </div>
          <Chip size="sm" variant="outline">{{ mode === 'sequence' ? '顺序' : '随机' }}</Chip>
        </template>

        <div class="min-h-[96px] rounded-base border border-border bg-muted/30 p-4">
          <StreamingText
            :texts="aiPhrases"
            :mode="mode"
            :current-index="currentIndex"
            :interval="speed"
            :loading="loading"
            :visible="visible"
            size="md"
            variant="primary"
            @change="onIndexChange"
          />
        </div>

        <Divider class="!my-4" />

        <div class="flex flex-col gap-3">
          <div class="flex flex-wrap items-center gap-2">
            <Text type="secondary" size="sm" class="w-16">模式</Text>
            <Segmented v-model="mode" :options="modeOptions" size="sm" />
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <Text type="secondary" size="sm" class="w-16">位置</Text>
            <Button size="sm" variant="outline" @click="currentIndex = Math.max(0, currentIndex - 1)">上一条</Button>
            <Button size="sm" variant="outline" @click="currentIndex = (currentIndex + 1) % aiPhrases.length">
              下一条
            </Button>
            <Button size="sm" variant="ghost" :icon="RefreshCcw" @click="restart">重置</Button>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <Text type="secondary" size="sm" class="w-16">间隔</Text>
            <div class="w-full max-w-xs">
              <Slider v-model="speed" :min="600" :max="4000" :step="200" show-tooltip />
            </div>
            <Text type="secondary" size="sm">{{ speed }} ms</Text>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2">
              <Switch v-model="loading" size="sm" />
              <Text size="sm">loading 扫光</Text>
            </div>
            <div class="flex items-center gap-2">
              <Switch v-model="visible" size="sm" />
              <Text size="sm">可见</Text>
            </div>
          </div>
        </div>
      </Card>

      <!-- 侧栏：模拟对话 -->
      <Card shadow="sm" :animate="false">
        <template #header>
          <div class="flex items-center gap-2">
            <Avatar name="AI" size="sm" status="online" />
            <span class="text-xs font-extrabold">示例对话</span>
          </div>
          <Chip size="sm" variant="outline">{{ sent.length }} 条</Chip>
        </template>

        <div class="flex min-h-[180px] flex-col gap-2">
          <div v-if="!sent.length" class="m-auto">
            <Text type="secondary" size="sm">还没有消息，试着发一条。</Text>
          </div>
          <div v-for="(s, i) in sent" :key="i" class="rounded-base bg-muted p-2 text-xs">
            <div class="mb-1 flex items-center gap-1.5">
              <Avatar name="我" size="sm" />
              <b>我</b>
            </div>
            {{ s }}
          </div>
          <div v-if="loading" class="rounded-base bg-primary/5 p-2">
            <StreamingText :texts="aiPhrases" mode="sequence" :interval="900" loading size="sm" variant="muted" />
          </div>
        </div>

        <Divider class="!my-3" />

        <div class="flex flex-col gap-2">
          <Input v-model="draft" size="sm" placeholder="输入内容" clearable @keyup.enter="send" />
          <Progress :percentage="Math.min(100, sent.length * 20)" :show-text="false" size="sm" />
          <Button size="sm" variant="primary" :icon="Send" @click="send">发送</Button>
        </div>
      </Card>
    </div>
  </div>
</template>
