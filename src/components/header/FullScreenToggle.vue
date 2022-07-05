<template>
  <div class="full-screen-toogle" @click="handleFullScreen">
    <el-icon><full-screen /></el-icon>
  </div>
</template>

<script setup lang="ts">
import { FullScreen } from '@element-plus/icons-vue'
import screenfull from 'screenfull'

const handleFullScreen = () => {
  screenfull.toggle()
}
</script>

<script lang="ts">
export default {
  name: 'FullscreenToggle',
}
</script>

<style scoped lang="scss">
.full-screen-toogle {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  cursor: pointer;
}
</style>
