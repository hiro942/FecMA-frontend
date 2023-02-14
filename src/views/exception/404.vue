<template>
  <n-result
    status="404"
    title="404 资源不存在"
    description="访问的资源不存在 :("
  >
    <template #footer>
      <n-button @click="historyBack">找点其他东西吧</n-button>
    </template>
  </n-result>
</template>

<script lang="ts" setup>
const historyBack = () => {
  window.history.back()
}
</script>
