<script setup lang="ts">
import { RouterView } from 'vue-router'
import { BackTop } from 'fuxsto-design'
</script>

<template>
  <RouterView />
  <!-- BackTop 默认监听 window 滚动，滚动超过阈值才出现 -->
  <BackTop :visibility-height="240" :right="16" :bottom="24" />
</template>
