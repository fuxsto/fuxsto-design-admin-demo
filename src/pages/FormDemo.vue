<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  Card,
  Form,
  FormItem,
  Input,
  InputNumber,
  Textarea,
  Select,
  AutoComplete,
  Cascader,
  DatePicker,
  TimePicker,
  Switch,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
  Slider,
  Rate,
  ColorPicker,
  Upload,
  Button,
  Divider,
  Chip,
  Tabs,
  TabViews,
  Alert,
  Text,
  Message,
  Notification,
  Dialog,
  type UploadFile,
  type AutoCompleteOption,
  type CascaderOption,
} from 'fuxsto-design'
import { User as UserIcon, Mail, Lock, Send, Save, Calendar, Palette, Image as ImageIcon, Search } from 'lucide-vue-next'

/* ---------------------------------------------------------------- 表单值 */

const form = reactive({
  name: '',
  email: '',
  password: '',
  age: 28,
  bio: '',
  region: [] as Array<string | number>,
  birthday: '' as string,
  dateRange: ['', ''] as [string, string],
  workTime: '',
  notifications: true,
  autoReply: false,
  plan: 'pro',
  features: [] as string[],
  priceRange: [199, 999] as [number, number],
  rating: 4.5,
  themeColor: '#18181b',
  attachments: [] as UploadFile[],
})

const errors = reactive<Record<string, string>>({})

/* ------------------------------------------------------------ 静态选项 */

const planOptions = [
  { label: '免费版', value: 'free' },
  { label: '专业版', value: 'pro' },
  { label: '团队版', value: 'team' },
]

const featureOptions = [
  { label: '数据看板', value: 'dashboard' },
  { label: '权限管理', value: 'perm' },
  { label: '审计日志', value: 'audit' },
  { label: '通知中心', value: 'notify' },
  { label: '数据导出', value: 'export' },
]

const regionOptions: CascaderOption[] = [
  {
    value: 'gd',
    label: '广东省',
    children: [
      {
        value: 'sz',
        label: '深圳市',
        children: [
          { value: 'ns', label: '南山区' },
          { value: 'ft', label: '福田区' },
          { value: 'ba', label: '宝安区' },
        ],
      },
      {
        value: 'gz',
        label: '广州市',
        children: [
          { value: 'th', label: '天河区' },
          { value: 'yx', label: '越秀区' },
        ],
      },
    ],
  },
  {
    value: 'zj',
    label: '浙江省',
    children: [
      {
        value: 'hz',
        label: '杭州市',
        children: [
          { value: 'xh', label: '西湖区' },
          { value: 'bj', label: '滨江区' },
        ],
      },
    ],
  },
  { value: 'sc', label: '四川省', children: [{ value: 'cd', label: '成都市' }] },
]

/* ------------------------------------------------------------ 自动补全 */

// AutoComplete 的 options 必须是 { label, value } 结构，不能直接给字符串数组
const emailQuery = ref('')
const emailSuggestions = computed<AutoCompleteOption[]>(() => {
  const q = emailQuery.value
  if (!q || !q.includes('@')) return []
  const [prefix, suffix = ''] = q.split('@')
  return ['example.com', 'sample.org', 'demo.cn', 'test.io']
    .filter((d) => d.includes(suffix))
    .map((d) => ({ label: `${prefix}@${d}`, value: `${prefix}@${d}` }))
})

const pageQuery = ref('')
const pageOptions: AutoCompleteOption[] = [
  { label: '用户管理', value: 'users' },
  { label: '订单管理', value: 'orders' },
  { label: '权限配置', value: 'roles' },
  { label: '数据展示', value: 'data' },
  { label: '系统设置', value: 'settings' },
]

/* ---------------------------------------------------------------- 校验 */

const validators: Record<string, () => string> = {
  name: () => (form.name.trim().length >= 2 ? '' : '姓名至少 2 位'),
  email: () => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : '邮箱格式不正确'),
  password: () => (form.password.length >= 8 ? '' : '密码至少 8 位'),
  region: () => (form.region.length ? '' : '请选择地区'),
  birthday: () => (form.birthday ? '' : '请选择生日'),
}

function validateField(key: string) {
  const msg = validators[key]?.()
  if (msg) errors[key] = msg
  else delete errors[key]
}

const submitting = ref(false)

async function submit() {
  Object.keys(validators).forEach(validateField)
  if (Object.keys(errors).length) {
    Message.error('请修正表单中的错误')
    return
  }
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    const handle = Dialog.confirm({
      title: '提交成功',
      description: `已收到 ${form.name} 的填写（演示，不会发送到任何服务器）。`,
      onConfirm: () => {
        Message.success('已确认')
      },
      onCancel: () => {
        Notification.success({ title: '已关闭', message: '内容仍保留在表单中' })
      },
    })
    void handle
  }, 800)
}

function reset() {
  Object.assign(form, {
    name: '',
    email: '',
    password: '',
    age: 28,
    bio: '',
    region: [],
    birthday: '',
    dateRange: ['', ''] as [string, string],
    workTime: '',
    notifications: true,
    autoReply: false,
    plan: 'pro',
    features: [],
    priceRange: [199, 999] as [number, number],
    rating: 4.5,
    themeColor: '#18181b',
    attachments: [],
  })
  Object.keys(errors).forEach((k) => delete errors[k])
  Message.info('已重置')
}

/* -------------------------------------------------------------- 上传 */

// Upload 用 v-model 绑定 UploadFile[]；auto-upload=false 时只做本地选中
function beforeUpload(file: UploadFile): boolean {
  if (file.size > 2 * 1024 * 1024) {
    Message.error(`${file.name} 超过 2MB`)
    return false
  }
  return true
}

/* ---------------------------------------------------------------- Tabs */

const tab = ref('basic')
const tabOptions = [
  { value: 'basic', label: '基础录入' },
  { value: 'choice', label: '选择类' },
  { value: 'advanced', label: '高级控件' },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <Alert
      type="info"
      title="表单全集示例"
      description="覆盖 Input / InputNumber / Textarea / AutoComplete / Select / Cascader / DatePicker / TimePicker / Switch / Radio / Checkbox / Slider / Rate / ColorPicker / Upload。"
    />

    <Card shadow="sm" :animate="false" padding="none">
      <div class="overflow-x-auto px-3 pt-3">
        <Tabs v-model="tab" :options="tabOptions" variant="pill" size="sm" />
      </div>
      <Divider class="!my-0" />
      <TabViews v-model="tab" :options="tabOptions">
        <!-- 基础录入 -->
        <template #basic>
          <div class="grid grid-cols-1 gap-x-6 p-4 lg:grid-cols-2">
            <Form :model="form" size="md" class="flex flex-col gap-3">
              <FormItem label="姓名" required :error="errors.name">
                <Input
                  v-model="form.name"
                  :prefix-icon="UserIcon"
                  placeholder="请输入姓名"
                  clearable
                  :error="!!errors.name"
                  @blur="validateField('name')"
                />
              </FormItem>

              <FormItem label="邮箱" required :error="errors.email">
                <Input
                  v-model="form.email"
                  :prefix-icon="Mail"
                  placeholder="you@example.com"
                  clearable
                  :error="!!errors.email"
                  @blur="validateField('email')"
                />
                <template #extra>
                  <Text type="secondary" size="sm">同时作为登录账号</Text>
                </template>
              </FormItem>

              <FormItem label="密码" required :error="errors.password">
                <Input
                  v-model="form.password"
                  type="password"
                  :prefix-icon="Lock"
                  placeholder="至少 8 位"
                  clearable
                  :error="!!errors.password"
                  @blur="validateField('password')"
                />
              </FormItem>

              <FormItem label="年龄">
                <InputNumber v-model="form.age" :min="0" :max="120" :step="1" />
              </FormItem>

              <FormItem label="个人简介">
                <Textarea v-model="form.bio" :rows="4" placeholder="随便写两句" :maxlength="200" show-count />
              </FormItem>
            </Form>

            <Form :model="form" size="md" class="flex flex-col gap-3">
              <FormItem label="所在地区" required :error="errors.region">
                <Cascader
                  v-model="form.region"
                  :options="regionOptions"
                  placeholder="省 / 市 / 区"
                  searchable
                  clearable
                  :error="!!errors.region"
                  @change="validateField('region')"
                />
              </FormItem>

              <FormItem label="生日" required :error="errors.birthday">
                <DatePicker
                  v-model="form.birthday"
                  placeholder="选择日期"
                  clearable
                  :error="!!errors.birthday"
                  @change="validateField('birthday')"
                />
              </FormItem>

              <FormItem label="上班时间">
                <TimePicker v-model="form.workTime" format="HH:mm" placeholder="选择时间" clearable />
              </FormItem>

              <FormItem label="主题色">
                <div class="flex flex-wrap items-center gap-2">
                  <ColorPicker v-model="form.themeColor" :alpha="true" copyable />
                  <Chip size="sm" variant="outline">{{ form.themeColor }}</Chip>
                </div>
              </FormItem>

              <FormItem label="头像">
                <Upload
                  v-model="form.attachments"
                  accept="image/*"
                  :max-count="1"
                  :auto-upload="false"
                  :before-upload="beforeUpload"
                  tip="仅本地选中，不会真实上传"
                >
                  <Button size="sm" variant="outline" :icon="ImageIcon">选择图片</Button>
                </Upload>
              </FormItem>

              <FormItem label="满意度">
                <Rate v-model="form.rating" :count="5" allow-half show-text />
              </FormItem>
            </Form>
          </div>
        </template>

        <!-- 选择类 -->
        <template #choice>
          <div class="grid grid-cols-1 gap-x-6 p-4 lg:grid-cols-2">
            <Form :model="form" size="md" class="flex flex-col gap-3">
              <FormItem label="订阅套餐">
                <Select v-model="form.plan" :options="planOptions" placeholder="选择套餐" clearable />
              </FormItem>

              <FormItem label="页面快速跳转">
                <AutoComplete
                  v-model="pageQuery"
                  :options="pageOptions"
                  placeholder="输入关键字"
                  :prefix-icon="Search"
                  clearable
                />
              </FormItem>

              <FormItem label="邮箱补全">
                <AutoComplete
                  v-model="emailQuery"
                  :options="emailSuggestions"
                  placeholder="输入到 @ 之后会出现候选"
                  clearable
                />
                <template #extra>
                  <Text type="secondary" size="sm">候选必须是 { label, value } 结构</Text>
                </template>
              </FormItem>

              <FormItem label="价格区间（元）">
                <Slider v-model="form.priceRange" range :min="0" :max="2000" :step="50" show-tooltip />
              </FormItem>
            </Form>

            <Form :model="form" size="md" class="flex flex-col gap-3">
              <FormItem label="订阅套餐（单选）">
                <RadioGroup v-model="form.plan">
                  <Radio value="free">免费版</Radio>
                  <Radio value="pro">专业版</Radio>
                  <Radio value="team">团队版</Radio>
                </RadioGroup>
              </FormItem>

              <FormItem label="需要的能力">
                <CheckboxGroup v-model="form.features">
                  <Checkbox v-for="o in featureOptions" :key="o.value" :value="o.value">{{ o.label }}</Checkbox>
                </CheckboxGroup>
                <template #extra>
                  <Text type="secondary" size="sm">已选 {{ form.features.length }} 项</Text>
                </template>
              </FormItem>

              <FormItem label="通知设置">
                <div class="flex flex-col gap-2.5">
                  <div class="flex items-center gap-2">
                    <Switch v-model="form.notifications" />
                    <Text size="sm">接收系统通知</Text>
                  </div>
                  <div class="flex items-center gap-2">
                    <Switch v-model="form.autoReply" />
                    <Text size="sm">自动回复客户咨询</Text>
                  </div>
                </div>
              </FormItem>
            </Form>
          </div>
        </template>

        <!-- 高级控件 -->
        <template #advanced>
          <div class="grid grid-cols-1 gap-x-6 p-4 lg:grid-cols-2">
            <Form :model="form" size="md" class="flex flex-col gap-3">
              <FormItem label="日期范围">
                <DatePicker v-model="form.dateRange" range placeholder="开始 - 结束" clearable />
              </FormItem>

              <FormItem label="带时间的日期">
                <DatePicker v-model="form.birthday" show-time placeholder="日期与时间" clearable />
              </FormItem>

              <FormItem label="竖向滑块">
                <div class="h-32">
                  <Slider v-model="form.rating" :min="0" :max="5" :step="0.5" vertical show-tooltip />
                </div>
              </FormItem>
            </Form>

            <Form :model="form" size="md" class="flex flex-col gap-3">
              <FormItem label="地区（可搜索）">
                <Cascader v-model="form.region" :options="regionOptions" searchable clearable placeholder="搜索并选择" />
              </FormItem>

              <FormItem label="附件（拖拽）">
                <Upload
                  v-model="form.attachments"
                  drag
                  multiple
                  :max-count="5"
                  :auto-upload="false"
                  :before-upload="beforeUpload"
                  tip="最多 5 个文件，单个不超过 2MB"
                >
                  <div class="flex flex-col items-center gap-1 py-3">
                    <ImageIcon class="h-5 w-5 text-muted-foreground" />
                    <Text size="sm">点击或拖拽文件至此</Text>
                  </div>
                </Upload>
              </FormItem>

              <FormItem label="当前配色">
                <div class="flex flex-wrap items-center gap-2">
                  <ColorPicker v-model="form.themeColor" :alpha="true" />
                  <code class="rounded-base bg-muted px-1.5 py-0.5 font-mono text-[11px]">{{ form.themeColor }}</code>
                </div>
              </FormItem>
            </Form>
          </div>
        </template>
      </TabViews>
    </Card>

    <div class="flex flex-wrap items-center justify-end gap-2">
      <Chip size="sm" variant="outline">{{ Object.keys(errors).length }} 处待修正</Chip>
      <Button variant="ghost" :icon="Save" @click="reset">重置</Button>
      <Button variant="primary" :loading="submitting" :icon="Send" @click="submit">提交</Button>
    </div>
  </div>
</template>
