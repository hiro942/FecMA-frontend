<template>
  <n-icon
    class="text-2xl hover:rotate-180 duration-500 cursor-pointer"
    @click="handleReload"
  >
    <ReloadCircleOutline />
  </n-icon>
</template>

<script setup lang="ts">
import { ReloadCircleOutline } from '@vicons/ionicons5'
import useStyleStore from '@/store/style'

const styleStore = useStyleStore()

// 重新渲染路由组件
const handleReload = () => {
  styleStore.isReloading = true
  setTimeout(() => {
    styleStore.isReloading = false
  }, 1)
}
</script>
