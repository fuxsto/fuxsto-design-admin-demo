<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { Result, Button } from 'fuxsto-design'
import { Home } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
    <Result status="warning" title="404" :description="`没有找到路径 ${String(route.fullPath)} 对应的页面。`">
      <template #extra>
        <Button variant="primary" :icon="Home" @click="router.push('/dashboard')">返回工作台</Button>
      </template>
    </Result>
  </div>
</template>
