<template>
  <div class="full-screen-toggle" @click="onFullScreenToggleClick">
    <el-tooltip effect="light" content="全屏显示">
      <el-icon :size="20"><full-screen /></el-icon>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { FullScreen } from '@element-plus/icons-vue'
import screenfull from 'screenfull'

const onFullScreenToggleClick = () => {
  screenfull.toggle()
}
</script>

<script lang="ts">
export default {
  name: 'FullscreenToggle',
}
</script>

<style scoped lang="scss">
.full-screen-toggle {
  height: 16px;
  width: 16px;
  margin: 0 20px;
  cursor: pointer;
}
</style>
