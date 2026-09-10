<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  Card,
  Form,
  FormItem,
  Input,
  Textarea,
  Select,
  Switch,
  Upload,
  Avatar,
  AvatarGroup,
  Badge,
  Chip,
  Statistic,
  Divider,
  Button,
  Rate,
  Timeline,
  TimelineItem,
  Text,
  Title,
  Message,
  type UploadFile,
} from 'fuxsto-design'
import { Save, Mail, MapPin, Calendar } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { DEPARTMENTS, userList } from '@/mock/data'
import { avatarDataUri } from '@/utils/media'

const userStore = useUserStore()

const form = reactive({
  name: userStore.state.user?.name ?? '演示用户',
  email: userStore.state.user?.email ?? 'demo@example.com',
  title: '前端工程师',
  dept: DEPARTMENTS[0],
  city: '深圳',
  bio: '这是一段示例个人简介，用于演示 Textarea 的字数统计与自适应高度。',
  publicProfile: true,
  weeklyReport: false,
  satisfaction: 4.5,
})

const deptOptions = DEPARTMENTS.map((d) => ({ label: d, value: d }))

const avatarFiles = ref<UploadFile[]>([])
const avatar = computed(() => avatarDataUri(form.name))

const colleagues = userList.slice(0, 5)

const activity = [
  { timestamp: '09-10 10:12', title: '更新了个人资料', description: '示例记录', status: 'primary' as const },
  { timestamp: '09-09 16:40', title: '提交了 2 个变更', description: '示例记录', status: 'success' as const },
  { timestamp: '09-08 09:05', title: '加入了「前端组」', description: '示例记录', status: 'default' as const },
]

function save() {
  Message.success('已保存（演示，不会写入服务器）')
}

function reset() {
  Message.info('已重置为初始值（演示）')
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
    <!-- 左：名片 -->
    <div class="flex flex-col gap-4">
      <Card shadow="sm" :animate="false">
        <div class="flex flex-col items-center gap-3">
          <Avatar :name="form.name" :src="avatar" size="xl" status="online" />
          <div class="text-center">
            <Title :level="4">{{ form.name }}</Title>
            <Text type="secondary" size="sm">{{ form.title }} · {{ form.dept }}</Text>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-1.5">
            <Chip size="sm" variant="primary">在职</Chip>
            <Chip size="sm" variant="outline">示例数据</Chip>
          </div>
          <Divider class="!my-1" />
          <div class="flex w-full flex-col gap-2 text-xs">
            <div class="flex items-center gap-2">
              <Mail class="h-3.5 w-3.5 text-muted-foreground" />
              <span class="truncate">{{ form.email }}</span>
            </div>
            <div class="flex items-center gap-2">
              <MapPin class="h-3.5 w-3.5 text-muted-foreground" />
              <span>{{ form.city }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Calendar class="h-3.5 w-3.5 text-muted-foreground" />
              <span>2023-04-01 入职（示例）</span>
            </div>
          </div>
          <Divider class="!my-1" />
          <div class="grid w-full grid-cols-3 gap-2">
            <div class="text-center">
              <Statistic :value="128" :precision="0" size="sm" :animate="false" />
              <Text type="secondary" size="sm">提交</Text>
            </div>
            <div class="text-center">
              <Statistic :value="42" :precision="0" size="sm" :animate="false" />
              <Text type="secondary" size="sm">评审</Text>
            </div>
            <div class="text-center">
              <Statistic :value="18" :precision="0" size="sm" :animate="false" />
              <Text type="secondary" size="sm">工单</Text>
            </div>
          </div>
        </div>
      </Card>

      <Card shadow="sm" :animate="false">
        <template #header>
          <span class="text-xs font-extrabold">同组成员</span>
          <Badge :value="String(colleagues.length)" variant="secondary" size="sm" />
        </template>
        <AvatarGroup :max="5" size="sm">
          <Avatar v-for="c in colleagues" :key="c.id" :name="c.name" :src="c.avatar" size="sm" />
        </AvatarGroup>
      </Card>
    </div>

    <!-- 右：编辑区 -->
    <div class="flex flex-col gap-4 xl:col-span-2">
      <Card shadow="sm" :animate="false">
        <template #header><span class="text-xs font-extrabold">基本资料</span></template>
        <Form :model="form" size="md" class="flex flex-col gap-3">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormItem label="姓名">
              <Input v-model="form.name" clearable />
            </FormItem>
            <FormItem label="邮箱">
              <Input v-model="form.email" clearable />
            </FormItem>
            <FormItem label="职位">
              <Input v-model="form.title" clearable />
            </FormItem>
            <FormItem label="部门">
              <Select v-model="form.dept" :options="deptOptions" />
            </FormItem>
          </div>

          <FormItem label="个人简介">
            <Textarea v-model="form.bio" :rows="4" :maxlength="200" show-count />
          </FormItem>

          <FormItem label="头像">
            <Upload
              v-model="avatarFiles"
              accept="image/*"
              :max-count="1"
              :auto-upload="false"
              tip="演示环境只做本地选中"
            >
              <Button size="sm" variant="outline">选择图片</Button>
            </Upload>
          </FormItem>

          <Divider class="!my-1" />

          <FormItem label="公开个人主页">
            <div class="flex items-center gap-2">
              <Switch v-model="form.publicProfile" />
              <Text type="secondary" size="sm">开启后同事可见</Text>
            </div>
          </FormItem>
          <FormItem label="订阅周报">
            <div class="flex items-center gap-2">
              <Switch v-model="form.weeklyReport" />
              <Text type="secondary" size="sm">每周一推送</Text>
            </div>
          </FormItem>
          <FormItem label="自评">
            <Rate v-model="form.satisfaction" :count="5" allow-half show-text />
          </FormItem>
        </Form>

        <template #footer>
          <div class="flex flex-wrap items-center gap-2">
            <Button variant="primary" :icon="Save" @click="save">保存</Button>
            <Button variant="ghost" @click="reset">重置</Button>
          </div>
        </template>
      </Card>

      <Card shadow="sm" :animate="false">
        <template #header><span class="text-xs font-extrabold">最近动态</span></template>
        <Timeline>
          <TimelineItem
            v-for="a in activity"
            :key="a.timestamp"
            :title="a.title"
            :description="a.description"
            :timestamp="a.timestamp"
            :status="a.status"
          />
        </Timeline>
      </Card>
    </div>
  </div>
</template>
