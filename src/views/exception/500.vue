<template>
  <n-result status="500" title="500 服务器错误" description="该雇更多程序员了">
    <template #footer>
      <n-button @click="historyBack">Back</n-button>
    </template>
  </n-result>
</template>

<script lang="ts" setup>
const historyBack = () => {
  window.history.back()
}
</script>
