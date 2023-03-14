<template>
  <n-form ref="dropoutFormRef" :label-width="80" :model="dropout">
    <n-form-item label="丢弃率" path="rate">
      <n-input-number
        v-model:value="dropout.rate"
        placeholder="请输入"
        min="0"
        max="1"
        step="0.1"
      />
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
const props = defineProps<{ dropout: any }>()
</script>
