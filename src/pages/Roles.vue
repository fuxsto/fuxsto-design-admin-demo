<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import {
  Card,
  Tree,
  Transfer,
  Button,
  Chip,
  Input,
  Divider,
  Form,
  FormItem,
  Select,
  Drawer,
  Tabs,
  TabViews,
  List,
  ListItem,
  Avatar,
  AvatarGroup,
  Alert,
  Text,
  Message,
  Dialog,
} from 'fuxsto-design'
import { Plus, Search, Save, ShieldCheck, KeyRound, Trash2, Pencil, ChevronRight } from 'lucide-vue-next'
import { roleList, permissionTree, userList, transferData, type RoleItem, type TreeNodeData } from '@/mock/data'

const roles = ref<RoleItem[]>(roleList.map((r) => ({ ...r, permissions: [...r.permissions] })))

const activeRoleId = ref(2)
const activeRole = computed(() => roles.value.find((r) => r.id === activeRoleId.value))

/* ------------------------------------------------------------ 权限树 */

const treeKeyword = ref('')
/**
 * Tree 是「非受控」组件：勾选状态由内部维护，对外通过 update:checked 抛出。
 * 因此这里用 default-checked-keys 设定初值，切换角色时用 :key 强制重挂载，
 * 再用事件把最新勾选结果收上来。
 */
const checkedKeys = ref<string[]>([])
const defaultCheckedKeys = ref<string[]>([])
const expandedKeys = ref<Array<string | number>>(permissionTree.map((g) => g.value))

function filterTree(nodes: TreeNodeData[], keyword: string): TreeNodeData[] {
  const k = keyword.trim().toLowerCase()
  if (!k) return nodes
  const walk = (n: TreeNodeData): TreeNodeData | null => {
    const hit = n.label.toLowerCase().includes(k)
    const children = (n.children ?? []).map(walk).filter(Boolean) as TreeNodeData[]
    if (hit || children.length) return { ...n, children: n.children ? children : undefined }
    return null
  }
  return nodes.map(walk).filter(Boolean) as TreeNodeData[]
}

const filteredTree = computed(() => filterTree(permissionTree, treeKeyword.value))

// 切换角色时重置勾选初值（配合模板上的 :key 触发重挂载）
watch(
  activeRoleId,
  (id) => {
    const r = roles.value.find((x) => x.id === id)
    checkedKeys.value = r ? [...r.permissions] : []
    defaultCheckedKeys.value = r ? [...r.permissions] : []
  },
  { immediate: true },
)

function onTreeChecked(keys: Array<string | number>) {
  checkedKeys.value = keys.map(String)
}

/* -------------------------------------------------------------- 穿梭框 */

const targetKeys = ref<string[]>([])
watch(
  activeRoleId,
  (id) => {
    const r = roles.value.find((x) => x.id === id)
    targetKeys.value = r ? r.permissions.filter((p) => p.startsWith('p_')).map(String) : []
  },
  { immediate: true },
)

/* ---------------------------------------------------------------- Tabs */

const activeTab = ref('tree')
const tabOptions = computed(() => [
  { value: 'tree', label: '权限树' },
  { value: 'transfer', label: '能力穿梭' },
  { value: 'members', label: `成员（${activeRole?.value?.memberIds.length ?? 0}）` },
])

const roleMembers = computed(() => {
  const ids = activeRole.value?.memberIds ?? []
  return userList.filter((u) => ids.includes(u.id))
})

/* ------------------------------------------------------- 新建 / 编辑 */

const drawerOpen = ref(false)
const drawerMode = ref<'create' | 'edit'>('create')
const form = reactive({ id: 0, name: '', code: '', desc: '', status: 'enabled' })

const statusOptions = [
  { label: '启用', value: 'enabled' },
  { label: '停用', value: 'disabled' },
]

function openCreate() {
  drawerMode.value = 'create'
  Object.assign(form, { id: 0, name: '', code: '', desc: '', status: 'enabled' })
  drawerOpen.value = true
}

function openEdit(r: RoleItem) {
  drawerMode.value = 'edit'
  Object.assign(form, { id: r.id, name: r.name, code: r.code, desc: r.desc, status: 'enabled' })
  drawerOpen.value = true
}

function submitRole() {
  if (!form.name.trim()) {
    Message.error('请输入角色名')
    return
  }
  if (drawerMode.value === 'create') {
    roles.value.push({
      id: Date.now(),
      name: form.name,
      code: form.code || form.name.toLowerCase().replace(/\s+/g, '_'),
      desc: form.desc,
      memberIds: [],
      permissions: [],
    })
    Message.success('已创建（演示）')
  } else {
    const r = roles.value.find((x) => x.id === form.id)
    if (r) {
      r.name = form.name
      r.code = form.code
      r.desc = form.desc
    }
    Message.success('已保存（演示）')
  }
  drawerOpen.value = false
}

function deleteRole(r: RoleItem) {
  Dialog.confirm({
    title: `删除角色「${r.name}」？`,
    description: '演示环境不会真的删除数据。',
    danger: true,
    onConfirm: () => {
      roles.value = roles.value.filter((x) => x.id !== r.id)
      Message.success('已删除（演示）')
    },
  })
}

function saveAll() {
  const r = roles.value.find((x) => x.id === activeRoleId.value)
  if (r) r.permissions = [...checkedKeys.value]
  Message.success('权限已保存（演示）')
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 xl:grid-cols-12">
    <!-- 角色列表 -->
    <Card shadow="sm" :animate="false" class="xl:col-span-4" padding="none">
      <template #header>
        <div class="flex items-center gap-2">
          <ShieldCheck class="h-3.5 w-3.5 text-primary" />
          <span class="text-xs font-extrabold">角色列表</span>
          <Chip size="sm" variant="outline">{{ roles.length }}</Chip>
        </div>
        <Button size="sm" variant="primary" :icon="Plus" @click="openCreate">新建</Button>
      </template>

      <div class="flex flex-col gap-1 px-2 pb-2">
        <button
          v-for="r in roles"
          :key="r.id"
          class="rounded-base border p-3 text-left transition-all"
          :class="
            activeRoleId === r.id
              ? 'border-primary bg-primary/5'
              : 'border-transparent hover:border-border hover:bg-muted/40'
          "
          @click="activeRoleId = r.id"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex min-w-0 flex-col leading-tight">
              <div class="flex items-center gap-1.5">
                <span class="truncate text-xs font-bold">{{ r.name }}</span>
                <Chip v-if="r.builtin" size="sm" variant="outline">内置</Chip>
              </div>
              <span class="truncate font-mono text-[11px] text-muted-foreground">{{ r.code }}</span>
            </div>
            <ChevronRight class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </div>
          <p class="mt-1 line-clamp-1 text-[11px] text-muted-foreground">{{ r.desc }}</p>
          <div class="mt-2 flex items-center justify-between">
            <AvatarGroup :max="3" size="sm">
              <Avatar
                v-for="m in roleMembers.slice(0, 3)"
                :key="m.id"
                :name="m.name"
                :src="m.avatar"
                size="sm"
              />
            </AvatarGroup>
            <span class="text-[10px] text-muted-foreground">{{ r.memberIds.length }} 人</span>
          </div>
        </button>
      </div>
    </Card>

    <!-- 权限配置 -->
    <Card shadow="sm" :animate="false" class="xl:col-span-8" padding="none">
      <template #header>
        <div class="flex min-w-0 items-center gap-2">
          <KeyRound class="h-3.5 w-3.5 shrink-0 text-primary" />
          <span class="truncate text-xs font-extrabold">{{ activeRole?.name ?? '未选择' }} 的权限</span>
        </div>
        <div class="flex shrink-0 items-center gap-1.5">
          <Button v-if="activeRole" size="sm" variant="ghost" :icon="Pencil" @click="activeRole && openEdit(activeRole)">
            <span class="hidden sm:inline">编辑</span>
          </Button>
          <Button
            v-if="activeRole && !activeRole.builtin"
            size="sm"
            variant="ghost"
            danger
            :icon="Trash2"
            @click="activeRole && deleteRole(activeRole)"
          >
            <span class="hidden sm:inline">删除</span>
          </Button>
          <Button size="sm" variant="primary" :icon="Save" @click="saveAll">
            <span class="hidden sm:inline">保存</span>
          </Button>
        </div>
      </template>

      <div class="overflow-x-auto px-3 pt-2">
        <Tabs v-model="activeTab" :options="tabOptions" variant="pill" size="sm" />
      </div>
      <Divider class="!my-0" />
      <TabViews v-model="activeTab" :options="tabOptions">
        <!-- 权限树 -->
        <template #tree>
          <div class="flex flex-col gap-3 p-4">
            <Alert type="info" title="父子联动" description="勾选叶子节点即可，父节点的半选状态由组件自动推导。" />
            <Input
              v-model="treeKeyword"
              size="sm"
              class="w-full sm:w-72"
              placeholder="搜索权限"
              :prefix-icon="Search"
              clearable
            />
            <Tree
              :key="activeRoleId"
              :tree-data="filteredTree"
              checkable
              :default-checked-keys="defaultCheckedKeys"
              :default-expanded-keys="expandedKeys"
              size="sm"
              @update:checked="onTreeChecked"
            />
          </div>
        </template>

        <!-- 穿梭框 -->
        <template #transfer>
          <div class="flex flex-col gap-3 p-4">
            <Alert type="info" title="能力穿梭" description="左侧选中后点中间按钮移动到右侧，点保存生效。" />
            <Transfer
              v-model:target-keys="targetKeys"
              :data-source="transferData"
              searchable
              :show-select-all="true"
              :titles="['所有能力', '已授权']"
            />
          </div>
        </template>

        <!-- 成员 -->
        <template #members>
          <div class="p-4">
            <List v-if="roleMembers.length" size="sm" hover split>
              <ListItem v-for="m in roleMembers" :key="m.id">
                <template #prefix>
                  <Avatar :name="m.name" :src="m.avatar" size="sm" />
                </template>
                <template #title>{{ m.name }}</template>
                <template #description>{{ m.email }} · {{ m.department }}</template>
                <template #suffix>
                  <Chip size="sm" variant="outline">{{ m.role }}</Chip>
                </template>
              </ListItem>
            </List>
            <div v-else class="py-6 text-center">
              <Text type="secondary" size="sm">该角色下暂无成员</Text>
            </div>
          </div>
        </template>
      </TabViews>
    </Card>

    <!-- 新建 / 编辑 -->
    <Drawer
      v-model:open="drawerOpen"
      :title="drawerMode === 'create' ? '新建角色' : '编辑角色'"
      placement="right"
      size="sm"
    >
      <Form :model="form" size="md" class="flex flex-col gap-3">
        <FormItem label="角色名称" required>
          <Input v-model="form.name" placeholder="例如：内容审核员" clearable />
        </FormItem>
        <FormItem label="角色代码" required>
          <Input v-model="form.code" placeholder="例如：content_auditor" clearable />
        </FormItem>
        <FormItem label="描述">
          <Input v-model="form.desc" placeholder="简要说明该角色的用途" clearable />
        </FormItem>
        <FormItem label="状态">
          <Select v-model="form.status" :options="statusOptions" />
        </FormItem>
      </Form>

      <template #footer>
        <div class="flex items-center gap-2">
          <Button variant="ghost" @click="drawerOpen = false">取消</Button>
          <Button variant="primary" @click="submitRole">保存</Button>
        </div>
      </template>
    </Drawer>
  </div>
</template>
