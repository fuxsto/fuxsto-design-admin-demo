<script setup lang="ts">
import { ref } from 'vue'
import {
  Card,
  Form,
  FormItem,
  Switch,
  Select,
  Slider,
  ColorPicker,
  Segmented,
  RadioGroup,
  Radio,
  Anchor,
  Input,
  Divider,
  Button,
  Alert,
  Chip,
  Text,
  Message,
  Notification,
  type SegmentedOption,
} from 'fuxsto-design'
import { Save, RefreshCcw, Palette, Globe, ShieldCheck } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'

const { theme, toggle } = useThemeStore()

const lang = ref('zh-CN')
const density = ref('comfortable')
const fontSize = ref(14)
const accent = ref('#18181b')
const animations = ref(true)
const sidebarCollapsed = ref(false)
const login2fa = ref(true)
const sessionTimeout = ref(60)
const notifyInApp = ref(true)
const notifyMail = ref(true)
const notifySound = ref(false)

const themeOptions = [
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
]

const langOptions = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
  { label: '日本語', value: 'ja-JP' },
]

const densityOptions = [
  { label: '紧凑', value: 'compact' },
  { label: '默认', value: 'comfortable' },
  { label: '宽松', value: 'loose' },
]

const timezoneOptions = [
  { label: '(GMT+08:00) 上海', value: 'Asia/Shanghai' },
  { label: '(GMT+00:00) 伦敦', value: 'Europe/London' },
  { label: '(GMT-08:00) 洛杉矶', value: 'America/Los_Angeles' },
]

/* Anchor 的 items 需要 key / title / href 三个字段 */
const anchorItems = [
  { key: 'appearance', title: '外观', href: '#setting-appearance' },
  { key: 'locale', title: '区域与语言', href: '#setting-locale' },
  { key: 'security', title: '安全', href: '#setting-security' },
  { key: 'notification', title: '通知', href: '#setting-notification' },
  { key: 'advanced', title: '高级', href: '#setting-advanced' },
]

// Segmented 的 change 抛出的是整个 option 对象，不是 value
function onThemeChange(opt: SegmentedOption) {
  if (String(opt.value) !== theme.value) toggle()
}

function saveAll() {
  Notification.success({
    title: '设置已保存',
    message: '演示环境仅保存在内存与 localStorage 中。',
  })
}

function resetAll() {
  density.value = 'comfortable'
  fontSize.value = 14
  accent.value = '#18181b'
  animations.value = true
  Message.info('已恢复默认（演示）')
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
    <!-- 锚点导航：窄屏隐藏，宽屏吸顶 -->
    <div class="hidden lg:col-span-3 lg:block xl:col-span-2">
      <Card shadow="none" :animate="false" padding="sm" class="sticky top-20">
        <Anchor :items="anchorItems" size="sm" :offset-top="90" scroll-behavior="smooth" />
      </Card>
    </div>

    <div class="flex flex-col gap-4 lg:col-span-9 xl:col-span-10">
      <Alert
        type="info"
        title="偏好设置"
        description="以下设置只保存在浏览器本地，用于演示各表单组件，不会同步到任何服务器。"
      />

      <!-- 外观 -->
      <Card id="setting-appearance" shadow="sm" :animate="false">
        <template #header>
          <div class="flex items-center gap-2">
            <Palette class="h-3.5 w-3.5 text-primary" />
            <span class="text-xs font-extrabold">外观</span>
          </div>
        </template>
        <Form size="md" class="flex max-w-2xl flex-col gap-3">
          <FormItem label="主题">
            <Segmented :model-value="theme" :options="themeOptions" size="sm" @change="onThemeChange" />
            <template #extra>
              <Text type="secondary" size="sm">当前：{{ theme === 'dark' ? '深色' : '浅色' }}</Text>
            </template>
          </FormItem>

          <FormItem label="主色">
            <div class="flex flex-wrap items-center gap-2">
              <ColorPicker v-model="accent" :alpha="false" copyable />
              <code class="rounded-base bg-muted px-1.5 py-0.5 font-mono text-[11px]">{{ accent }}</code>
            </div>
          </FormItem>

          <FormItem label="密度">
            <Segmented v-model="density" :options="densityOptions" size="sm" />
          </FormItem>

          <FormItem label="字号">
            <div class="flex w-full max-w-md items-center gap-3">
              <Slider v-model="fontSize" :min="12" :max="18" :step="1" show-tooltip />
              <Text type="secondary" size="sm" class="w-12 text-right">{{ fontSize }}px</Text>
            </div>
          </FormItem>

          <FormItem label="界面动效">
            <div class="flex items-center gap-2">
              <Switch v-model="animations" />
              <Text type="secondary" size="sm">页面与弹层使用过渡动画</Text>
            </div>
          </FormItem>

          <FormItem label="侧边栏">
            <div class="flex items-center gap-2">
              <Switch v-model="sidebarCollapsed" />
              <Text type="secondary" size="sm">默认折叠（演示开关）</Text>
            </div>
          </FormItem>
        </Form>
      </Card>

      <!-- 区域与语言 -->
      <Card id="setting-locale" shadow="sm" :animate="false">
        <template #header>
          <div class="flex items-center gap-2">
            <Globe class="h-3.5 w-3.5 text-primary" />
            <span class="text-xs font-extrabold">区域与语言</span>
          </div>
        </template>
        <Form size="md" class="flex max-w-2xl flex-col gap-3">
          <FormItem label="语言">
            <Select v-model="lang" :options="langOptions" class="w-full sm:w-60" />
          </FormItem>
          <FormItem label="时区">
            <Select :model-value="'Asia/Shanghai'" :options="timezoneOptions" class="w-full sm:w-60" />
          </FormItem>
          <FormItem label="日期格式">
            <RadioGroup :model-value="'YYYY-MM-DD'">
              <Radio value="YYYY-MM-DD">2026-09-10</Radio>
              <Radio value="MM/DD/YYYY">09/10/2026</Radio>
              <Radio value="DD/MM/YYYY">10/09/2026</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </Card>

      <!-- 安全 -->
      <Card id="setting-security" shadow="sm" :animate="false">
        <template #header>
          <div class="flex items-center gap-2">
            <ShieldCheck class="h-3.5 w-3.5 text-primary" />
            <span class="text-xs font-extrabold">安全</span>
          </div>
        </template>
        <Form size="md" class="flex max-w-2xl flex-col gap-3">
          <FormItem label="双因子认证">
            <div class="flex items-center gap-2">
              <Switch v-model="login2fa" />
              <Text type="secondary" size="sm">登录时需要 6 位验证码</Text>
            </div>
          </FormItem>
          <FormItem label="会话超时">
            <div class="flex w-full max-w-md items-center gap-3">
              <Slider v-model="sessionTimeout" :min="15" :max="240" :step="15" show-tooltip />
              <Text type="secondary" size="sm" class="w-12 text-right">{{ sessionTimeout }}分</Text>
            </div>
          </FormItem>
          <FormItem label="修改密码">
            <div class="flex flex-wrap items-center gap-2">
              <Input type="password" placeholder="当前密码" class="w-full sm:w-40" />
              <Input type="password" placeholder="新密码" class="w-full sm:w-40" />
              <Button size="sm" variant="outline" @click="Message.success('已提交（演示）')">提交</Button>
            </div>
          </FormItem>
        </Form>
      </Card>

      <!-- 通知 -->
      <Card id="setting-notification" shadow="sm" :animate="false">
        <template #header><span class="text-xs font-extrabold">通知</span></template>
        <Form size="md" class="flex max-w-2xl flex-col gap-3">
          <FormItem label="站内通知">
            <div class="flex items-center gap-2">
              <Switch v-model="notifyInApp" />
              <Text type="secondary" size="sm">开启</Text>
            </div>
          </FormItem>
          <FormItem label="邮件通知">
            <div class="flex items-center gap-2">
              <Switch v-model="notifyMail" />
              <Text type="secondary" size="sm">仅关键事件</Text>
            </div>
          </FormItem>
          <FormItem label="声音提醒">
            <div class="flex items-center gap-2">
              <Switch v-model="notifySound" />
              <Text type="secondary" size="sm">关闭时静音</Text>
            </div>
          </FormItem>
        </Form>
      </Card>

      <!-- 高级 -->
      <Card id="setting-advanced" shadow="sm" :animate="false">
        <template #header>
          <span class="text-xs font-extrabold">高级</span>
          <Chip size="sm" variant="outline">演示</Chip>
        </template>
        <div class="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" :icon="RefreshCcw" @click="resetAll">恢复默认</Button>
          <Button size="sm" variant="ghost" @click="Message.info('已清空本地缓存（演示）')">清空本地缓存</Button>
          <Button size="sm" variant="ghost" @click="Message.info('已导出偏好 JSON（演示）')">导出偏好</Button>
        </div>
      </Card>

      <Divider />

      <div class="flex flex-wrap items-center justify-end gap-2">
        <Button variant="ghost" @click="resetAll">撤销修改</Button>
        <Button variant="primary" :icon="Save" @click="saveAll">保存全部</Button>
      </div>
    </div>
  </div>
</template>
