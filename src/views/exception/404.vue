<template>
  <el-result icon="error" title="404 Not Found" sub-title="访问的资源不存在">
    <template #extra>
      <el-button type="primary" @click="historyBack"> Back </el-button>
    </template>
  </el-result>
</template>

<script lang="ts" setup>
const historyBack = () => {
  window.history.back()
}
</script>

<script lang="ts">
export default {
  name: '404',
}
</script>
