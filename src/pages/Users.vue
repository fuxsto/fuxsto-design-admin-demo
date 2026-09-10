<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Card,
  Table,
  Pagination,
  Input,
  Select,
  Button,
  Chip,
  Drawer,
  Form,
  FormItem,
  Avatar,
  Switch,
  Popconfirm,
  Tooltip,
  Segmented,
  ContextMenu,
  Empty,
  Loading,
  Skeleton,
  Message,
  Dialog,
  Divider,
  RadioGroup,
  Radio,
  Text,
  type TableColumn,
} from 'fuxsto-design'

/** Menu / ContextMenu 的 options 结构（库未导出该类型，这里本地声明） */
interface MenuItem {
  label: string
  value: string | number
  disabled?: boolean
  icon?: unknown
  danger?: boolean
}
import { Search, RefreshCcw, Plus, Pencil, Trash2, KeyRound, Eye, Mail } from 'lucide-vue-next'
import { userList, DEPARTMENTS, type UserRow, type UserRole, type UserStatus } from '@/mock/data'

const router = useRouter()

/* ------------------------------------------------------------ 筛选状态 */

const keyword = ref('')
const dept = ref('')
const status = ref('')
const seg = ref<'all' | 'active' | 'pending' | 'disabled'>('all')
const loading = ref(false)

const current = ref(1)
const pageSize = ref(8)
const selected = ref<Array<string | number>>([])

const segOptions = [
  { label: '全部', value: 'all' },
  { label: '活跃', value: 'active' },
  { label: '待激活', value: 'pending' },
  { label: '停用', value: 'disabled' },
]

const deptOptions = [
  { label: '全部部门', value: '' },
  ...DEPARTMENTS.map((d) => ({ label: d, value: d })),
]

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '活跃', value: 'active' },
  { label: '待激活', value: 'pending' },
  { label: '停用', value: 'disabled' },
]

const filtered = computed(() =>
  userList.filter((u) => {
    if (seg.value !== 'all' && u.status !== seg.value) return false
    if (dept.value && u.department !== dept.value) return false
    if (status.value && u.status !== status.value) return false
    if (keyword.value) {
      const k = keyword.value.trim().toLowerCase()
      if (!u.name.toLowerCase().includes(k) && !u.email.toLowerCase().includes(k)) return false
    }
    return true
  }),
)

const paged = computed(() =>
  filtered.value.slice((current.value - 1) * pageSize.value, current.value * pageSize.value),
)

function resetPage() {
  current.value = 1
  selected.value = []
}

function reload() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    Message.success('已刷新（演示）')
  }, 600)
}

function clearFilter() {
  keyword.value = ''
  dept.value = ''
  status.value = ''
  seg.value = 'all'
  resetPage()
}

/* -------------------------------------------------------------- 表格列 */

const columns: TableColumn[] = [
  { key: 'name', title: '成员', width: 220, sortable: true },
  { key: 'department', title: '部门', width: 110 },
  { key: 'role', title: '角色', width: 100, align: 'center' },
  { key: 'status', title: '状态', width: 110, align: 'center' },
  { key: 'lastLogin', title: '最近登录', width: 150 },
  { key: 'action', title: '操作', width: 180, align: 'right' },
]

const roleText: Record<UserRole, string> = { admin: '管理员', manager: '主管', user: '成员' }
const statusText: Record<UserStatus, string> = { active: '活跃', pending: '待激活', disabled: '停用' }

/* ------------------------------------------------------------ 行操作 */

function gotoDetail(row: UserRow) {
  router.push(`/detail/${row.id}`)
}

function resetPassword(row: UserRow) {
  Dialog.confirm({
    title: `重置 ${row.name} 的密码？`,
    description: '演示环境不会真的发送邮件。',
    onConfirm: () => {
      Message.success(`已触发重置流程（${row.email}）`)
    },
  })
}

function removeUser(row: UserRow) {
  Message.success(`已删除 ${row.name}（演示，未修改数据）`)
}

function batchRemove() {
  Dialog.confirm({
    title: `删除选中的 ${selected.value.length} 个成员？`,
    description: '演示环境不会真的修改数据。',
    danger: true,
    onConfirm: () => {
      const n = selected.value.length
      selected.value = []
      Message.success(`已删除 ${n} 项（演示）`)
    },
  })
}

/* -------------------------------------------------------- 右键菜单 */

const contextRow = ref<UserRow | null>(null)
const contextMenuOptions: MenuItem[][] = [
  [
    { label: '查看详情', value: 'detail' },
    { label: '编辑', value: 'edit' },
  ],
  [{ label: '删除', value: 'delete', danger: true }],
]

function onContextSelect(opt: MenuItem) {
  const row = contextRow.value
  if (!row) return
  if (opt.value === 'detail') gotoDetail(row)
  else if (opt.value === 'edit') openEdit(row)
  else if (opt.value === 'delete') removeUser(row)
}

/* ------------------------------------------------------------ 抽屉表单 */

const drawerOpen = ref(false)
const drawerMode = ref<'create' | 'edit'>('create')
const form = reactive({
  id: 0,
  name: '',
  email: '',
  role: 'user' as UserRole,
  status: 'active' as UserStatus,
  department: '',
})
const errors = reactive<Record<string, string>>({})

function clearErrors() {
  Object.keys(errors).forEach((k) => delete errors[k])
}

function openCreate() {
  drawerMode.value = 'create'
  Object.assign(form, { id: 0, name: '', email: '', role: 'user', status: 'active', department: '' })
  clearErrors()
  drawerOpen.value = true
}

function openEdit(row: UserRow) {
  drawerMode.value = 'edit'
  Object.assign(form, {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    department: row.department,
  })
  clearErrors()
  drawerOpen.value = true
}

function validate() {
  clearErrors()
  if (!form.name.trim()) errors.name = '姓名不能为空'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = '邮箱格式不正确'
  if (!form.department) errors.department = '请选择部门'
  return Object.keys(errors).length === 0
}

function submit() {
  if (!validate()) {
    Message.error('请修正表单中的错误')
    return
  }
  drawerOpen.value = false
  Message.success(drawerMode.value === 'create' ? '已创建（演示）' : '已保存（演示）')
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <Card shadow="sm" :animate="false" padding="none">
      <!-- 工具条：窄屏纵向堆叠 -->
      <div class="flex flex-col gap-3 p-3 sm:p-4">
        <div class="flex flex-wrap items-center gap-2">
          <Input
            v-model="keyword"
            size="sm"
            class="w-full sm:w-56"
            placeholder="搜索姓名 / 邮箱"
            :prefix-icon="Search"
            clearable
            @update:model-value="resetPage"
          />
          <Select v-model="dept" :options="deptOptions" size="sm" class="w-full sm:w-36" @change="resetPage" />
          <Select v-model="status" :options="statusOptions" size="sm" class="w-full sm:w-36" @change="resetPage" />
          <Button variant="ghost" size="sm" :icon="RefreshCcw" @click="reload">刷新</Button>
          <div class="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" :icon="Mail" :disabled="!selected.length" @click="Message.info('已发送（演示）')">
              通知
            </Button>
            <Button variant="primary" size="sm" :icon="Plus" @click="openCreate">新建</Button>
          </div>
        </div>

        <Segmented v-model="seg" :options="segOptions" size="sm" block @change="resetPage" />
      </div>

      <!-- 表格：窄屏横向滚动，避免列被挤压变形 -->
      <div class="px-3 pb-2 sm:px-4">
        <ContextMenu :options="contextMenuOptions" @select="onContextSelect">
          <div class="overflow-x-auto">
            <div class="min-w-[880px]">
              <Loading :loading="loading" tip="加载中…">
                <Table
                  v-model:selected-row-keys="selected"
                  :columns="columns"
                  :data="paged"
                  row-key="id"
                  size="sm"
                  selectable
                  :animate="false"
                  @row-click="(row: UserRow) => (contextRow = row)"
                >
                  <template #cell-name="{ row }">
                    <div class="flex items-center gap-2.5">
                      <Avatar :name="row.name" :src="row.avatar" :status="row.online ? 'online' : 'offline'" size="sm" />
                      <div class="flex min-w-0 flex-col leading-tight">
                        <span class="truncate font-bold">{{ row.name }}</span>
                        <span class="truncate text-[11px] text-muted-foreground">{{ row.email }}</span>
                      </div>
                    </div>
                  </template>

                  <template #cell-role="{ row }">
                    <Chip size="sm" :variant="row.role === 'admin' ? 'primary' : row.role === 'manager' ? 'secondary' : 'outline'">
                      {{ roleText[row.role as UserRole] }}
                    </Chip>
                  </template>

                  <template #cell-status="{ row }">
                    <Chip size="sm" :variant="row.status === 'active' ? 'primary' : row.status === 'pending' ? 'secondary' : 'outline'">
                      {{ statusText[row.status as UserStatus] }}
                    </Chip>
                  </template>

                  <template #cell-action="{ row }">
                    <div class="inline-flex items-center gap-1">
                      <Tooltip content="查看详情">
                        <Button size="sm" variant="ghost" :icon="Eye" :animate="false" @click.stop="gotoDetail(row)" />
                      </Tooltip>
                      <Tooltip content="编辑">
                        <Button size="sm" variant="ghost" :icon="Pencil" :animate="false" @click.stop="openEdit(row)" />
                      </Tooltip>
                      <Tooltip content="重置密码">
                        <Button size="sm" variant="ghost" :icon="KeyRound" :animate="false" @click.stop="resetPassword(row)" />
                      </Tooltip>
                      <Popconfirm title="删除该成员？" description="演示环境不会真的删除" danger @confirm="removeUser(row)">
                        <Button size="sm" variant="ghost" danger :icon="Trash2" :animate="false" @click.stop />
                      </Popconfirm>
                    </div>
                  </template>
                </Table>
              </Loading>
            </div>
          </div>
        </ContextMenu>

        <Empty v-if="!filtered.length" title="没有匹配的成员" description="试着调整关键词或筛选条件">
          <template #extra>
            <Button size="sm" variant="outline" @click="clearFilter">清除筛选</Button>
          </template>
        </Empty>
        <Skeleton v-else-if="loading" :rows="3" class="mt-2" />
      </div>

      <div v-if="filtered.length" class="flex flex-col gap-3 border-t border-border px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <Text type="secondary" size="sm">共 {{ filtered.length }} 条 · 已选 {{ selected.length }} 条</Text>
        <div class="overflow-x-auto">
          <Pagination
            v-model:current="current"
            v-model:page-size="pageSize"
            :total="filtered.length"
            :page-sizes="[8, 16, 32]"
            size="sm"
            show-total
            show-size-changer
          />
        </div>
      </div>
    </Card>

    <!-- 批量操作条 -->
    <Card v-if="selected.length" shadow="lg" :animate="false">
      <div class="flex flex-wrap items-center gap-2">
        <Text size="sm">已选 <b>{{ selected.length }}</b> 项</Text>
        <Divider direction="vertical" class="hidden sm:block" />
        <Button size="sm" variant="outline" :icon="Mail" @click="Message.info('已发送（演示）')">发送通知</Button>
        <Button size="sm" variant="ghost" @click="selected = []">取消选择</Button>
        <Popconfirm title="确认删除所选成员？" description="演示环境不会真的删除" danger @confirm="batchRemove">
          <Button size="sm" variant="outline" danger :icon="Trash2">批量删除</Button>
        </Popconfirm>
      </div>
    </Card>

    <!-- 抽屉表单 -->
    <Drawer
      v-model:open="drawerOpen"
      :title="drawerMode === 'create' ? '新建成员' : '编辑成员'"
      :description="drawerMode === 'create' ? '填写成员信息后可分配角色与部门' : '修改后点保存即可生效'"
      placement="right"
      size="md"
    >
      <Form :model="form" size="md" class="flex flex-col gap-3">
        <FormItem label="姓名" required :error="errors.name">
          <Input v-model="form.name" placeholder="请输入姓名" clearable :error="!!errors.name" />
        </FormItem>
        <FormItem label="邮箱" required :error="errors.email">
          <Input v-model="form.email" placeholder="you@example.com" clearable :error="!!errors.email" />
        </FormItem>
        <FormItem label="部门" required :error="errors.department">
          <Select
            v-model="form.department"
            :options="deptOptions.filter((d) => d.value)"
            placeholder="选择部门"
            :error="!!errors.department"
          />
        </FormItem>
        <FormItem label="角色">
          <RadioGroup v-model="form.role">
            <Radio value="user">成员</Radio>
            <Radio value="manager">主管</Radio>
            <Radio value="admin">管理员</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="状态">
          <div class="flex items-center gap-2">
            <Switch
              :model-value="form.status === 'active'"
              @update:model-value="(v: boolean) => (form.status = v ? 'active' : 'disabled')"
            />
            <Text type="secondary" size="sm">{{ form.status === 'active' ? '活跃' : '停用' }}</Text>
          </div>
        </FormItem>
      </Form>

      <template #footer>
        <div class="flex items-center gap-2">
          <Button variant="ghost" @click="drawerOpen = false">取消</Button>
          <Button variant="primary" @click="submit">{{ drawerMode === 'create' ? '创建' : '保存' }}</Button>
        </div>
      </template>
    </Drawer>
  </div>
</template>
