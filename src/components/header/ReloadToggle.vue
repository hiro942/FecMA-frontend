<template>
  <div id="reload-toggle" @click="handleReload">
    <el-tooltip effect="light" content="刷新">
      <el-icon :size="18">
        <refresh />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'
import useStyleStore from '@/store/modules/style'

const styleStore = useStyleStore()

// 重新挂载路由组件
const handleReload = () => {
  styleStore.isReloading = true
  setTimeout(() => {
    styleStore.isReloading = false
  }, 1)
}
</script>

<script lang="ts">
export default {
  name: 'ReloadToggle',
}
</script>

<style scoped lang="scss">
#reload-toggle {
  margin: 0 20px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}
</style>
