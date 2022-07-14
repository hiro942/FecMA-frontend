<template>
  <div class="full-screen-toggle" @click="onFullScreenToggleClick">
    <el-icon :size="20"><full-screen /></el-icon>
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
  margin: 0 15px;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  cursor: pointer;
}
</style>
