<template>
  <div class="header-controller" @click="handleReload">
    <n-icon :size="18" :component="Reload" />
  </div>
</template>

<script setup lang="ts">
import { Reload } from '@vicons/ionicons5'
import useStyleStore from '@/store/modules/style'

const styleStore = useStyleStore()

// 重新渲染路由组件
const handleReload = () => {
  styleStore.isReloading = true
  setTimeout(() => {
    styleStore.isReloading = false
  }, 1)
}
</script>
