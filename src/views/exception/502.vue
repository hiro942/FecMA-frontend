<template>
  <el-result icon="warning" title="502 Bad Gateway" sub-title="请求超时">
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
