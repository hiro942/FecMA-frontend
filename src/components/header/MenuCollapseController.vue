<template>
  <div id="menu-collapse-controller" @click="handleCollapsed">
    <el-icon v-if="!layoutStore.isCollapsed" :size="25">
      <fold />
    </el-icon>
    <el-icon v-else :size="25">
      <expand />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { Expand, Fold } from '@element-plus/icons-vue'
import useStyleStore from '@/store/modules/style'

const layoutStore = useStyleStore()

const handleCollapsed = () => {
  layoutStore.isCollapsed = !layoutStore.isCollapsed
}
</script>

<script lang="ts">
export default {
  name: 'MenuCollapseController',
}
</script>

<style scoped lang="scss">
#menu-collapse-controller {
  padding: 5px;
  cursor: pointer;
}
</style>
