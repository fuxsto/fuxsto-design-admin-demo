<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  Card,
  Form,
  FormItem,
  Input,
  PinInput,
  Button,
  Checkbox,
  Segmented,
  Divider,
  Alert,
  Link,
  Title,
  Text,
  Message,
} from 'fuxsto-design'
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { avatarDataUri } from '@/utils/media'

const router = useRouter()
const userStore = useUserStore()

const mode = ref('password')
const modeOptions = [
  { label: '密码登录', value: 'password' },
  { label: '验证码登录', value: 'code' },
]

const form = reactive({ account: '', password: '' })
const remember = ref(true)
const code = ref('')
const submitting = ref(false)

function submitPassword() {
  if (!form.account.trim()) return Message.warning('请输入账号')
  if (form.password.length < 6) return Message.warning('密码至少 6 位')
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    userStore.login({
      id: 1,
      name: form.account.trim(),
      email: `${form.account.trim()}@example.com`,
      role: 'admin',
      avatar: avatarDataUri(form.account.trim()),
      online: true,
    })
    Message.success('登录成功（演示）')
    router.push('/dashboard')
  }, 700)
}

function submitCode() {
  if (!form.account.trim()) return Message.warning('请输入手机号或邮箱')
  if (code.value.length !== 6) return Message.warning('请输入 6 位验证码')
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    userStore.login({
      id: 1,
      name: form.account.trim(),
      email: `${form.account.trim()}@example.com`,
      role: 'admin',
      avatar: avatarDataUri(form.account.trim()),
      online: true,
    })
    Message.success('登录成功（演示）')
    router.push('/dashboard')
  }, 700)
}

function onSubmit() {
  if (mode.value === 'password') submitPassword()
  else submitCode()
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background p-4">
    <div class="w-full max-w-sm">
      <div class="mb-6 flex flex-col items-center gap-2">
        <div class="flex h-11 w-11 items-center justify-center rounded-base bg-primary text-primary-foreground">
          <ShieldCheck class="h-5 w-5" />
        </div>
        <Title :level="3">Fuxsto Admin Pro</Title>
        <Text type="secondary" size="sm">示例登录页 · 不会校验真实账号</Text>
      </div>

      <Card shadow="md" :animate="false">
        <Segmented v-model="mode" :options="modeOptions" size="sm" block />

        <Divider class="!my-4" />

        <Form :model="form" size="md" class="flex flex-col gap-3" @keyup.enter="onSubmit">
          <FormItem label="账号">
            <Input v-model="form.account" :prefix-icon="Mail" placeholder="手机号 / 邮箱" clearable />
          </FormItem>

          <template v-if="mode === 'password'">
            <FormItem label="密码">
              <Input v-model="form.password" type="password" :prefix-icon="Lock" placeholder="至少 6 位" clearable />
            </FormItem>
          </template>

          <template v-else>
            <FormItem label="验证码">
              <PinInput v-model="code" :length="6" />
              <template #extra>
                <Text type="secondary" size="sm">演示环境不会真的发送验证码</Text>
              </template>
            </FormItem>
          </template>

          <div class="flex flex-wrap items-center justify-between gap-2">
            <Checkbox v-model="remember">记住登录状态</Checkbox>
            <Link href="#/dashboard" size="sm">跳过登录</Link>
          </div>

          <Button variant="primary" :loading="submitting" :icon="LogIn" class="mt-1 w-full" @click="onSubmit">
            登录
          </Button>
        </Form>

        <Divider class="!my-4" />

        <Alert type="info" description="演示环境：任意账号 + 6 位以上密码即可进入。" />
      </Card>

      <div class="mt-4 text-center">
        <Text type="secondary" size="sm">所有数据均为本地生成，仅用于界面演示。</Text>
      </div>
    </div>
  </div>
</template>
