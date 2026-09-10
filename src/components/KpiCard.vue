<script setup lang="ts">
/**
 * KPI 卡片：把「标题 + 数值 + 涨跌」这三件套收敛成一个组件。
 * 这里也是全项目使用 cn() 合并条件类名的地方 —— 二次封装组件时，
 * 外部传进来的 class 需要能覆盖内部默认样式，cn 负责处理这个优先级。
 */
import { computed } from 'vue'
import { Card, Statistic, Chip, cn } from 'fuxsto-design'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    title: string
    value: number
    precision?: number
    prefix?: string
    suffix?: string
    delta?: number
    hint?: string
    /** 是否处于选中态（用于看板上的联动高亮） */
    active?: boolean
    class?: string
  }>(),
  {
    precision: 0,
    prefix: '',
    suffix: '',
    delta: 0,
    hint: '较上期',
    active: false,
    class: '',
  },
)

const up = computed(() => props.delta >= 0)
</script>

<template>
  <Card
    shadow="sm"
    :animate="false"
    :class="
      cn(
        'flex flex-col gap-1.5 transition-colors',
        props.active ? 'border-primary' : 'border-border',
        props.class,
      )
    "
  >
    <span class="text-xs text-muted-foreground">{{ title }}</span>
    <Statistic
      :value="value"
      :precision="precision"
      :prefix="prefix"
      :suffix="suffix"
      size="md"
      :animate="false"
    />
    <div class="mt-1 flex items-center justify-between gap-2">
      <Chip size="sm" :variant="up ? 'primary' : 'secondary'" :icon="up ? TrendingUp : TrendingDown">
        {{ up ? '+' : '' }}{{ delta }}%
      </Chip>
      <span class="text-[11px] text-muted-foreground">{{ hint }}</span>
    </div>
  </Card>
</template>
