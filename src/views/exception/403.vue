<template>
  <el-result
    icon="warning"
    title="403 Forbidden"
    sub-title="无访问权限"
  >
    <template #extra>
      <el-button
        type="primary"
        @click="historyBack"
      >
        Back
      </el-button>
    </template>
  </el-result>
</template>

<script lang="ts" setup>
const historyBack = () => {
  window.history.back()
}
</script>
